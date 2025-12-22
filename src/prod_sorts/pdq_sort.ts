import { runAll, type NumericArray } from "./test_harness";

// --- Constants & Config ---
const INSERTION_SORT_THRESHOLD = 24;
const NINTHER_THRESHOLD = 128;
const PARTIAL_INSERTION_SORT_LIMIT = 8; // Max swaps allowed for "optimistic" insertion sort

// --- Primitives ---

function swap(A: NumericArray, i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

// Standard Insertion Sort (Unguarded for speed where possible)
function insertionSort(A: NumericArray, p: number, r: number) {
    for (let i = p + 1; i <= r; i++) {
        const val = A[i];
        let j = i;
        // Standard "guarded" shift
        while (j > p && A[j - 1] > val) {
            A[j] = A[j - 1];
            j--;
        }
        A[j] = val;
    }
}

// Optimistic Insertion Sort: Aborts if array is too mixed up.
// FIX APPLIED: Restore 'val' before aborting to prevent data corruption.
function partialInsertionSort(A: NumericArray, p: number, r: number): boolean {
    let limit = PARTIAL_INSERTION_SORT_LIMIT;
    for (let i = p + 1; i <= r; i++) {
        const val = A[i];
        let j = i;
        while (j > p && A[j - 1] > val) {
            if (limit-- === 0) {
                A[j] = val; // <--- CRITICAL FIX: Restore value before abort
                return false; 
            }
            A[j] = A[j - 1];
            j--;
        }
        A[j] = val;
    }
    return true; // Successfully sorted
}

// --- Heapsort (Fallback) ---

function heapSort(A: NumericArray, p: number, r: number) {
    const n = r - p + 1;
    for (let i = (n >> 1) - 1; i >= 0; i--) heapify(A, p, n, i);
    for (let i = n - 1; i > 0; i--) {
        swap(A, p, p + i);
        heapify(A, p, i, 0);
    }
}

function heapify(A: NumericArray, p: number, n: number, i: number) {
    while (true) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && A[p + left] > A[p + largest]) largest = left;
        if (right < n && A[p + right] > A[p + largest]) largest = right;

        if (largest !== i) {
            swap(A, p + i, p + largest);
            i = largest;
        } else {
            break;
        }
    }
}

// --- Pivot Selection (The "Brains") ---

// Sorts a, b, c in-place. Returns the median index.
function sort3(A: NumericArray, a: number, b: number, c: number): number {
    if (A[a] > A[b]) swap(A, a, b);
    if (A[b] > A[c]) swap(A, b, c);
    if (A[a] > A[b]) swap(A, a, b);
    return b;
}

function selectPivot(A: NumericArray, p: number, r: number): [number, boolean] {
    const n = r - p + 1;
    const mid = p + (n >> 1);
    let pivotIdx = mid;
    
    // Tukey's Ninther (Median of 3 Medians) for large arrays
    if (n > NINTHER_THRESHOLD) {
        const s = n >> 3; // roughly length / 8
        sort3(A, p, p + s, p + 2 * s);
        sort3(A, mid - s, mid, mid + s);
        sort3(A, r - 2 * s, r - s, r);
        pivotIdx = sort3(A, p + s, mid, r - s);
    } else {
        // Standard Median of 3
        pivotIdx = sort3(A, p, mid, r);
    }

    // Move pivot to `p`. 
    // This acts as a Sentinel for the left-scan loop because A[p] is now the pivot.
    swap(A, p, pivotIdx);
    
    // Returns pivot index (always p) and 'likelySorted' hint (omitted for brevity)
    return [p, false];
}

// --- Partitioning (Hoare with Sentinel Optimization) ---

function partitionRight(A: NumericArray, p: number, r: number): [number, boolean] {
    const pivot = A[p]; // Pivot is at P
    let i = p + 1;
    let j = r;

    // 1. Fast forward to find first conflict
    // Note: 'i' needs bounds check because we might not have a right sentinel.
    // 'j' does NOT need bounds check > p, because A[p] == pivot, so it will stop there.
    while (i <= j && A[i] < pivot) i++;
    while (j >= i && A[j] > pivot) j--;

    // Optimization: If pointers crossed without any swaps...
    if (i > j) {
        swap(A, p, j); // <--- CRITICAL FIX: Put pivot in correct place
        return [j, true]; // [pivot index, wasAlreadyPartitioned]
    }

    // 2. Main Swap Loop
    while (i < j) {
        swap(A, i, j);
        i++;
        j--;
        while (A[i] < pivot) i++;
        while (A[j] > pivot) j--;
    }

    // Move pivot to final position
    swap(A, p, j);
    return [j, false];
}

// --- Main PDQSort Logic ---

function pdqLoop(A: NumericArray, p: number, r: number, limit: number, badAllowed: number) {
    while (true) {
        const n = r - p + 1;

        // 1. Base Case: Insertion Sort for small arrays
        if (n < INSERTION_SORT_THRESHOLD) {
            insertionSort(A, p, r);
            return;
        }

        // 2. Safety Net: Heapsort if depth limit reached
        if (limit === 0) {
            heapSort(A, p, r);
            return;
        }

        // 3. Bad Partition Handling (Shuffle)
        // If we ran out of "badAllowed" budget, shuffle middle elements to break patterns.
        if (badAllowed === 0) {
            const mid = p + (n >> 1);
            swap(A, mid, p + (mid % n)); 
            swap(A, mid, r - (mid % n));
            badAllowed = 8; // Reset budget
        }

        // 4. Pivot Selection
        const [pivotPos, _] = selectPivot(A, p, r); // Pivot is now at A[p]

        // 5. Partition
        const [mid, alreadyPartitioned] = partitionRight(A, p, r);

        // 6. Pattern Defeating Logic
        
        // A. Sorted Run Detection (Optimistic Insertion Sort)
        // If the array partitioned perfectly with no swaps, it might be sorted.
        if (alreadyPartitioned) {
            if (partialInsertionSort(A, p, mid - 1) && partialInsertionSort(A, mid + 1, r)) {
                return;
            }
        }

        // B. Bad Partition Detection
        // If the pivot divides the array very unevenly (e.g., < 12.5% on one side)
        const leftLen = mid - p;
        const rightLen = r - mid;
        const highlyUnbalanced = leftLen < (n >> 3) || rightLen < (n >> 3);

        if (highlyUnbalanced) {
            badAllowed--; // Penalize
            limit--;      // Decrement depth limit faster to trigger Heapsort sooner
        } else {
            // Good partition? Reset the "bad partition" counter slightly
            if (badAllowed < 8) badAllowed++;
        }

        // 7. Loop / Recurse (Tail Call Optimization)
        limit--;
        if (leftLen < rightLen) {
            pdqLoop(A, p, mid - 1, limit, badAllowed);
            p = mid + 1; // Loop on right
        } else {
            pdqLoop(A, mid + 1, r, limit, badAllowed);
            r = mid - 1; // Loop on left
        }
    }
}

export function pdqSort(A: NumericArray) {
    if (A.length < 2) return;
    // Standard Introsort depth limit: 2 * log2(n)
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    pdqLoop(A, 0, A.length - 1, maxDepth, 8);
}

// --- Run Tests ---
runAll(pdqSort, "pdq_complete");