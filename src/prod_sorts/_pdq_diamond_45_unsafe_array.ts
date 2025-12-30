/**
 * Diamond-Polished PDQSort v4.5 (TypeScript Variant) - number[] version
 * * Logic Ported from diamond_v45_bitmask.hpp:
 * 1. Adaptive Vergesort: Fail-fast pattern detection and merging.
 * 2. Smart Optimistic IS: Fixes "Small Random" regression by verifying N > 64 and Swap Count.
 * 3. Partitioning: Uses Scalar Block ILP (JS-optimized) instead of C++ Bitmasks.
 */

import { benchmarkArray } from "./benchmark";

// --- Configuration ---
const INSERTION_SORT_THRESHOLD = 24;
const NINTHER_THRESHOLD = 128;
const BLOCK_SIZE = 64; 

// Vergesort Constants
const VERGESORT_MIN_SIZE = 1024;
const VERGESORT_MAX_RUNS = 12;
const VERGESORT_BAIL_RUNS = 24;

// Static buffer for Block Mode offsets (0..63 for Left, 64..127 for Right)
const OFFSET_BUFFER = new Uint8Array(BLOCK_SIZE * 2);

// --- Primitives ---

function swap(A: number[], i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function reverseRange(A: number[], start: number, end: number) {
    while (start < end) {
        const tmp = A[start];
        A[start] = A[end];
        A[end] = tmp;
        start++;
        end--;
    }
}

function insertionSort(A: number[], start: number, end: number) {
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

// Updated Partial Insertion Sort (Smart Limit)
function partialInsertionSort(A: number[], start: number, end: number, limit: number): boolean {
    for (let i = start + 1; i <= end; i++) {
        if (limit-- < 0) return false;

        const val = A[i];
        let j = i;
        
        // Fast path check
        if (j > start && A[j - 1] > val) {
            while (j > start && A[j - 1] > val) {
                A[j] = A[j - 1];
                j--;
            }
            A[j] = val;
        }
    }
    return true;
}

function sort3(A: number[], a: number, b: number, c: number) {
    if (A[b] < A[a]) swap(A, a, b);
    if (A[c] < A[b]) swap(A, b, c);
    if (A[b] < A[a]) swap(A, a, b);
}

function shufflePattern(A: number[], start: number, end: number) {
    const len = end - start + 1;
    const k = Math.floor(len / 2);
    if (len > 8) {
        swap(A, start, start + k);
        swap(A, end, start + k + 1);
    }
}

// --- 3-Way Partition (Dutch National Flag) ---
function partition3Way(A: number[], p: number, r: number): [number, number] {
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

// --- Run Detection & Vergesort Logic ---

function checkSortedRun(A: number[], p: number, r: number): boolean {
    const n = r - p + 1;
    if (n < 4) return false;

    let ascending = true;
    let descending = true;
    // Check first few elements to guess pattern
    for (let k = 0; k < 3; k++) {
        if (A[p + k] > A[p + k + 1]) ascending = false;
        if (A[p + k] < A[p + k + 1]) descending = false;
    }

    if (!ascending && !descending) return false;

    if (ascending) {
        let scanner = p + 1;
        while (scanner <= r && A[scanner - 1] <= A[scanner]) scanner++;
        return scanner > r; 
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

// Counts the length of a run (ascending or strictly descending)
// If strictly descending, it reverses it to make it ascending.
function countRunAsc(A: number[], lo: number, hi: number): number {
    if (lo >= hi) return 1;

    let runEnd = lo + 1;
    if (A[runEnd] < A[lo]) {
        // Descending
        while (runEnd <= hi && A[runEnd] < A[runEnd - 1]) runEnd++;
        reverseRange(A, lo, runEnd - 1);
    } else {
        // Ascending
        while (runEnd <= hi && A[runEnd] >= A[runEnd - 1]) runEnd++;
    }
    return runEnd - lo;
}

function mergeRuns(A: number[], lo: number, mid: number, hi: number, buffer: number[]) {
    const leftLen = mid - lo;
    
    // Copy left run to buffer
    for (let i = 0; i < leftLen; i++) {
        buffer[i] = A[lo + i];
    }

    let i = 0; // buffer index
    let j = mid; // right run index (in A)
    let k = lo; // dest index (in A)

    while (i < leftLen && j < hi) {
        if (A[j] < buffer[i]) {
            A[k++] = A[j++];
        } else {
            A[k++] = buffer[i++];
        }
    }
    
    while (i < leftLen) {
        A[k++] = buffer[i++];
    }
}

function tryVergesort(A: number[], start: number, end: number): boolean {
    const n = end - start;
    if (n < VERGESORT_MIN_SIZE) return false;

    let minAvgRun = n >> 6;
    if (minAvgRun < 64) minAvgRun = 64;

    const runs: {start: number, len: number}[] = [];
    
    let current = start;
    let shortestRun = n;

    while (current < end) {
        const runLen = countRunAsc(A, current, end - 1);
        runs.push({ start: current, len: runLen });
        
        if (runLen < shortestRun) shortestRun = runLen;
        current += runLen;

        // Fail fast if too many runs (indicates random data)
        if (runs.length > VERGESORT_BAIL_RUNS) return false;
    }

    if (shortestRun < minAvgRun / 4) return false;

    const avgRun = n / runs.length;
    if (runs.length > VERGESORT_MAX_RUNS || avgRun < minAvgRun) {
        return false;
    }

    // --- Merge Logic ---
    if (runs.length === 1) return true;

    // Buffer needed for merging. 
    // FIXED: Start with N/2, but allow expansion if a left-run is larger.
    let buffer = new Array<number>((n >> 1) + 1);

    if (runs.length === 2) {
        const mid = runs[1].start;
        const leftLen = mid - start;
        if (leftLen > buffer.length) buffer = new Array<number>(leftLen); // Resize fix
        mergeRuns(A, start, mid, end, buffer);
        return true;
    }

    // Pairwise merge loop
    let currentRuns = runs;
    while (currentRuns.length > 1) {
        const nextRuns: {start: number, len: number}[] = [];
        
        for (let i = 0; i < currentRuns.length - 1; i += 2) {
            const r1 = currentRuns[i];
            const r2 = currentRuns[i+1];
            const mergeEnd = (i + 2 < currentRuns.length) ? currentRuns[i+2].start : end;
            
            const leftLen = r2.start - r1.start;
            if (leftLen > buffer.length) buffer = new Array<number>(leftLen); // Resize fix

            mergeRuns(A, r1.start, r2.start, mergeEnd, buffer);
            nextRuns.push({ start: r1.start, len: mergeEnd - r1.start });
        }

        if (currentRuns.length % 2 === 1) {
            nextRuns.push(currentRuns[currentRuns.length - 1]);
        }
        currentRuns = nextRuns;
    }

    return true;
}

// --- BLOCK ADAPTIVE PARTITION ---
// Returns: [pivotIndex, swapCount]
function partitionAdaptive(A: number[], start: number, end: number): [number, number] {
    const pivot = A[start];
    let i = start + 1;
    let j = end;
    
    let entropyBudget = 24; 
    let swapCount = 0;

    // --- PHASE 1: SCALAR PROBE ---
    while (true) {
        while (i <= j && A[i] < pivot) i++;
        while (j > start && A[j] > pivot) j--;

        if (i >= j) break;

        swap(A, i, j);
        i++; j--;
        swapCount++;

        if (--entropyBudget === 0) {
            // Data is random. Switch to Block Mode if enough data remains.
            if ((j - i) > 2 * BLOCK_SIZE) {
               return partitionBlock(A, start, end, pivot, i, j, swapCount);
            }
        }
    }

    swap(A, start, j);
    return [j, swapCount];
}

// --- PHASE 2: BLOCK ILP MODE ---
// Note: Keeps JS Block implementation (Offset Buffer) but adds Swap Counting
function partitionBlock(
    A: number[], 
    start: number, 
    end: number, 
    pivot: number, 
    i: number, 
    j: number,
    initialSwaps: number
): [number, number] {
    
    const offsets = OFFSET_BUFFER; 
    let swapCount = initialSwaps;
    
    while (true) {
        // Stop if not enough data for a full block
        if (j - i < 2 * BLOCK_SIZE) break;

        // 1. Fill Left Offsets (0..63)
        let numL = 0;
        let base = i;
        let k = 0;
        
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
        const rStartIdx = 64; 

        for (; k + 4 <= BLOCK_SIZE; k += 4) {
            offsets[rStartIdx + numR] = k;     numR += +(A[base - k]       < pivot);
            offsets[rStartIdx + numR] = k + 1; numR += +(A[base - (k + 1)] < pivot);
            offsets[rStartIdx + numR] = k + 2; numR += +(A[base - (k + 2)] < pivot);
            offsets[rStartIdx + numR] = k + 3; numR += +(A[base - (k + 3)] < pivot);
        }
        for (; k < BLOCK_SIZE; ++k) {
            offsets[rStartIdx + numR] = k; numR += +(A[base - k] < pivot);
        }

        // 3. Swap the collisions
        const swaps = numL < numR ? numL : numR;
        swapCount += swaps; // TRACK SWAPS FOR SMART IS

        for (let x = 0; x < swaps; x++) {
            const idxL = i + offsets[x];
            const idxR = j - offsets[rStartIdx + x];
            const tmp = A[idxL];
            A[idxL] = A[idxR];
            A[idxR] = tmp;
        }

        // 4. Advance pointers
        i += BLOCK_SIZE;
        j -= BLOCK_SIZE;

        if (numL !== numR) {
            if (numL > numR) i -= BLOCK_SIZE; 
            else j += BLOCK_SIZE; 
        }
    }

    // Scalar Cleanup
    while (true) {
        while (i <= j && A[i] < pivot) i++;
        while (j > start && A[j] > pivot) j--;
        if (i >= j) break;
        swap(A, i, j);
        i++; j--;
        swapCount++;
    }

    swap(A, start, j);
    return [j, swapCount]; 
}

// --- Heapsort Fallback ---
function floatDown(A: number[], p: number, r: number, i: number) {
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

function heapsort(A: number[], p: number, r: number) {
    const n = r - p + 1;
    const mid = Math.floor(n / 2) + p - 1;
    
    for (let i = mid; i >= p; i--) floatDown(A, p, r, i);
    for (let i = r; i > p; i--) {
        swap(A, p, i);
        floatDown(A, p, i - 1, p);
    }
}

// --- Main Loop ---
function pdqLoop(A: number[], p: number, r: number, limit: number, badAllowed: number, leftmost: boolean) {
    while (true) {
        const n = r - p + 1;

        if (n <= INSERTION_SORT_THRESHOLD) {
            insertionSort(A, p, r);
            return;
        }

        if (badAllowed === 8) {
            if (checkSortedRun(A, p, r)) return;
        }

        if (limit <= 0) {
            heapsort(A, p, r);
            return;
        }

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

        // --- 3-Way Partition for Duplicates ---
        if (A[p] === A[r]) {
            const [i, k] = partition3Way(A, p, r);
            
            if (i > p) {
                pdqLoop(A, p, i - 1, limit - 1, badAllowed, leftmost);
            }
            p = k + 1;
            leftmost = false;
            limit--;
            continue;
        }

        // --- Adaptive Partition with Swap Counting ---
        swap(A, p, mid);
        const [pivotIdx, swapCount] = partitionAdaptive(A, p, r);

        // --- Smart Optimistic Insertion Sort (v4.5) ---
        // Logic: 
        // 1. If 0 swaps, it's very likely sorted.
        // 2. If > 64 elements AND very few swaps (< 1.5%), it's "Almost Sorted".
        let leftDone = false;
        let rightDone = false;

        if (swapCount === 0) {
            leftDone = partialInsertionSort(A, p, pivotIdx, 8);
            rightDone = partialInsertionSort(A, pivotIdx + 1, r, 8);
            if (leftDone && rightDone) return;
        } else if (n > 64 && swapCount < (n >> 6)) {
            // "Almost Sorted" Case: Use higher limit
            leftDone = partialInsertionSort(A, p, pivotIdx, 16);
            rightDone = partialInsertionSort(A, pivotIdx + 1, r, 16);
            if (leftDone && rightDone) return;
        }

        // --- Bad Partition Handling ---
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
            if (!leftDone && leftLen > 0) pdqLoop(A, p, pivotIdx - 1, limit, badAllowed, leftmost);
            p = pivotIdx + 1;
            leftmost = false;
            if (rightDone) return;
        } else {
            if (!rightDone && rightLen > 0) pdqLoop(A, pivotIdx + 1, r, limit, badAllowed, false);
            r = pivotIdx - 1;
            if (leftDone) return;
        }
        if (p >= r) return;
    }
}

export function pdqsort(A: number[]) {
    if (A.length < 2) return;

    // --- Phase 1: Try Adaptive Vergesort (v4.5) ---
    // Efficiently handles pattern-heavy data (reversed, sawtooth, append-sorted)
    if (tryVergesort(A, 0, A.length)) {
        return;
    }

    // --- Phase 2: PDQSort Loop ---
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    pdqLoop(A, 0, A.length - 1, maxDepth, 8, true);
}

benchmarkArray(pdqsort, "pdq_diamond_v4.5_unsafe_array_ts");
