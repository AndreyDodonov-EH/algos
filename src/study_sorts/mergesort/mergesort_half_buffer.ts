import { test_mergesort } from "./test_harness";

function merge_buffer_half(A: number[], B: number[], l: number, m: number, r: number) {
    for (let i = 0;i<(m-l);i++) {
        B[i] = A[i+l];
    }
    let i = 0; // goes through B
    let j = m; // goes through right half
    let k = l; // writes to left half
    for (; i < (m-l) && j < r; k++) {
        if (B[i] <= A[j]) {
            A[k] = B[i]
            i++;
        } else {
            A[k] = A[j];
            j++;
        }
    }
    for (; i < (m-l);k++) {
        A[k] = B[i++]; // write remaining from B[i]
    }
}

function mergesort_body(A: number[], B:number[], l: number, r: number) {
    if (r - l <= 1) {
        return;
    }
    const m = l + Math.floor((r - l) / 2);
    mergesort_body(A, B, l, m);
    mergesort_body(A, B, m, r);
    if (A[m-1]>A[m]) merge_buffer_half(A, B, l, m, r);
}

function mergesort(A: number[]) {
    let B = new Array(Math.ceil(A.length/2));
    mergesort_body(A, B, 0, A.length);
}

test_mergesort(mergesort);
