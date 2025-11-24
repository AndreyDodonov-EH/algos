import { vis_arrayAsHeap } from "./_vis.js";

function swap(A: Array<number>, i: number, j: number) {
    let temp = A[i]!;
    A[i] = A[j]!;
    A[j] = temp;
}

function maxHeapify_rec(A: Array<number>, i: number) {
    let largest = i;
    const left = 2*i+1;
    const right = left+1;
    if (left < A.length && A[left] > A[largest]) {
        largest = left;
    }
    if (right < A.length && A[right] > A[largest]) {
        largest = right;
    }
    if (largest != i) {
        swap(A, i, largest);
        maxHeapify_rec(A, largest);
    }
}

function maxHeapify_loop(A: Array<number>, i: number, n: number) {
    while (i < Math.floor(n/2)) {
        let largest = i;
        const left = 2*i+1;
        const right = left+1;
        if (left < n && A[left]! > A[largest]!) {
            largest = left;
        }
        if (right < n && A[right]! > A[largest]!) {
            largest = right;
        }
        if (i == largest) {
            break;
        }
        swap(A, i, largest);
        i = largest;
    }
}

function buildMaxHeap(A: Array<number>, n: number) {
    // vis_arrayAsHeap(A);
    for (let i=Math.floor((n-1)/2); i>=0; i--) {
        maxHeapify_loop(A, i, n);
    }
}

function heapSort(A: Array<number>) {
    buildMaxHeap(A, A.length);
    for (let i=A.length-1; i>0; i--) {
        swap(A, 0, i)
        maxHeapify_loop(A, 0, i);
    }
}

import { getDataExtractorApi } from "@hediet/debug-visualizer-data-extraction";

getDataExtractorApi().registerExtractor({
    id: "my-foo-extractor",
    getExtractions: (data, collector) => {
            collector.addExtraction({
                id: "my-foo-extraction",
                name: "My Foo Extraction",
                priority: 2000,
                extractData: () => ({ kind: { text: true }, text: "Foo" }),
            });
    },
});


console.log("Starting...");
// let array = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
// let array = [10, 6, 9, 4, 5, 7, 3];
let array = new Array(16, 14, 10, 8, 7, 9, 3, 2, 4, 1);
vis_arrayAsHeap(array);

// buildMaxHeap(array, array.length);

heapSort(array);
console.log("Sorted array:", array);