/**
 * Diamond PDQSort (Block-Default Variant)
 * * Strategy: Block Partitioning by Default
 * * Optimization: Assumes random data, maximizes ILP immediately.
 * * Fallback: Scalar cleanup only when blocks don't fit.
 */

import { runAll, type NumericArray } from "./test_harness";

// --- Configuration ---
const INSERTION_SORT_THRESHOLD = 24;
const NINTHER_THRESHOLD = 128;
const BLOCK_SIZE = 64; 

// Static buffer for Block Mode offsets (0..63 for Left, 64..127 for Right)
// Global to avoid allocation in the hot loop.
const OFFSET_BUFFER = new Uint8Array(BLOCK_SIZE * 2);

// --- Primitives ---

function swap(A: NumericArray, i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function reverseRange(A: NumericArray, start: number, end: number) {
    while (start < end) {
        const tmp = A[start];
        A[start] = A[end];
        A[end] = tmp;
        start++;
        end--;
    }
}

function insertionSort(A: NumericArray, start: number, end: number) {
    for (let i = start + 1; i <= end; i++) {
        const val = A[i];
        let j = i;
        while (j > start && A[j - 1] > val) {
            A[j] = A[j - 1];
            j--;
        }
        A[j] = val;
    }
}

function partialInsertionSort(A: NumericArray, start: number, end: number): boolean {
    let limit = 8;
    for (let i = start + 1; i <= end; i++) {
        const val = A[i];
        let j = i;
        while (j > start && A[j - 1] > val) {
            if (limit-- === 0) {
                A[j] = val;
                return false; 
            }
            A[j] = A[j - 1];
            j--;
        }
        A[j] = val;
    }
    return true;
}

function sort3(A: NumericArray, a: number, b: number, c: number) {
    if (A[b] < A[a]) swap(A, a, b);
    if (A[c] < A[b]) swap(A, b, c);
    if (A[b] < A[a]) swap(A, a, b);
}

function shufflePattern(A: NumericArray, start: number, end: number) {
    const len = end - start + 1;
    const k = Math.floor(len / 2);
    if (len > 8) {
        swap(A, start, start + k);
        swap(A, end, start + k + 1);
    }
}

// --- 3-Way Partition (Dutch National Flag) ---
// Used only when p and r are equal (heuristic for many duplicates)
function partition3Way(A: NumericArray, p: number, r: number): [number, number] {
    const pivot = A[p];
    let i = p;
    let j = p;
    let k = r;

    while (j <= k) {
        const val = A[j];
        if (val < pivot) {
            swap(A, i, j);
            i++;
            j++;
        } else if (val > pivot) {
            swap(A, j, k);
            k--;
        } else {
            j++;
        }
    }
    return [i, k];
}

// --- Run Detection ---
function checkAndFixRun(A: NumericArray, p: number, r: number): boolean {
    const n = r - p + 1;
    if (n < 4) return false;

    let ascending = true;
    let descending = true;
    for (let k = 0; k < 3; k++) {
        if (A[p + k] > A[p + k + 1]) ascending = false;
        if (A[p + k] < A[p + k + 1]) descending = false;
    }

    if (!ascending && !descending) return false;

    if (ascending) {
        let scanner = p + 1;
        while (scanner <= r && A[scanner - 1] <= A[scanner]) scanner++;
        if (scanner > r) return true; 
    } else if (descending) {
        let scanner = p + 1;
        while (scanner <= r && A[scanner - 1] >= A[scanner]) scanner++;
        if (scanner > r) {
            reverseRange(A, p, r);
            return true; 
        }
    }
    return false;
}

// --- UNIFIED BLOCK PARTITION (Default) ---
// Attempts block partitioning immediately. 
// Automatically degrades to scalar loop if (j-i) is too small.
function partitionBlock(A: NumericArray, start: number, end: number): [number, boolean] {
    const pivot = A[start];
    let i = start + 1;
    let j = end;
    let anySwaps = false;
    
    const offsets = OFFSET_BUFFER; 
    const rStartIdx = BLOCK_SIZE; // 64

    // --- PHASE 1: BLOCK MODE ---
    while (true) {
        // Ensure enough data exists for a full block operation
        if (j - i < 2 * BLOCK_SIZE) break;

        // 1. Fill Left Offsets (0..63)
        // Uses branchless accumulation: `+boolean` is 1 or 0.
        let numL = 0;
        let base = i;
        let k = 0;
        
        // Unrolled loop (Stride 4)
        for (; k + 4 <= BLOCK_SIZE; k += 4) {
            offsets[numL] = k;     numL += +(A[base + k]     > pivot);
            offsets[numL] = k + 1; numL += +(A[base + k + 1] > pivot);
            offsets[numL] = k + 2; numL += +(A[base + k + 2] > pivot);
            offsets[numL] = k + 3; numL += +(A[base + k + 3] > pivot);
        }
        for (; k < BLOCK_SIZE; ++k) {
            offsets[numL] = k; numL += +(A[base + k] > pivot);
        }

        // 2. Fill Right Offsets (64..127)
        let numR = 0;
        base = j;
        k = 0;

        for (; k + 4 <= BLOCK_SIZE; k += 4) {
            offsets[rStartIdx + numR] = k;     numR += +(A[base - k]       < pivot);
            offsets[rStartIdx + numR] = k + 1; numR += +(A[base - (k + 1)] < pivot);
            offsets[rStartIdx + numR] = k + 2; numR += +(A[base - (k + 2)] < pivot);
            offsets[rStartIdx + numR] = k + 3; numR += +(A[base - (k + 3)] < pivot);
        }
        for (; k < BLOCK_SIZE; ++k) {
            offsets[rStartIdx + numR] = k; numR += +(A[base - k] < pivot);
        }

        // 3. Swap Collisions
        const swaps = numL < numR ? numL : numR;
        if (swaps > 0) anySwaps = true;
        
        for (let x = 0; x < swaps; x++) {
            const idxL = i + offsets[x];
            const idxR = j - offsets[rStartIdx + x];
            const tmp = A[idxL];
            A[idxL] = A[idxR];
            A[idxR] = tmp;
        }

        // 4. Advance Pointers
        i += BLOCK_SIZE;
        j -= BLOCK_SIZE;

        // 5. Handle Imbalance
        if (numL !== numR) {
            if (numL > numR) i -= BLOCK_SIZE; 
            else j += BLOCK_SIZE; 
        }
    }

    // --- PHASE 2: SCALAR CLEANUP ---
    // Handles the remaining elements or the whole array if it was small.
    while (true) {
        while (i <= j && A[i] < pivot) i++;
        while (j > start && A[j] > pivot) j--;
        
        if (i >= j) break;
        
        swap(A, i, j);
        anySwaps = true;
        i++; j--;
    }

    swap(A, start, j); // Place pivot
    return [j, !anySwaps]; 
}

// --- Heapsort Fallback ---
function floatDown(A: NumericArray, p: number, r: number, i: number) {
    while (true) {
        const left = 2 * i - p + 1;
        const right = left + 1;
        let largest = i;

        if (left <= r && A[left] > A[largest]) largest = left;
        if (right <= r && A[right] > A[largest]) largest = right;

        if (largest === i) break;

        swap(A, i, largest);
        i = largest;
    }
}

function heapsort(A: NumericArray, p: number, r: number) {
    const n = r - p + 1;
    const mid = Math.floor(n / 2) + p - 1;
    
    for (let i = mid; i >= p; i--) floatDown(A, p, r, i);
    for (let i = r; i > p; i--) {
        swap(A, p, i);
        floatDown(A, p, i - 1, p);
    }
}

// --- Main Loop ---
function pdqLoop(A: NumericArray, p: number, r: number, limit: number, badAllowed: number, leftmost: boolean) {
    while (true) {
        const n = r - p + 1;

        if (n <= INSERTION_SORT_THRESHOLD) {
            insertionSort(A, p, r);
            return;
        }

        if (badAllowed === 8) {
            if (checkAndFixRun(A, p, r)) return;
        }

        if (limit <= 0) {
            heapsort(A, p, r);
            return;
        }

        // Ninther Pivot Selection
        const mid = p + (n >> 1);
        if (n > NINTHER_THRESHOLD) {
            const s = n >> 3;
            sort3(A, p, p + s, p + 2 * s);
            sort3(A, mid - s, mid, mid + s);
            sort3(A, r - 2 * s, r - s, r);
            sort3(A, p + s, mid, r - s);
        } else {
            sort3(A, p, mid, r);
        }

        // Duplicate Handling (3-Way)
        if (A[p] === A[r]) {
            const [i, k] = partition3Way(A, p, r);
            if (i > p) pdqLoop(A, p, i - 1, limit - 1, badAllowed, leftmost);
            p = k + 1;
            leftmost = false;
            limit--;
            continue;
        }

        // Standard Partition (Block Default)
        swap(A, p, mid);
        const [pivotIdx, wasClean] = partitionBlock(A, p, r);

        if (wasClean) {
            if (partialInsertionSort(A, p, pivotIdx) && 
                partialInsertionSort(A, pivotIdx + 1, r)) {
                return;
            }
        }

        const leftLen = pivotIdx - p;
        const rightLen = r - pivotIdx;
        
        if (leftLen < (n >> 3) || rightLen < (n >> 3)) {
            badAllowed--;
            if (badAllowed === 0) {
                shufflePattern(A, p, r);
                badAllowed = 4;
                continue;
            }
            limit--;
        } else {
            if (badAllowed < 8) badAllowed++;
        }

        limit--;

        if (leftLen < rightLen) {
            if (leftLen > 0) pdqLoop(A, p, pivotIdx - 1, limit, badAllowed, leftmost);
            p = pivotIdx + 1;
            leftmost = false;
        } else {
            if (rightLen > 0) pdqLoop(A, pivotIdx + 1, r, limit, badAllowed, false);
            r = pivotIdx - 1;
        }
        if (p >= r) return;
    }
}

export function pdqsort(A: NumericArray) {
    if (A.length < 2) return;
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    pdqLoop(A, 0, A.length - 1, maxDepth, 8, true);
}

runAll(pdqsort, "diamond_pdq_block_default");
