import { ListNode, fromArray, print } from "./_helpers";

function swap(A:number[], i:number, j:number) {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
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

function quicksort_body(A: number[], l:number, r:number) {
    if (r-l<=1) {
        return;
    }
    const j = partition(A, l, r);
    quicksort_body(A,l,j);
    quicksort_body(A,j+1,r);
}

function quicksort(A: number[]) {
    quicksort_body(A, 0, A.length);
}


function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const dummy = new ListNode();
    let tail = dummy;
    let A = [];
    for (let l of lists) {
        while(l) {
            A.push(l.val);
            l = l.next;
        }
    }
    quicksort(A);
    for (let i=0;i<A.length;i++) {
        tail.next = new ListNode(A[i]);
        tail = tail.next;
    }
    tail.next = null;
    return dummy.next;
};

function prepare_input() {
    const lists: Array<ListNode | null> = [];
    const input = [[1,2,5], [0, 3, 5]];
    for (let i=0;i<input.length;i++) {
        const head = fromArray(input[i]);
        lists.push(head);
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
