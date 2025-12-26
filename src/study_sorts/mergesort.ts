function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function merge_rec(A: number[], a: number, p: number, r: number) {
    // Tail Call Optimization: Loop instead of recursing on the right side
    // ToDo: actualy understand taill call optimization, ask AI for examples
    while (p <= r) {
        let i = a;
        let j = p;
        for (; i < p && j <= r; i++) {
            if (A[i] <= A[j]) {
                continue;
            }
            swap(A, i, j);
            if (j + 1 <= r && A[j] > A[j + 1]) {
                j++;
            }
        }
        if (p >= j) {
            break;
        }
        merge_rec(A, a, p, j);
        a = p;
        p = j;
    }
}

function merge(A: number[], a: number, p: number, r: number) {
    let B: number[] = new Array(r-p+1);
    let i=a;
    let j=p;
    let k=0;
    for (;i<p && j<=r;k++) {
        if (A[i] <= A[j]) {
            B[k] = A[i++];
        } else {
            B[k] = A[j++];
        }
    }
    for (;i<p;k++) {
        B[k] = A[i++];
    }
    for (;j<=r;k++) {
        B[k] = A[j++];
    }
    A.splice(a,B.length,...B);
}

function binary_search(A:number[], keyVal: number, l: number, r: number) {
    while (l<=r) {
        let m = Math.floor((l+r)/2);
        if (A[m] < keyVal) {
            l = m+1;
        } else if (A[m] > keyVal) {
            r = m-1;
        } else {
            return m;
        }
    }
    return -1;
}

function find_idx_of_last_smaller(key: number, A: number[], leftIdx: number, rightIdx: number) {
    let lastSmallestIdx = -1;
    while (leftIdx<=rightIdx) {
        if (A[rightIdx] < key) {
            lastSmallestIdx = rightIdx; 
            break;
        }
        if (A[leftIdx] > key) {
            break;
        }
        let midIdx = Math.floor((leftIdx+rightIdx)/2);
        if (A[midIdx] < key) {
            lastSmallestIdx = midIdx;
            leftIdx = midIdx+1;
        } else {
            rightIdx = midIdx-1;
        }
        continue;
    }
    return lastSmallestIdx;
}

function reverse(A: number[], p: number, r: number) {
    while (p<r) {
        swap(A, p++, r--);
    }
}

function merge_in_place(A: number[], a: number, p: number, r: number) {
    if (a>p || p>r ) { // rec exit condition - empty subarray
        return;
    } 
    if (r-a <= 1) { //edge case
        if (A[a] > A[r]) {
            swap(A,a,r);
        }
        return;
    }
    
    let idx = -1;
    let l_l = a;
    let l_r = p;
    let l_m = -1;
    while (l_l<=l_r) {
        l_m = Math.floor((l_l+l_r)/2); 
        const key = A[l_m];
        idx = find_idx_of_last_smaller(key, A, p, r);
        if (idx != -1) {
            break;
        }
        l_l = l_m+1;
    };
    if (idx == -1) {
        return;
    }
    // swap [left_mid, p-1] and [p, idx] using triple reverse technique
    reverse(A, l_m, p-1);
    reverse(A, p, idx);
    reverse(A,l_m,idx)

    merge_in_place(A, a, l_m, idx);
    merge_in_place(A, l_m, idx+1, r);
}

function test_merge() {
    let A: number[] = [5,7,9,8,10];
    merge_rec(A,0,3,A.length-1);
    console.log(A);
}

test_merge();


// ToDo 1: apply feedback from AI on optimizing normal merge
// ToDo 2: ask AI about in-place merge
// ToDo 3: try to implement index-based (instead of rec) mergesort_body itself (NOT merge procedure)
// Then Radix-sort, including todos from slack, understanding it, understanding nuances from polylog, implementing radix-sort cold

// then implement A LOT COLD
// then play around with timsort, analyses of it in node/bun etc. other sweety chilly AI things from Slack

function mergesort_body(A: number[], p: number, r: number) {
    if (r - p < 1) {
        return;
    }
    const mid = p + Math.floor((r - p) / 2);
    mergesort_body(A, p, mid);
    mergesort_body(A, mid+1, r);
    merge_in_place(A, p, mid+1, r);
}

function mergesort(A: number[]) {
    mergesort_body(A, 0, A.length-1);
}

function randomIntArray(
    length: number,
    min: number,
    max: number // inclusive
): number[] {
    return Array.from({ length }, () =>
        Math.floor(min + Math.random() * (max - min + 1))
    );
}

function isSorted(a: readonly number[]): boolean {
    for (let i = 1; i < a.length; i++) {
        if (a[i - 1] > a[i]) return false;
    }
    return true;
}

function test_mergesort() {
    // let A: number[] = [2, 3, 8, 19, 50, 100, 1, 5, 7, 11, 20, 37, 10, 25];
    // let A: number[] = [2,8, 19, 3, 10];
    for (let i = 0; i < 100; i++) {
        let A: number[] = randomIntArray(100000, 0, 100000);
        // let A: number[] = [9, 4, 2, 6, 1, 4, 8, 3, 8, 9];
        let B: number[] = A.slice(0, A.length);
        mergesort(A);
        if (!isSorted(A)) {
            console.error("Array is not sorted!");
            console.log(B);
            console.log(A);
        }
    }
}

test_mergesort();
