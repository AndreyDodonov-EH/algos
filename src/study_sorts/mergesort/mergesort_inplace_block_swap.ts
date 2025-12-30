import { test_mergesort } from "./test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function find_idx_of_last_smaller(key: number, A: number[], leftIdx: number, rightIdx: number) {
    let lastSmallestIdx = -1;
    while (leftIdx<=rightIdx) {
        if (A[rightIdx] < key) {
            lastSmallestIdx = rightIdx; 
            break;
        }
        if (A[leftIdx] > key) {
            break;
        }
        let midIdx = Math.floor((leftIdx+rightIdx)/2);
        if (A[midIdx] < key) {
            lastSmallestIdx = midIdx;
            leftIdx = midIdx+1;
        } else {
            rightIdx = midIdx-1;
        }
        continue;
    }
    return lastSmallestIdx;
}

function reverse(A: number[], p: number, r: number) {
    while (p<r) {
        swap(A, p++, r--);
    }
}

function merge_in_place(A: number[], a: number, p: number, r: number) {
    if (a>=p || p>r ) { // rec exit condition - empty subarray
        return;
    } 
    if (r-a <= 1) { //edge case
        if (A[a] > A[r]) {
            swap(A,a,r);
        }
        return;
    }
    
    let idx = -1;
    let l_l = a;
    let l_r = p-1;
    let l_m = -1;
    while (l_l<=l_r) {
        l_m = Math.floor((l_l+l_r)/2); 
        const key = A[l_m];
        idx = find_idx_of_last_smaller(key, A, p, r);
        if (idx != -1) {
            break;
        }
        l_l = l_m+1;
    };
    if (idx == -1) {
        return;
    }
    // swap [left_mid, p-1] and [p, idx] using triple reverse technique
    reverse(A, l_m, p-1);
    reverse(A, p, idx);
    reverse(A,l_m,idx)

    merge_in_place(A, a, l_m, idx);
    merge_in_place(A, l_m, idx+1, r);
}

function mergesort_body(A: number[], B:number[], p: number, r: number) {
    if (r - p < 1) {
        return;
    }
    const mid = p + Math.floor((r - p) / 2);
    mergesort_body(A, B, p, mid);
    mergesort_body(A, B, mid+1, r);
    merge_in_place(A, p, mid + 1, r);
}

function mergesort(A: number[]) {
    let B = new Array(Math.ceil(A.length/2));
    mergesort_body(A, B, 0, A.length-1);
}

test_mergesort(mergesort);
