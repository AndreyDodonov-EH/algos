import { vis_arrayAsHeap } from "./_vis"

function swap(A: Array<number>, i: number, j: number) {
    let temp = A[i]!;
    A[i] = A[j]!;
    A[j] = temp;
}

function getParentIdx(i: number) {
    return Math.floor((i-1)/2);
}

// last parent idx is a parent of the last element
function getLastParentIdx(A: Array<number>) {
    // we could call 
    //   getParentIdx(A.length-1)
    // that would be
    //   Math.floor((A.length-1-1)/2)
    // which is
    //   Math.floor((A.length-2)/2)
    // which is
    //   Math.floor(A.length/2) - 1
    return Math.floor(A.length/2) - 1;
}

function minHeapify_loop(A: Array<number>, i: number, n: number) {
    while (i < Math.floor(n/2)) {
        let smallest = i;
        const left = 2*i+1;
        const right = left+1;
        if (left < n && A[left]! < A[smallest]!) {
            smallest = left;
        }
        if (right < n && A[right]! < A[smallest]!) {
            smallest = right;
        }
        if (i == smallest) {
            break;
        }
        swap(A, i, smallest);
        i = smallest;
    }
}

function bubbleUp(A: Array<number>, i: number) {
    let parentIdx = getParentIdx(i);
    while (parentIdx >= 0 && A[i] < A[parentIdx]) {
        swap(A, i, parentIdx);
        i = parentIdx;
        parentIdx = getParentIdx(i);
    }
}

function buildMinHeap(A: Array<number>, n: number) {
    const x = vis_arrayAsHeap(A);
    const lastParentIdx = getLastParentIdx(A);
    for (let i=lastParentIdx; i>=0; i--) {
        minHeapify_loop(A, i, n);
    }
}

function heapSort(A: Array<number>) {
    buildMinHeap(A, A.length);
    for (let i=A.length-1; i>0; i--) {
        swap(A, 0, i)
        minHeapify_loop(A, 0, i);
    }
}

function changeKey(A: Array<number>, i: number, newVal: number) {
    if (newVal > A[i]) {
        increaseKey(A, i, newVal);
    } else if (newVal < A[i]) {
        decreaseKey(A, i, newVal);
    }
}


// moves element up the queue given new increased value
function increaseKey(A: Array<number>, i: number, newVal: number) {
    if (newVal < A[i]) {
        throw "We can only increase keys";
    }
    A[i] = newVal;
    minHeapify_loop(A, i, A.length);
}

// moves element up the queue given new decreased value
function decreaseKey(A: Array<number>, i:number, newVal: number) {
    if (newVal > A[i]) {
        throw "We can only decrease keys";
    }
    A[i] = newVal;
    bubbleUp(A, i);
}

// insert new element into the min-prio-q
function insertValue(A: Array<number>, val: number) {
    // 1. put at the end
    A.push(val);
    // 2. keep swapping up intil parent is smaller
    bubbleUp(A, A.length-1);
}

// extract biggest element from min-prio-q
function extractMin(A: Array<number>): number {
    const min = A[0];

    // do effectively one iteration of heapsort

    // 1. swap last and first elements
    swap(A, 0, A.length-1);

    // 2. actually remove the value
    A.pop();

    // 3. call min-heapify for the new first element
    minHeapify_loop(A, 0, A.length)

    return min;
}

// removes specified element from min-prio-q
function removeAtIdx(A: Array<number>, i: number) {
    const last: number = A.pop()!;
    if (i < A.length) {
        changeKey(A, i, last);
    }
}

const A: Array<number> = new Array(3, 7, 4, 6);
heapSort(A);
console.log(A);