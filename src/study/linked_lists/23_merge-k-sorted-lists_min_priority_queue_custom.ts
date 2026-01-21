import { ListNode, fromArray, print } from "./_helpers";

function prepare_input() {
    const lists: Array<ListNode | null> = [];
    const input = [[1,2,5], [0, 3, 5]];
    for (let i=0;i<input.length;i++) {
        const head = fromArray(input[i]);
        lists.push(head);
    }
    return lists;
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


 function min_heapify(A: number[]) {
    // for all parents starting from the last one, float down
    const lastParentIdx = _getParentIdx(A.length-1);
    for (let i=lastParentIdx;i>=0;i--) {
        float_down(A,i);
    }
}


function extract_from_heap(A: number[]): number | null {
    if (A.length == 0) return null;
    const tmp = A[0];
    swap(A,0,A.length-1);
    A.pop();
    float_down(A,0);
    return tmp;
}


function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const dummy = new ListNode();
    let tail = dummy;
    // from just array of numbers
    let vals: number[] = [];
    for (let l of lists) {
        while(l) {
            vals.push(l.val)
            l = l.next;
        }
    }    
    // create an object-less priority queue (numbers only) (min-heapify it)
    min_heapify(vals);
    // then keep extracting from it
    let val = null;
    while ((val=extract_from_heap(vals)) !== null) {
        // and adding to the new list
        tail.next = new ListNode(val);
        tail = tail.next;
    }
    tail.next = null;
    return dummy.next;
};

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
