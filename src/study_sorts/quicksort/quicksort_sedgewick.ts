import { test_sort } from "../../helpers/test_harness";

/// go from two ends and swap if both are mismatched
/// also added swap middle with end "ritual"
/// a.k.a. Introsort partition
function partition_sedgewick(A: number[], p: number, r: number):[number, number] {
    const m = Math.floor((p+r)/2);
    [A[m], A[r]] = [A[r], A[m]];
    let x = A[r];
    let i = p;
    let j = r - 1;
    while (true) {
        while (A[i] < x) i++;
        while (j > i && A[j] > x) {
            j--;
        }
        if (i >= j) {
            break;
        }
        [A[i], A[j]] = [A[j], A[i]];
        i++; j--;
    }
    [A[i], A[r]] = [A[r], A[i]];
    return [i, j];
}

function quicksort_body(A: number[], p: number, r: number) {
    if (r<=p) return;
    const pivots = partition_sedgewick(A, p, r);
    quicksort_body(A, p, pivots[0]-1);
    quicksort_body(A, pivots[0]+1, r);
}

export function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length - 1);
}

test_sort(quicksort);
