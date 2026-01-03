import { test_mergesort } from "./test_harness";

function halfy_merge(A: number[], B: number[], l: number, m: number, r: number) {
    const left_size = (m-l);
    const right_size = (r-m);
    const left_smaller: boolean = (left_size < right_size);
    if (left_smaller) {
        for (let i=0;i<left_size;i++) {
            B[i] = A[i+l];
        }
        let i=0;
        let j=m;
        let k=l;
        while (i<left_size && j<r) {
            A[k++] = (B[i] <= A[j]) ? B[i++] : A[j++];
        }
        while (i<left_size) {
            A[k++] = B[i++]; 
        }
    } else {
        for (let i=0;i<right_size;i++) {
            B[i] = A[i+m];
        }
        let i=right_size-1; // use i to iterate backed up second half as sources from the end to the beginning
        let j=m-1; // use j to iterate first half as source from the end to the beginning
        let k=r-1; // use k to iterate our array as destination from the end to the beginning
        while (i>=0 && j>=l) {
            A[k--] = (B[i] >= A[j]) ? B[i--] : A[j--];
        }
        while (i>=0) {
            A[k--] = B[i--];
        }
    }
}

function mergesort_body(A: number[], B: number[], l: number, r: number) {
    if (r-l<=1) {
        return;
    }
    // here we can choose any m because our halfy_merge detects smaller part
    const m = l + Math.floor((r-l)/2);
    mergesort_body(A, B, l, m);
    mergesort_body(A, B, m, r);
    if (A[m-1] > A[m]) halfy_merge(A, B, l, m, r);
}

function mergesort(A: number[]) {
    const B: number[] = new Array(Math.floor(A.length/2));
    mergesort_body(A, B, 0, A.length);
}

test_mergesort(mergesort);
