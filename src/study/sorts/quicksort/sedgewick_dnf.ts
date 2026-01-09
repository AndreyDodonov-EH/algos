import { test_sort, test_partition_dnf } from "../_helpers/test_harness";

function swap(A:number[], i:number, j:number){
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

// returns tuple [eq,g]; splits effectively into [[l,eq-1][eq,g-1][g,r-1]
// (Dijkstra 3-way)
function partition_sedgewick_dnf(A:number[], l:number, r:number): [number, number] {
    const keyVal = A[l];
    let eq=l+1;
    let i=l+1;
    let g=r;
    while(i<g) {
        if (A[i] < keyVal) {
            swap(A,i++,eq++);
        } else if (A[i] === keyVal) {
            i++;
        } else if (A[i] > keyVal) {
            swap(A,i,--g);
        }
    }
    swap(A,l,--eq);
    return [eq,g];
}

test_partition_dnf(partition_sedgewick_dnf);

function quicksort_body(A:number[], l:number, r:number) {
    if (r-l<=1) {
        return;
    }
    const [eq,g] = partition_sedgewick_dnf(A, l, r);
    quicksort_body(A, l, eq);
    quicksort_body(A, g, r);
}

function quicksort(A:number[]) {
    quicksort_body(A, 0, A.length);
}

test_sort(quicksort);
