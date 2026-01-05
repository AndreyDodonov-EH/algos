import { vis_arrayAsHeap } from "./_vis";

function heapsort(A: number[], max: boolean = true) {
    vis_arrayAsHeap(A);
    _buildMaxHeap(A, A.length, max);
    let unsortedSize = A.length;
    for (let i=unsortedSize-1;i>0;i--) {
        // swap last element in unsorted part with the root
        _swap(A, 0, i);
         unsortedSize--;
        // call max-heapify for the new root so that it becomes real root
        _floatDown(A, unsortedSize, 0, max);
    }
}

function _buildMaxHeap(A: number[], n: number, max: boolean) {
    for (let i=Math.floor((n-1)/2);i>=0;i--) {
        // works only if subtree is a valid heap,
        // so we need to start from the last parent
        _floatDown(A, n, i, max);
    }
}

// a.k.a. heapify
function _floatDown(A: number[], n: number, i: number, max: boolean) { 
    while (i<Math.floor(n/2)) {
        let idxOfBest = i;
        const idxOfLeft = 2*i+1;
        if (max ?
              A[idxOfLeft] > A[idxOfBest] 
            : A[idxOfLeft] < A[idxOfBest]) {
            idxOfBest = idxOfLeft;
        }
        const idxOfRight = idxOfLeft+1;
        if ((idxOfRight < n) 
            && (max ?
                A[idxOfRight] > A[idxOfBest] 
              : A[idxOfRight] < A[idxOfBest] )) {
            idxOfBest = idxOfRight;
        }
        if (idxOfBest === i) {
            break;
        } else {
            _swap(A, i, idxOfBest);
            i = idxOfBest;
        }
    }
}

function _swap(A: number[], i: number, j: number) {
    [A[i], A[j]] = [A[j], A[i]];
}

function test_heapsort() {
    let A = [3, 5, 1, 7, 9, 4];
    heapsort(A, false);
    console.log(A);
    heapsort(A, true);
    console.log(A);
}

test_heapsort();