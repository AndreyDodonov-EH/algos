import { test_sort } from "../../helpers/test_harness";

function swap(A:number[], i:number, j:number){
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function partition_sedgewick_start(A:number[], l:number, r:number): [number, number] {
    const pivotIdx = l;
    const pivotValue = A[pivotIdx];
    let i = l+1;
    let j = r-1;
    while(true) {
        while(i<j && A[i] < pivotValue) i++;
        while(j>i && A[j] > pivotValue) j--;
        if (i>=j) { break; }
        swap(A, i++, j--);
    }
    if(A[i] < A[pivotIdx]) swap(A, pivotIdx, i);
    return [i,j]
}

/// go from two ends and swap if both are mismatched
/// also added swap middle with end "ritual"
/// a.k.a. Introsort partition
function partition_sedgewick_middle_plus_ritual(A: number[], l: number, r: number):[number, number] {
    const m = l + Math.floor((r-l)/2);
    swap(A,m,r-1);
    let x = A[r-1];
    let i = l;
    let j = r - 2;
    while (true) {
        while (A[i] < x) i++;
        while (j > i && A[j] > x) {
            j--;
        }
        if (i >= j) {
            break;
        }
        swap(A,i++,j--);
    }
    swap(A,i,r-1);
    return [i, j];
}



function quicksort_body(A:number[], l:number, r:number) {
    if (r-l<=1) {
        return;
    }
    // const pivot = partition_sedgewick_start(A, l, r);
    // quicksort_body(A, l, pivot[0]);
    // quicksort_body(A, pivot[0], r);
    const pivot = partition_sedgewick_middle_plus_ritual(A, l, r);
    quicksort_body(A, l, pivot[0]);
    quicksort_body(A, pivot[0]+1, r);
}

function quicksort(A:number[]) {
    quicksort_body(A, 0, A.length);
}

test_sort(quicksort);
