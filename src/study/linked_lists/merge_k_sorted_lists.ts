import { ListNode } from "./_helpers";

// ToDo: copy-paste here all solutions fron leetcode

import { PriorityQueue } from "../priority_queue/PriorityQueue";


function findSmallest (S: Set<ListNode | null>): ListNode | null {
    let smallestVal = Infinity;
    let smallestEl = null;
    for (const el of S) {
        if (el!.val < smallestVal) {
            smallestVal = el!.val;
            smallestEl = el;
        }
    }
    return smallestEl;
}

function swap(A:number[], i:number, j:number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

function _getParentIdx(i: number) {
    return Math.floor((i-1)/2);
}

function float_down(A:number[], i: number) {
    while (i<A.length/2) {
        let idx_of_smallest = i;
        const leftIdx = 2*i+1
        const rightIdx = leftIdx+1;
        if (leftIdx<A.length && A[leftIdx] < A[idx_of_smallest]) {
            idx_of_smallest = leftIdx;
        }
        if (rightIdx<A.length && A[rightIdx] < A[idx_of_smallest]) {
            idx_of_smallest = rightIdx;
        }
        if (i === idx_of_smallest) {
            break;
        }
        swap(A, i, idx_of_smallest);
        i = idx_of_smallest;
    }
}

function test_float_down() {
    let A = [3, 2, 1, 4,5];
    float_down(A, 0);
    console.log(A);
}

// test_float_down();

function min_heapify(A: number[]) {
    // for all parents starting from the last one, float down
    const lastParentIdx = _getParentIdx(A.length-1);
    for (let i=lastParentIdx;i>=0;i--) {
        float_down(A,i);
    }
}

function test_min_heapify() {
    let A = [4, 3, 12, 5, 7, 9, 8];
    min_heapify(A);
    console.log(A);
}

// test_min_heapify();

function extract_from_heap(A: number[]): number | null {
    if (A.length === 0) return null;
    const tmp = A[0];
    swap(A,0,A.length-1);
    A.pop();
    float_down(A,0);
    return tmp;
}

function test_extract_from_heap() {
    let val = null;
    let A = [3, 6, 4, 5, 2, 1, 9, 10];
    min_heapify(A);
    while (val=extract_from_heap(A)) {
        console.log(val);
    }
}

// test_extract_from_heap();

function insertion_sort(A: number[]) {
    for (let i=1;i<A.length;i++) {
        const val = A[i];
        let j = i;
        while(j>0 && val < A[j-1]) {
            A[j] = A[j-1];
            j--;
        }
        A[j] = val;
    }
}

function partition(A: number[], l:number, r:number):number {
    const keyVal = A[l];
    let i=l+1;
    let j=r-1
    while(true) {
        while(i<=j && A[i]<keyVal) i++;
        while(i<=j && A[j]>keyVal) j--;
        if (i>=j) {
            break;
        }
        swap(A, i++, j--);
    }
    if (A[l] > A[j]) swap(A, l, j);
    return j;
}

function test_partition() {
    let A = [-1,2,1];
    const j = partition(A, 0, A.length);
    console.log(`[${A.slice(0,j)}] [${A[j]}] [${A.slice(j+1, A.length)}]`);
}

test_partition();

function quicksort_body(A: number[], l:number, r:number) {
    if (r-l<=1) {
        return;
    }
    console.log(A.slice(l,r))
    const j = partition(A, l, r);
    console.log(`[${A.slice(l,j)}] [${A.slice(j, r)}]`);
    quicksort_body(A,l,j);
    quicksort_body(A,j+1,r);
}

function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length);
}

function test_quicksort() {
    let A = [3, 2, 1, 5, 7, -1];
    quicksort(A);
    console.log(A);
}

test_quicksort();

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const dummy = new ListNode();
    let tail = dummy;
    let vals: number[] = [];
    for (let l of lists) {
        while(l) {
            vals.push(l.val)
            l = l.next;
        }
    }
    insertion_sort(vals);
    for (let i=0;i<vals.length;i++) {
        tail.next = new ListNode(vals[i]);
        tail = tail.next;
    }
    tail.next = null;
    return dummy.next;
};

function print(head: ListNode | null){
    let crt = head;
    while (crt !== null) {
        console.log(crt.val);
        crt = crt.next;
    }
}

function prepare_input() {
    const lists: Array<ListNode | null> = [];
    const input = [[1,2,5], [0, 3, 5]];
    for (let i=0;i<input.length;i++) {
        const dummy = new ListNode();
        let tail = dummy;
        for (let j=0;j<input[i].length;j++) {
            tail.next = new ListNode(input[i][j]);
            tail = tail.next;
        }
        lists.push(dummy.next);
    }
    return lists;
}

function test() {
    const lists = prepare_input();
    for (let i=0;i<lists.length;i++){
        print(lists[i]);
        console.log();
    }
    const merged = mergeKLists(lists);
    print(merged);
}

test();
