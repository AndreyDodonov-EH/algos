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

let src: number[];
let dst: number[];
let depth = 0;
let swapBack: boolean = false;

function traverse_halves(l:number, r: number) {
    depth++;
    const m = l + Math.floor((r-l)/2);
    if ((m-l) > 1) traverse_halves(l, m);
    if ((r-m) > 1) traverse_halves(m, r);
    if (depth % 2 == 0) {
        merge(src, dst, l, m, r);
        swapBack = true;
    } else {
        merge(dst, src, l, m, r);
        swapBack = false;
    }
    depth--;
}

function mergesort(A: number[]) {
    let B: number[] = new Array(A.length);
    for (let i=0;i<A.length;i++) {
        B[i] = A[i];
    }
    src = A;
    dst = B;
    traverse_halves(0, A.length);
    if (swapBack) {
        for (let i=0;i<A.length;i++) {
            A[i] = B[i];
        }
    }
}

test_mergesort(mergesort);
