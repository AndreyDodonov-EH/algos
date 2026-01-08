import { log } from "../../helpers/log";
import { randomNumberIntArray } from "../../helpers/random";

function swap(A: number[], i: number, j: number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function partition(A: number[], l: number, r: number): number {
    // parition lomuto with optimization of skipping initial smaller elements
    // also take median instead of the last element to decrease possibility of O(N^2)
    const m = l + Math.floor((r-l)/2);
    swap(A, m, r-1);
    // take last element (pivotVal)
    const pivotVal = A[r - 1];
    let i = l; // running counter
    let idx_of_first_bigger = -1;
    // skip initial smaller or equal elements
    while (i < r && A[i] <= pivotVal) {
        i++;
    }
    idx_of_first_bigger = i;
    if (idx_of_first_bigger == r) {
        return idx_of_first_bigger - 1;
    }
    i++;
    // iterate from left to right shifting smaller elements before groups of big elements
    while (i < r - 1) {
        if (A[i] <= pivotVal) {
            swap(A, i++, idx_of_first_bigger++);
        } else {
            i++;
        }
    }
    // at the end swap our pivotVal with resulting pivot index
    swap(A, idx_of_first_bigger, r - 1);
    return idx_of_first_bigger;
}

function verify_partition(A: readonly number[], l: number, r: number, pivot_idx: number): boolean {
    const pivot_val = A[pivot_idx];
    for (let i = l; i < pivot_idx; i++) {
        if (A[i] > pivot_val) {
            return false;
        }
    }
    for (let i = pivot_idx + 1; i < r; i++) {
        if (A[i] < pivot_val) {
            return false;
        }
    }
    return true;
}

function test_partition() {
    for (let i = 1; i < 100; i++) {
        for (let j = 1; j < i; j++) {
            let A: number[] = randomNumberIntArray(j, 0, 100);
            // let A:number[] = [1, 5, 4, 3, 3];
            const backup = [...A];
            const pivot_idx = partition(A, 0, A.length);
            const ok = verify_partition(A, 0, A.length, pivot_idx);
            if (!ok) {
                log(pivot_idx);
                log(backup);
                log(A);
                log(`[${A.slice(0, Math.max(pivot_idx - 1, 0))}][${A[pivot_idx]}][${A.slice(pivot_idx + 1, A.length)}]`)
            }
        }
    }
}

test_partition();

function quickselect(A: number[], k: number): number {
    if (k < 0 || k >= A.length) {
        throw new RangeError(`Provided index ${k} is out of range [0, ${A.length})`);
    }
    // partition into two parts
    // if partition pivot is greater than k, recurse into left part
    // if partition pivot is less than k, recurse into right part
    // else (equal) we have found our element
    let l: number = 0;
    let r: number = A.length;
    while (l < r) {
        const pivot_idx = partition(A, l, r);
        // log(`[${A.slice(0, Math.max(pivot_idx - 1, 0))}][${A[pivot_idx]}][${A.slice(pivot_idx + 1, A.length)}]`)
        if (pivot_idx > k) {
            r = pivot_idx;
        } else if (pivot_idx < k) {
            l = pivot_idx + 1;
        } else {
            return A[k];
        }
    }
    throw new Error("Unknown error, element not found");
}

function verify_quickselect(A:number[], k:number, val:number):boolean {
    A.sort((a,b)=>a-b);
    if (A[k]===val) {
        return true;
    }
    return false;
}

function test() {
    for (let i=1;i<100;i++) {
        for (let j=1;j<i;j++) {
            const A: number[] = randomNumberIntArray(j,0,i);
            // search shouldn't be destructive
            const B: number[] = [...A];
            const k = Math.floor(Math.random() * j);
            const val = quickselect(B, k);
            const C: number[] = [...B];
            const ok = verify_quickselect(C, k, val);
            if (!ok) {
                log(k);
                log(val);
                log(A);
                log(B);
            }
        }
    }
}

test();
