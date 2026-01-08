import { log } from "../../../_helpers/log"
import { test_sort } from "../_helpers/test_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function three_way_swap(A: number[], i: number, e: number, b: number) {
    const tmp = A[i];
    A[i] = A[b];
    A[b] = A[e];
    A[e] = tmp;
}

function partition_dnf(A: number[], l: number, r: number): [number, number] {
    // we grow two invariants
    let idx_of_first_equal = l;
    let idx_of_first_bigger = l;
    for(let i=l;i<r-1;i++) {
        if (A[i] < A[r-1]) {
            three_way_swap(A, i, idx_of_first_equal, idx_of_first_bigger);
            idx_of_first_equal++;
            idx_of_first_bigger++;
        } else if (A[i] === A[r-1]) {
            swap(A, i, idx_of_first_bigger++);
        }
    }
    swap(A, idx_of_first_bigger, r-1);
    return [idx_of_first_equal, idx_of_first_bigger];
}

function quicksort_body(A: number[], l: number, r: number) {
    if (r-l<=1) {
        return;
    }
    // 1. partition into two parts sorted relative to each other
    const pivot = partition_dnf(A, l, r);
    // 2. recurse into those parts
    quicksort_body(A, l, pivot[0]);
    quicksort_body(A, pivot[1]+1,r);
}

function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length);
}

test_sort(quicksort);
