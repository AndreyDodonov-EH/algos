import { ListNode, fromArray, print } from "./_helpers";

// L0->Ln->L1->LN-1->L2->LN-2->...
// We need to merge first half and second half reversed
// 1. two pointers: slow and fast
// 2. let them go until fast reaches the end of the list
// 3. reverse second half 
// 4. merge them
function reorderList(head: ListNode | null): void {
    if (head === null) {
        return;
    }
    // find the end of the first
    let slow = head;
    let fast = head;
    while (fast!==null && fast.next!==null) {
        slow = slow.next!;
        fast = fast.next.next!;
    }
    // ??? slow can point either to the last element of the left part (odd case), or to the first part in the second (even case)
    // but it doesn't matter, because last element from the second half be effectively last from the first
    // reverse second half
    let prev=null;
    let cur = slow;
    while (cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next!;
    }
    let first = head;
    let second = prev;
    // now merge them
    while(second!.next!==null) {
        let tmp = first.next;
        first.next = second;
        first = tmp!;
        tmp = second!.next;
        second!.next = first;
        second = tmp;
    }
}

function test() {
    let A = [1,2,3,4];
    const head = fromArray(A);
    reorderList(head);
    print(head);
}

test();
