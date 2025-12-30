import { test_mergesort } from "./test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function merge_rec(A: number[], a: number, p: number, r: number) {
    // Tail Call Optimization: Loop instead of recursing on the right side
    // ToDo: actualy understand taill call optimization, ask AI for examples
    while (p <= r) {
        let i = a;
        let j = p;
        for (; i < p && j <= r; i++) {
            if (A[i] <= A[j]) {
                continue;
            }
            swap(A, i, j);
            if (j + 1 <= r && A[j] > A[j + 1]) {
                j++;
            }
        }
        if (p >= j) {
            break;
        }
        merge_rec(A, a, p, j);
        a = p;
        p = j;
    }
}

function mergesort_body(A: number[], B:number[], p: number, r: number) {
    if (r - p < 1) {
        return;
    }
    const mid = p + Math.floor((r - p) / 2);
    mergesort_body(A, B, p, mid);
    mergesort_body(A, B, mid+1, r);
    merge_rec(A, p, mid + 1, r);
}

function mergesort(A: number[]) {
    let B = new Array(Math.ceil(A.length/2));
    mergesort_body(A, B, 0, A.length-1);
}

test_mergesort(mergesort);
