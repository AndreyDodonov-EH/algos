import { test_mergesort } from "./test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function merge_rec(A: number[], l: number, m: number, r: number) {
    // Tail Call Optimization: Loop instead of recursing on the right side
    // ToDo: actualy understand taill call optimization, ask AI for examples
    while (m < r) {
        let i = l;
        let j = m;
        for (; i < m && j < r; i++) {
            if (A[i] <= A[j]) {
                continue;
            }
            swap(A, i, j);
            if (j + 1 < r && A[j] > A[j + 1]) {
                j++;
            }
        }
        if (m >= j) {
            break;
        }
        merge_rec(A, l, m, j);
        l = m;
        m = j;
    }
}

function mergesort_body(A: number[], B:number[], l: number, r: number) {
    const m = l + Math.floor((r - l) / 2);
    if (m-l > 1) mergesort_body(A, B, l, m);
    if (r-m > 1) mergesort_body(A, B, m, r);
    if (A[m-1]>A[m]) merge_rec(A, l, m, r);
}

function mergesort(A: number[]) {
    let B = new Array(Math.ceil(A.length/2));
    mergesort_body(A, B, 0, A.length);
}

test_mergesort(mergesort);
