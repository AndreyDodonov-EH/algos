const { vis_arrayAsHeap } = require('./_vis.js');

function swap(A, i, j) {
    let temp = A[i];
    A[i] = A[j];
    A[j] = temp;
}

function maxHeapify_rec(A, i) {
    let largest = i;
    const l = 2*i+1;
    const r = l+1;
    if (i < A.length && A[l] > A[i]) {
        largest = l;
    }
    if (r < A.length && A[r] > A[largest]) {
        largest = r;
    }
    if (largest != i) {
        swap(A, i, largest);
        maxHeapify_rec(A, largest);
    }
}

function maxHeapify_loop(A, i, n) {
    while (i < Math.floor(n/2)) {
        let largest = i;
        const l = 2*i+1;
        const r = l+1;
        if (i < n && A[l] > A[i]) {
            largest = l;
        }
        if (r < n && A[r] > A[largest]) {
            largest = r;
        }
        if (i == largest) {
            break;
        }
        swap(A, i, largest);
        i = largest;
    }
}

function buildMaxHeap(A, n) {
    vis_arrayAsHeap(A);
    for (let i=Math.floor((n-1)/2); i>=0; i--) {
        maxHeapify_loop(A, i, n);
    }
}

function heapSort(A) {
    buildMaxHeap(A, A.length);
    for (let i=A.length-1; i>0; i--) {
        swap(A, 0, i)
        maxHeapify_loop(A, 0, i);
    }
}

console.log("Starting...");
// let array = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
// let array = [10, 6, 9, 4, 5, 7, 3];
let array = [16, 14, 10, 8, 7, 9, 3, 2, 4, 1];
vis_arrayAsHeap(array);

// buildMaxHeap(array, array.length);

heapSort(array);
console.log("Sorted array:", array);