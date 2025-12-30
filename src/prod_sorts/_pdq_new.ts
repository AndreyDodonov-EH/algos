/**
 * Diamond-Polished PDQSort v2 (TypeScript)
 * Strategy: Bitset Block Partitioning + Timsort-style Run Detection
 */

import { benchmark } from "./benchmark";

// --- Configuration ---
const INSERTION_SORT_THRESHOLD = 24;
const NINTHER_THRESHOLD = 128;
// JS bitwise ops are 32-bit. We use 32-element blocks.
const BLOCK_SIZE = 32; 

// --- Primitives ---

function swap(A: Float64Array, i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function reverseRange(A: Float64Array, start: number, end: number) {
    while (start < end) {
        const tmp = A[start];
        A[start] = A[end];
        A[end] = tmp;
        start++;
        end--;
    }
}

// Based on libc++ __sort3
function sort3(A: Float64Array, a: number, b: number, c: number) {
    if (A[b] < A[a]) swap(A, a, b);
    if (A[c] < A[b]) swap(A, b, c);
    if (A[b] < A[a]) swap(A, a, b);
}

// Based on libc++ __sort4
function sort4(A: Float64Array, x1: number, x2: number, x3: number, x4: number) {
    sort3(A, x1, x2, x3);
    if (A[x4] < A[x3]) {
        swap(A, x3, x4);
        if (A[x3] < A[x2]) {
            swap(A, x2, x3);
            if (A[x2] < A[x1]) {
                swap(A, x1, x2);
            }
        }
    }
}

// Based on libc++ __sort5
function sort5(A: Float64Array, x1: number, x2: number, x3: number, x4: number, x5: number) {
    sort4(A, x1, x2, x3, x4);
    if (A[x5] < A[x4]) {
        swap(A, x4, x5);
        if (A[x4] < A[x3]) {
            swap(A, x3, x4);
            if (A[x3] < A[x2]) {
                swap(A, x2, x3);
                if (A[x2] < A[x1]) {
                    swap(A, x1, x2);
                }
            }
        }
    }
}

function insertionSort(A: Float64Array, start: number, end: number) {
    for (let i = start + 1; i <= end; i++) {
        const val = A[i];
        if (val < A[i - 1]) {
            let j = i;
            do {
                A[j] = A[j - 1];
                j--;
            } while (j > start && val < A[j - 1]);
            A[j] = val;
        }
    }
}

// Node.js Timsort-style Run Detection
// Returns the end index of the run found.
function countAndMakeRun(A: Float64Array, p: number, r: number): number {
    if (p >= r) return p;
    let runEnd = p + 1;
    
    if (runEnd > r) return runEnd;

    // Detect direction
    const descending = A[runEnd] < A[p];
    
    // Find end of run
    if (descending) {
        while (runEnd <= r && A[runEnd] < A[runEnd - 1]) {
            runEnd++;
        }
        // Reverse strictly descending runs to make them ascending
        reverseRange(A, p, runEnd - 1);
    } else {
        while (runEnd <= r && A[runEnd] >= A[runEnd - 1]) {
            runEnd++;
        }
    }
    
    return runEnd - 1;
}

// --- 3-Way Partition (Dutch National Flag) ---
function partition3Way(A: Float64Array, p: number, r: number): [number, number] {
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

// --- BITSET BLOCK PARTITION ---
// Inspired by libc++ __bitset_partition
// Uses JS 32-bit integers as registers.
function partitionBlock(
    A: Float64Array, 
    start: number, 
    end: number, 
    pivot: number, 
    i: number, 
    j: number
): [number, boolean] {
    
    while (true) {
        if (j - i < 2 * BLOCK_SIZE) break;

        let leftSet = 0;
        let rightSet = 0;
        let base = i;
        
        // Fill Left Bitset (1 if A[k] > pivot)
        // Manual loop unrolling often helps V8, but simple loops are robust.
        for (let k = 0; k < BLOCK_SIZE; k++) {
            if (A[base + k] > pivot) {
                leftSet |= (1 << k);
            }
        }

        // Fill Right Bitset (1 if A[k] < pivot)
        base = j;
        for (let k = 0; k < BLOCK_SIZE; k++) {
            if (A[base - k] < pivot) {
                rightSet |= (1 << k);
            }
        }

        // Swap Collisions
        // We only care while both have bits set.
        while (leftSet !== 0 && rightSet !== 0) {
            // clz32 returns leading zeros. 31 - clz32 gives the index of the highest bit.
            // ctz (trailing zeros) is strictly better for set bits 0..31 but Math.clz32 is the only native intrinsic.
            // We'll scan from LSB by using x & -x to isolate LSB, then log2 or lookup.
            // Faster in JS: Math.clz32 of (x & -x).
            
            const lBit = leftSet & -leftSet;
            const rBit = rightSet & -rightSet;
            
            // 31 - clz32(powerOfTwo) gives the index (0..31)
            const lIdx = 31 - Math.clz32(lBit);
            const rIdx = 31 - Math.clz32(rBit);

            swap(A, i + lIdx, j - rIdx);

            leftSet ^= lBit;   // Clear bit
            rightSet ^= rBit;  // Clear bit
        }

        i += BLOCK_SIZE;
        j -= BLOCK_SIZE;

        // If a block wasn't fully swapped (imbalance), retreat pointers
        if (leftSet !== 0) i -= BLOCK_SIZE;
        if (rightSet !== 0) j += BLOCK_SIZE;

        // If budget blown or imbalance remains, scalar fallback handles the rest
        if (leftSet !== 0 || rightSet !== 0) break;
    }

    // Scalar Cleanup
    while (true) {
        while (i <= j && A[i] < pivot) i++;
        while (j > start && A[j] > pivot) j--;
        if (i >= j) break;
        swap(A, i, j);
        i++; j--;
    }

    swap(A, start, j);
    return [j, false]; 
}

// --- Main Loop ---
function pdqLoop(A: Float64Array, p: number, r: number, limit: number, badAllowed: number, leftmost: boolean) {
    while (true) {
        const n = r - p + 1;

        // 1. Small Sort Fallback
        if (n <= INSERTION_SORT_THRESHOLD) {
            if (n <= 5) {
                // Use networks for tiny arrays (libc++ style)
                if (n === 1) return;
                if (n === 2) { if (A[p] > A[r]) swap(A, p, r); return; }
                if (n === 3) { sort3(A, p, p+1, r); return; }
                if (n === 4) { sort4(A, p, p+1, p+2, r); return; }
                if (n === 5) { sort5(A, p, p+1, p+2, p+3, r); return; }
            }
            insertionSort(A, p, r);
            return;
        }

        // 2. Run Detection (Node Timsort Style)
        // If we find a long run, we skip sorting it.
        // Node's CountAndMakeRun reverses descending runs automatically.
        if (badAllowed === 8) { // Only check on fresh partitions
            const runEnd = countAndMakeRun(A, p, r);
            if (runEnd === r) return; // Entire range is sorted
            
            // If the run is substantial, we can skip it and sort the rest
            if (runEnd > p + (INSERTION_SORT_THRESHOLD * 2)) {
                // The prefix [p...runEnd] is sorted.
                // We could just advance p, but PDQ structure expects partitioning.
                // We'll continue, but next iteration will likely pick up from runEnd.
                // Actually, standard PDQ doesn't advance P, it just continues. 
                // We will advance P if the run is very long.
                 if (runEnd > p + (n >> 2)) {
                    p = runEnd + 1;
                    continue;
                 }
            }
        }

        if (limit <= 0) {
            // Heapsort fallback (omitted for brevity in this snippet)
            insertionSort(A, p, r);
            return;
        }

        // 3. Pivot Selection (Ninther)
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

        // 4. Duplicate Check (3-Way Partition)
        if (A[p] === A[r]) {
            const [i, k] = partition3Way(A, p, r);
            if (i > p) pdqLoop(A, p, i - 1, limit - 1, badAllowed, leftmost);
            p = k + 1;
            leftmost = false;
            limit--;
            continue;
        }

        // 5. Adaptive Partition
        swap(A, p, mid);
        const pivot = A[p];
        let i = p + 1;
        let j = r;
        
        // Scalar Probe for Entropy
        // Check if we can get away with scalar partition or need block
        if (n > BLOCK_SIZE * 2) {
             const [idx, _] = partitionBlock(A, p, r, pivot, i, j);
             i = idx; 
        } else {
             // Standard scalar fallback for medium sizes
             while (true) {
                 while (i <= j && A[i] < pivot) i++;
                 while (j > p && A[j] > pivot) j--;
                 if (i >= j) break;
                 swap(A, i, j);
                 i++; j--;
             }
             swap(A, p, j);
             i = j;
        }

        const pivotIdx = i;
        const leftLen = pivotIdx - p;
        const rightLen = r - pivotIdx;

        // 6. Bad Partition Handling (Shuffle)
        if (leftLen < (n >> 3) || rightLen < (n >> 3)) {
            badAllowed--;
            if (badAllowed === 0) {
                 // Shuffle pattern logic (omitted)
                 badAllowed = 4;
            }
            limit--;
        } else {
            if (badAllowed < 8) badAllowed++;
        }

        // 7. Recurse
        if (leftLen < rightLen) {
            pdqLoop(A, p, pivotIdx - 1, limit - 1, badAllowed, leftmost);
            p = pivotIdx + 1;
            leftmost = false;
        } else {
            pdqLoop(A, pivotIdx + 1, r, limit - 1, badAllowed, false);
            r = pivotIdx - 1;
        }
        if (p >= r) return;
    }
}

export function pdqsort(A: Float64Array) {
    if (A.length < 2) return;
    // libc++ uses 2 * lg(n) for depth limit
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    pdqLoop(A, 0, A.length - 1, maxDepth, 8, true);
}

benchmark(pdqsort, "pdq_diamond_v2_ts");