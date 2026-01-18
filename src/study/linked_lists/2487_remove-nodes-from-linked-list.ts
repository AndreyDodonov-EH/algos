// ToDo: add all version from Leetcode

import { ListNode, print, fromArray } from "./_helpers";

function removeNodes(head: ListNode|null): ListNode|null {
    if (head === null) {
        return null;
    }
    // 1. traverse creating a monotonically descending dynamic array
    let cur = head;
    let A: Array<ListNode|null> = [];
    cur = head;
    while (cur !== null) {
        while (A.length > 0 && cur.val > A.at(-1)!.val) {
            A.pop();
        }
        A.push(cur);
        cur = cur.next!;
    }
    // 2. iterate this array building resulting list
    for (let i=0;i<A.length-1;i++) {
        A[i]!.next = A[i+1];
    }
    return A[0];
}

function test() {
    let A = [5,2,13,3,8];
    const head = fromArray(A);
    print(head);
    const resultHead = removeNodes(head);
    print(resultHead);

    let i =0;
    for(;i<10;i++) {
        if (i==5) {
            break;
        }
    }
    console.log(i);
    
}

test();
