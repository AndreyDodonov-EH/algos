import { log } from "../../../_helpers/log"

import { test_sort } from "../_helpers/test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

// almost as original, but there r was inclusive
function partition_hoare_do(A: number[], l: number, r: number): number {
    // go from two sides
    // if both left element is bigger than key value 
    // and right element is smaller than key value
    // swap
    // until indexes meet
    // r-1 is critical - needed to avoid m being equal to hi and going into infinite rec
    let m = l + Math.floor((r - 1 - l) / 2);
    const pivot = A[m];
     // backup is critical, because the value at A[m] might change
    let i = l-1;
    let j = r;
    while (true) {
        do {i++;} while(A[i]<pivot);
        do {j--;} while(A[j]>pivot);
        if (i >= j) {
            return j
        }
        swap(A, i, j)
    }
}


function partition_hoare(A: number[], l: number, r: number): number {
    // go from two sides
    // if both left element is bigger than key value 
    // and right element is smaller than key value
    // swap
    // until indexes meet
    // r-1 is critical - needed to avoid m being equal to hi and going into infinite rec
    let m = l + Math.floor(((r-1) - l) / 2);
    // backup is critical, because the value at A[m] might change
    const pivot = A[m];
    let i = l;
    let j = r-1;
    while (true) {
        while(i<r-1 && A[i]<pivot) {i++;}
        while(j>l && A[j]>pivot) {j--};
        if (i >= j) {
            return j;
        }
        swap(A, i, j)
        i++; j--;
    }
}

function quicksort_body(A: number[], l: number, r: number) {
    if (r - l <= 1) {
        return;
    }
    log(`l: ${l}`)
    log(`r: ${r}`)
    const pivot = partition_hoare(A, l, r);
    log(pivot);
    log(A);
    quicksort_body(A, l, pivot+1);
    quicksort_body(A, pivot+1, r);
}

function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length);
}

test_sort(quicksort);
