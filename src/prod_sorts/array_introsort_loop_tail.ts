import { runAllArray } from "./test_harness";

// Helper: Manual swap is often faster than destructuring
function swap(A: number[], i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function insertionsort_shift_while(A: number[], p: number, r: number) {
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

function partition_sedgewick(A: number[], p: number, r: number): [number, number] {
    const m = Math.floor((p + r) / 2);
    swap(A, m, r);

    let x = A[r];
    let i = p;
    let j = r - 1;
    while (true) {
        while (A[i] < x) i++;
        while (j > i && A[j] > x) {
            j--;
        }
        if (i >= j) {
            break;
        }
        swap(A, i, j);
        i++; j--;
    }
    swap(A, i, r);
    return [i, j];
}

function _floatDown(A: number[], p: number, r: number, i: number) {
    const firstChildIdx = p + Math.floor((r - p + 1) / 2);
    while (i < firstChildIdx) {
        let idxOfBest = i;
        const idxOfLeft = 2 * i - p + 1;

        if (A[idxOfLeft] > A[idxOfBest]) {
            idxOfBest = idxOfLeft;
        }

        const idxOfRight = idxOfLeft + 1;
        if (idxOfRight <= r &&
            (A[idxOfRight] > A[idxOfBest])) {
            idxOfBest = idxOfRight;
        }

        if (idxOfBest === i) {
            break;
        } else {
            swap(A, i, idxOfBest);
            i = idxOfBest;
        }
    }
}

function _buildMaxHeap(A: number[], p: number, r: number) {
    const lastParentIdx = p + Math.floor((r - p + 1) / 2) - 1;
    for (let i = lastParentIdx; i >= p; i--) {
        _floatDown(A, p, r, i);
    }
}

function heapsort(A: number[], p: number, r: number) {
    _buildMaxHeap(A, p, r);
    for (let i = r; i > p; i--) {
        swap(A, p, i);
        _floatDown(A, p, i - 1, p);
    }
}

function _introsortLoop(A: number[], p: number, r: number, currentDepth: number, maxDepth: number, insertionSortLimit = 16) {
    // Loop optimization: Turn tail recursion into a while loop to save stack frames
    while (r - p > 0) {
        const n = r - p + 1;

        if (n <= insertionSortLimit) {
            insertionsort_shift_while(A, p, r);
            return;
        }

        if (currentDepth > maxDepth) {
            heapsort(A, p, r);
            return;
        }

        const pivots = partition_sedgewick(A, p, r);

        // Recurse on the smaller partition, loop on the larger (tail call elimination simulation)
        const leftLen = (pivots[0] - 1) - p;
        const rightLen = r - (pivots[0] + 1);

        currentDepth++;

        if (leftLen < rightLen) {
            _introsortLoop(A, p, pivots[0] - 1, currentDepth, maxDepth, insertionSortLimit);
            p = pivots[0] + 1;
        } else {
            _introsortLoop(A, pivots[0] + 1, r, currentDepth, maxDepth, insertionSortLimit);
            r = pivots[0] - 1;
        }
    }
}

export function introsort(A: number[]) {
    if (A.length < 2) return;
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    const insertionSortLimit = 16;
    _introsortLoop(A, 0, A.length - 1, 0, maxDepth, insertionSortLimit);
}

// --- Run Tests ---
runAllArray(introsort, "array_loop_tail");

