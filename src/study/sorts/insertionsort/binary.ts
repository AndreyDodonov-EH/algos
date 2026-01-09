import { test_sort } from "../_helpers/test_harness";

function binary_search(A: number[], l:number, r:number) {
    const val = A[r];
    let idx_of_first_bigger = r;
    while(l<r) {
        const m=l+Math.floor((r-l)/2);       
        if (A[m]<=val) { // if middle index is smaller or equal (or equal for stability), recurse into the right part
            l=m+1;
        } else { // recurse into the left part
            r=m;
            idx_of_first_bigger = m;
        }
    }
    return idx_of_first_bigger;
}

function insertionsort_binary(A: number[]) {
    // for all elements starting with the second one
    for (let i=1;i<A.length;i++) {
        // we insert it to the correct position in the left part, thus keeping it sorted
        const idx_of_first_bigger = binary_search(A, 0, i);
        const tmp = A[i];
        for (let j=i;j>idx_of_first_bigger;j--){
            A[j]=A[j-1];
        }
        A[idx_of_first_bigger] = tmp;
    }
}

test_sort(insertionsort_binary);
