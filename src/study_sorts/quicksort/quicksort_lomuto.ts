import { test_sort } from "../../helpers/test_harness";

// keep sweeping smaller elements to the left side
function partition_lomuto(A: number[], p: number, r: number):[number, number] {
    let x = A[r]
    let i = p
    let j = p
    for (j = p; j < r; j++) {
        if (A[j] < x) {
            [A[i], A[j]] = [A[j], A[i]];
            i++;
        }
    }
    [A[i], A[r]] = [A[r], A[i]];
    return [i, j];
}


function quicksort_body(A: number[], p: number, r: number) {
    if (r<=p) return;
    const pivots = partition_lomuto(A, p, r);
    quicksort_body(A, p, pivots[0]-1);
    quicksort_body(A, pivots[0]+1, r);
}


export function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length - 1);
}

test_sort(quicksort);
