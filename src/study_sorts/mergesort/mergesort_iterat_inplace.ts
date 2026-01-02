import { test_mergesort } from "./test_harness";
import { bench_mergesort } from "./bench_harness";

function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function find_idx_of_first_bigger(key: number, A: number[], l: number, r: number) {
    let firstBiggerIdx = -1;
    if (A[l] > key) {
        return l;
    }
    // use gallopping to find a window where firstBiggerIndex will be
    let l_b = l + 1;
    let step = 1;
    let r_b = l_b + step;
    while((r_b < r) && (A[r_b] <= key)) {
        l_b = r_b + 1;
        step = step*2;
        r_b = l_b + step;
    }
    if (r_b >= r) {
        r_b = r-1;
    }    
    r_b++; // we prefer non-inclusive ranges

    while(l_b < r_b) {
        const m = l_b + Math.floor((r_b-l_b)/2);
        if (A[m] > key) {
            r_b = m;
            firstBiggerIdx = m;
        } else {
            l_b = m+1;
        }
    }
    return firstBiggerIdx;
}

function find_idx_of_last_smaller(key: number, A: number[], l: number, r: number) {
    let lastSmallestIdx = -1;
    if (A[r-1] < key) {
        return r-1;
    }

    //  use gallopping to find a window where lastSmallerIdx will be
    let l_b = l;
    let step = 1;
    let r_b = l_b + step;
    while((r_b < r-1 ) && (A[r_b] < key)) {
        lastSmallestIdx = r_b;
        l_b = r_b + 1;
        step = step*2;
        r_b = l_b + step;
    }
    if (r_b >= r - 1) {
        r_b = r-2;
    }
    r_b++;

    while (l_b<r_b) {
        let midIdx = l_b+Math.floor((r_b-l_b)/2);
        if (A[midIdx] < key) {
            lastSmallestIdx = midIdx;
            l_b = midIdx + 1;
        } else {
            r_b = midIdx;
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

function mergesort(A: number[]) {
    let size = 1;
    while (size < A.length) {
        let i = 0;
        while (i < A.length) {
            const m: number = Math.min(i + size, A.length);
            const r: number = Math.min(m + size, A.length);
            if (r-i>1) merge_in_place(A, i, m, r);
            i += 2*size;
        }
        size *= 2;
    }
}

test_mergesort(mergesort);
bench_mergesort(mergesort, "iterate_inplace");
