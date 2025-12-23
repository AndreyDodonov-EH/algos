import { runAll, type NumericArray } from "./test_harness";

// --- Constants ---
const INSERTION_SORT_THRESHOLD = 16;

// --- Primitives ---

function swap(A: NumericArray, i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

// Standard Insertion Sort for small partitions
function insertionsort_shift_while(A: NumericArray, p: number, r: number) {
    for (let i = p + 1; i <= r; i++) {
        const current = A[i];
        let j = i - 1;
        while (j >= p && A[j] > current) {
            A[j + 1] = A[j];
            j--;
        }
        A[j + 1] = current;
    }
}

// "Optimistic" Insertion Sort
// Returns TRUE if it successfully sorted the range with fewer than 'limit' swaps.
// Returns FALSE (and restores array state) if it hits the limit.
function partialInsertionSort(A: NumericArray, p: number, r: number): boolean {
    let limit = 8; // Fail fast if array is messy
    for (let i = p + 1; i <= r; i++) {
        const val = A[i];
        let j = i;
        while (j > p && A[j - 1] > val) {
            if (limit-- === 0) {
                A[j] = val; // Critical: Restore value before aborting
                return false; 
            }
            A[j] = A[j - 1];
            j--;
        }
        A[j] = val;
    }
    return true;
}

// Smart Partition: Returns [pivotIndex, wasClean]
// "wasClean" is true if NO swaps occurred inside the partitioning loop.
function partition_smart(A: NumericArray, p: number, r: number): [number, boolean] {
    const m = Math.floor((p + r) / 2);
    swap(A, m, r); // Move pivot to end

    let x = A[r];
    let i = p;
    let j = r - 1;
    let swaps = 0;

    while (true) {
        while (A[i] < x) i++;
        while (j > i && A[j] > x) j--; // Standard bounds check
        
        if (i >= j) break;
        
        swap(A, i, j);
        swaps++;
        i++; j--;
    }
    swap(A, i, r); // Move pivot to final place

    // If swaps === 0, the array was already correctly partitioned relative to pivot
    // This strongly suggests the data is Sorted or Reverse Sorted
    return [i, swaps === 0];
}

// --- Heapsort Fallback ---

function _floatDown(A: NumericArray, p: number, r: number, i: number) {
    const firstChildIdx = p + Math.floor((r - p + 1) / 2);
    while (i < firstChildIdx) {
        let idxOfBest = i;
        const idxOfLeft = 2 * i - p + 1;
        if (A[idxOfLeft] > A[idxOfBest]) idxOfBest = idxOfLeft;
        
        const idxOfRight = idxOfLeft + 1;
        if (idxOfRight <= r && A[idxOfRight] > A[idxOfBest]) idxOfBest = idxOfRight;

        if (idxOfBest === i) break;
        swap(A, i, idxOfBest);
        i = idxOfBest;
    }
}

function heapsort(A: NumericArray, p: number, r: number) {
    const n = r - p + 1;
    const lastParentIdx = p + Math.floor(n / 2) - 1;
    for (let i = lastParentIdx; i >= p; i--) _floatDown(A, p, r, i);
    for (let i = r; i > p; i--) {
        swap(A, p, i);
        _floatDown(A, p, i - 1, p);
    }
}

// --- Main Loop ---

function _introsortLoop(A: NumericArray, p: number, r: number, currentDepth: number, maxDepth: number) {
    while (r - p > 0) {
        const n = r - p + 1;

        // 1. Base Case
        if (n <= INSERTION_SORT_THRESHOLD) {
            insertionsort_shift_while(A, p, r);
            return;
        }

        // 2. Safety Net
        if (currentDepth > maxDepth) {
            heapsort(A, p, r);
            return;
        }

        // 3. Partition
        const [pivotIdx, wasClean] = partition_smart(A, p, r);

        // 4. "Pattern Defeating" Shortcut
        // If partition was clean (0 swaps), the data is likely sorted.
        // Try to finish quickly with Partial Insertion Sort.
        if (wasClean) {
            if (partialInsertionSort(A, p, pivotIdx - 1) && 
                partialInsertionSort(A, pivotIdx + 1, r)) {
                return;
            }
        }

        // 5. Recurse (Tail Call Optimized)
        currentDepth++;
        const leftLen = (pivotIdx - 1) - p;
        const rightLen = r - (pivotIdx + 1);

        if (leftLen < rightLen) {
            _introsortLoop(A, p, pivotIdx - 1, currentDepth, maxDepth);
            p = pivotIdx + 1;
        } else {
            _introsortLoop(A, pivotIdx + 1, r, currentDepth, maxDepth);
            r = pivotIdx - 1;
        }
    }
}

export function introsort_smart(A: NumericArray) {
    if (A.length < 2) return;
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    _introsortLoop(A, 0, A.length - 1, 0, maxDepth);
}

// --- Run Tests ---
runAll(introsort_smart, "smart_pdq");