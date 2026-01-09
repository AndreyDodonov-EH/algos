import { log } from "../../../_helpers/log";
import { randomNumberIntArray } from "../../../_helpers/random";

function swap(A:number[],i:number,j:number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

// we compare on A, but swap on I
function partition(A: number[], l: number, r: number, I: number[]): number {
    // swap median point and last element to slightly guard us from adversarial (sorted) inputs
    // safer would be median of 3, median of 9 or random
    const m = l + Math.floor((r-l)/2);
    swap(I, m, r-1);
    let pivotVal = A[I[r-1]];
    let idx_of_first_bigger = l;
    for (let i=l;i<r-1;i++) {
        if (A[I[i]]<pivotVal) {
            swap(I,i,idx_of_first_bigger++);
        }
    }
    swap(I,idx_of_first_bigger,r-1);
    // in fact now it's index of pivot after the swap
    return idx_of_first_bigger;
}

function quickselect_index(A: number[], k: number): number {
    let I: number[] = new Array(A.length);
    for (let i = 0; i < A.length; i++) {
        I[i] = i;
    }
    let l = 0;
    let r = A.length;
    while (l<r) {
        let j = partition(A,l,r,I);
        if (j > k) { // if pivot is to the right from needed element, recurse into the left part
            r = j;
        } else if (j < k) { // if pivot is to the left from needed element, recurse into the right part
            l = j+1;
        } else { // we found our element
            return I[k];
        }
    }
    return -1;
}

function verify_quickselect_index(A:number[], B: number[], k:number, idx:number):boolean {
    B.sort((a,b)=>a-b);
    if (A[idx]===B[k]) { // in a sorted array k-th smallest will be at position k
        return true;
    }
    return false;
}

function test() {
    for (let i=1;i<100;i++) {
        for (let j=1;j<i;j++) {
            const A: number[] = randomNumberIntArray(j,0,i);
            // const A:number[] = [5,7,0,8];
            const k = Math.floor(Math.random() * j);
            const idx = quickselect_index(A, k);
            const B: number[] = [...A]; // out check is desctructive, so back up
            const ok = verify_quickselect_index(A, B, k, idx);
            if (!ok) {
                log(`k: ${k}`);
                log(`idx: ${idx}`);
                log(A);
                log(B);
            }
        }
    }
}

test();
