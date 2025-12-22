import { runAll_UnionAsTypedOnly, type NumericArray } from "./test_harness";

function swap(A: NumericArray, i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

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

function partition_sedgewick(A: NumericArray, p: number, r: number): [number, number] {
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

function _floatDown(A: NumericArray, p: number, r: number, i: number) {
    const firstChildIdx = p + Math.floor((r - p + 1) / 2);
    while (i < firstChildIdx) {
        let idxOfBest = i;
        const idxOfLeft = 2 * i - p + 1;
        if (A[idxOfLeft] > A[idxOfBest]) {
            idxOfBest = idxOfLeft;
        }
        const idxOfRight = idxOfLeft + 1;
        if (idxOfRight <= r && (A[idxOfRight] > A[idxOfBest])) {
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

function _buildMaxHeap(A: NumericArray, p: number, r: number) {
    const lastParentIdx = p + Math.floor((r - p + 1) / 2) - 1;
    for (let i = lastParentIdx; i >= p; i--) {
        _floatDown(A, p, r, i);
    }
}

function heapsort(A: NumericArray, p: number, r: number) {
    _buildMaxHeap(A, p, r);
    for (let i = r; i > p; i--) {
        swap(A, p, i);
        _floatDown(A, p, i - 1, p);
    }
}

function _introsortLoop(A: NumericArray, p: number, r: number, currentDepth: number, maxDepth: number, insertionSortLimit = 16) {
    currentDepth++;
    const n = r - p + 1;
    if (n <= 1) {
        return;
    }
    if (n <= insertionSortLimit) {
        insertionsort_shift_while(A, p, r);
    } else if (currentDepth > maxDepth) {
        heapsort(A, p, r);
    } else {
        const pivots = partition_sedgewick(A, p, r);
        _introsortLoop(A, p, pivots[0] - 1, currentDepth, maxDepth, insertionSortLimit);
        _introsortLoop(A, pivots[0] + 1, r, currentDepth, maxDepth, insertionSortLimit);
    }
}

export function introsort(A: NumericArray) {
    if (A.length < 2) return;
    const maxDepth = 2 * Math.floor(Math.log2(A.length));
    const insertionSortLimit = 16;
    _introsortLoop(A, 0, A.length - 1, 0, maxDepth, insertionSortLimit);
}

// --- Run Tests ---
runAll_UnionAsTypedOnly(introsort, "original");
