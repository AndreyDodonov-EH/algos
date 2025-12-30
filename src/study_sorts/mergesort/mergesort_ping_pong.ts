import { test_mergesort } from "./test_harness";

function merge(src: number[], dst: number[], l: number, m: number, r: number) {
    let i = l;
    let j = m;
    let k = l;
    while (i<m && j<r) {
        dst[k++] = (src[i] <= src[j]) ? src[i++] : src[j++];
    }
    while (i<m) {
        dst[k++] = src[i++];
    }
    while (j<r) {
        dst[k++] = src[j++];
    }
}

function traverse_halves(A:number[], B:number[], l:number, r: number) {
    const m = l + Math.floor((r-l)/2);
    if ((m-l) > 1) traverse_halves(B, A, l, m);
    if ((r-m) > 1) traverse_halves(B, A, m, r);
    merge(B, A, l, m, r);
}

function mergesort(A: number[]) {
    let B: number[] = new Array(A.length);
    for (let i=0;i<A.length;i++) {
        B[i] = A[i];
    }
    traverse_halves(A, B, 0, A.length);
}

test_mergesort(mergesort);
