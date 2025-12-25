function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function merge_rec(A: number[], a: number, p: number, r: number) {
    let i = a;
    let j = p;
    for (; i < p; i++) {
        if (A[i]<A[j]) {
            continue;
        }
        swap(A, i, j);
        if (A[j] > A[j+1]) {
            j++;
        }
    }
    if (i==j) {
        return;
    }
    merge_rec(A, a, p, j-1);
    merge_rec(A, a, j, r);
}

function merge(A: number[], a: number, p: number, r: number) {
    let B: number[] = new Array(r-p);
    let i = a;
    let j = p; 
    let k = 0;
    for (;i<p&&j<=r;k++) {
        if (A[i] < A[j]) {
            B[k] = A[i++];
        } else {
            B[k] = A[j++];
        }
    }
    for (;i<p;i++,k++) {
        B[k] = A[i];
    }
    for (;j<r;j++,k++) {
        B[k] = A[j];
    }
    for (let i=0, j=a;i<B.length;i++,j++) {
        A[j] = B[i]; 
    }
}


function mergesort_body(A: number[], p: number, r: number) {
    if (p>=r) {
        return;
    }
    const mid = p + Math.floor((r-p)/2);
    mergesort_body(A, p, mid);
    mergesort_body(A, mid+1, r);
    merge_rec(A, p, mid+1, r);
}



function mergesort(A: number[]) {
    mergesort_body(A, 0, A.length - 1);
}

function test_merge() {
    let A: number[] = [2, 3, 8, 19, 50, 100, 1, 5, 7, 11, 20, 37, 10, 25];
    // let A: number[] = [2,8, 19, 3, 10];
    // merge_rec(A, 0, 2, A.length - 1);
    mergesort(A);
    console.log(A);
}

test_merge();
