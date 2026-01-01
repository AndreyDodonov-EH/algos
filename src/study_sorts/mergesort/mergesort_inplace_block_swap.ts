import { test_mergesort } from "./test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function find_idx_of_last_smaller(key: number, A: number[], l: number, r: number) {
    let lastSmallestIdx = A[l] >= key ? -1 : l;
    if (A[r-1] < key) {
        lastSmallestIdx = r-1; 
        return lastSmallestIdx;
    }
    while (l<r && A[l]<key) {
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

function merge_in_place(A: number[], l: number, m: number, r: number) {
    if (l>=m || m>=r ) { // rec exit condition - empty subarray
        return;
    } 
    if (r-l <= 2) { //edge case
        if (A[l] > A[r-1]) {
            swap(A,l,r-1);
        }
        return;
    }
    let idx = -1;
    let l_l = l;
    let l_r = m;
    let l_m = -1;
    while (l_l<l_r) {
        l_m = l_l + Math.floor((l_r-l_l)/2); 
        const key = A[l_m];
        idx = find_idx_of_last_smaller(key, A, m, r);
        if (idx != -1) {
            break;
        }
        l_l = l_m+1;
    };
    if (idx == -1) {
        return;
    }
    reverse(A, l_m, m);
    reverse(A, m, idx+1);
    reverse(A,l_m, idx+1)
    // console.log(A);

    merge_in_place(A, l, l_m, idx+1);
    merge_in_place(A, l_m, idx+1, r);
}

function mergesort_body(A: number[], l: number, r: number) {
    const m = l + Math.floor((r - l) / 2);
    if (m-l>1) mergesort_body(A, l, m);
    if (r-m>1) mergesort_body(A, m, r);
    // console.log(`[${A.slice(l,m)}] [${A.slice(m,r)}]`);
    if (A[m-1] > A[m]) merge_in_place(A, l, m, r);
    // console.log(`[${A.slice(l,r)}]`);
    // console.log();
}

function mergesort(A: number[]) {
    mergesort_body(A, 0, A.length);
}

test_mergesort(mergesort);
