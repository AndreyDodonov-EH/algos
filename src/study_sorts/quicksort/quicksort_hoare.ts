import { test_sort } from "../../helpers/test_harness";

// pick element in the middle and then sweep to the left and right relative to it's value,
// but not it's position
function partition_hoare(A: number[], p: number, r: number): [number, number] {
    let x = A[Math.floor((r + p) / 2)];
    let i = p;
    let j = r;

    while (true) {
        while (A[i] < x) i++;
        while (A[j] > x) j--;
        if (i >= j) return [i,j];
        [A[i], A[j]] = [A[j], A[i]];
        i++; j--;
    }
}

function partition_hoare_claude(A: number[], p: number, r: number): [number, number] {
    let x = A[Math.floor((p + r) / 2)];
    let i = p - 1;
    let j = r + 1;

    while (true) {
        do { i++; } while (A[i] < x);
        do { j--; } while (A[j] > x);

        if (i >= j) return [i, j];

        [A[i], A[j]] = [A[j], A[i]];
    }
}

function quicksort_body(A: number[], p: number, r: number) {
    if (r<=p) return;
    const pivots = partition_hoare(A, p, r);
    quicksort_body(A, p, pivots[1]);
    quicksort_body(A, pivots[1]+1, r);
}

export function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length - 1);
}

test_sort(quicksort);
