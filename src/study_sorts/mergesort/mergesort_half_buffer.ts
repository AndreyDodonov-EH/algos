import { test_mergesort } from "./test_harness";

function merge_buffer_half(A: number[], B: number[], a: number, p: number, r: number) {
    for (let i = 0;i<(p-a);i++) {
        B[i] = A[i+a];
    }
    let i = 0; // goes through B
    let j = p; // goes through right half
    let k = a; // writes to left half
    for (; i < (p-a) && j <= r; k++) {
        if (B[i] <= A[j]) {
            A[k] = B[i]
            i++;
        } else {
            A[k] = A[j];
            j++;
        }
    }
    for (; i < (p-a);k++) {
        A[k] = B[i++]; // write remaining from B[i]
    }
    for (; j <= r; k++) {
        A[k] = A[j++]; // or write reaming from A[j]
    }
}

function mergesort_body(A: number[], B:number[], p: number, r: number) {
    if (r - p < 1) {
        return;
    }
    const mid = p + Math.floor((r - p) / 2);
    mergesort_body(A, B, p, mid);
    mergesort_body(A, B, mid+1, r);
    merge_buffer_half(A, B, p, mid + 1, r);
}

function mergesort(A: number[]) {
    let B = new Array(Math.ceil(A.length/2));
    mergesort_body(A, B, 0, A.length-1);
}

test_mergesort(mergesort);
