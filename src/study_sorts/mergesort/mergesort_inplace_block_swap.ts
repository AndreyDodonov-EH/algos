import { test_mergesort } from "./test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function find_idx_of_first_bigger(key: number, A: number[], l: number, r: number) {
    let firstBiggerIdx = -1;
    if (A[l] > key) {
        firstBiggerIdx = l;
        return firstBiggerIdx;
    }
    while(l<r) {
        const m = l + Math.floor((r-l)/2);
        if (A[m] > key) {
            r = m;
            firstBiggerIdx = m;
        } else {
            l = m+1;
        }
    }
    return firstBiggerIdx;
}

function find_idx_of_last_smaller(key: number, A: number[], l: number, r: number) {
    let lastSmallestIdx = -1;
    if (A[r-1] < key) {
        lastSmallestIdx = r-1; 
        return lastSmallestIdx;
    }
    while (l<r) {
        let midIdx = l+Math.floor((r-l)/2);
        if (A[midIdx] < key) {
            lastSmallestIdx = midIdx;
            l = midIdx + 1;
        } else {
            r = midIdx;
        }
    }
    return lastSmallestIdx;
}

function reverse(A: number[], p: number, r: number) {
    while (p<r) {
        swap(A, p++, --r);
    }
}

function swap_blocks(A: number[], l: number, m:number, r: number) {
    reverse(A, l, m);
    reverse(A, m, r);
    reverse(A, l, r);
}

function merge_in_place(A: number[], l: number, m: number, r: number) {
    while (m<r && A[m-1]>A[m]) {
        const left_idx = find_idx_of_first_bigger(A[m], A, l, m);
        const right_idx = find_idx_of_last_smaller(A[left_idx], A, m, r);
        const first_unsorted_idx = right_idx+1;
        if ((first_unsorted_idx - left_idx) > 2) {
            swap_blocks(A, left_idx, m, first_unsorted_idx);
        } else {
            swap(A, left_idx, right_idx);
        }
        const right_block_size = (right_idx - m + 1);
        l = left_idx + right_block_size;
        m = first_unsorted_idx;
    }
}

function mergesort_body(A: number[], l: number, r: number) {
    const m = l + Math.floor((r - l) / 2);
    if (m-l>1) mergesort_body(A, l, m);
    if (r-m>1) mergesort_body(A, m, r);
    // console.log(`[${A.slice(l,m)}] [${A.slice(m,r)}]`);
    if (A[m-1] > A[m]) merge_in_place(A, l, m, r);
    // console.log(`[${A.slice(l,r)}]`);
}

function mergesort(A: number[]) {
    mergesort_body(A, 0, A.length);
}

test_mergesort(mergesort);
