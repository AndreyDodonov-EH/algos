import { ListNode, fromArray, print } from "./_helpers";

// L0->Ln->L1->LN-1->L2->LN-2->...
// We need to merge first half and second half reversed
// 1. count total
// 2. define the size of the first half and the second half - be careful with indiced
// 3. go to the end of first half, terminate it (backing up first el in second half)
// 4. reverse second half
// 5. merge them
function reorderList(head: ListNode | null): void {
    if (head === null) {
        return;
    }
    if (head.next === null) {
        return;
    }
    // 1. count total
    let cur = head;
    let totalSize = 0;
    while (cur !== null) {
        cur = cur.next!;
        totalSize++;
    }
    // 2. sizes of halves
    const leftSize = Math.ceil(totalSize / 2);
    // const rightSize = Math.floor(totalSize / 2);

    cur = head;
    // 3. go to the end of first half and define first element in the second
    for (let i = 0; i < leftSize - 1; i++) {
        cur = cur.next!;
    }
    const headOfSecond = cur?.next;
    // and terminate first half (which will later be end of the list)
    cur!.next = null;
    // 4. reverse second half
    let prev = headOfSecond;
    cur = headOfSecond!.next!;
    // terminate future end of to-be-reversed second half
    prev!.next = null;
    while (cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next!;
    }
    const headOfReversedSecond = prev;
    // 5. now merge head and head of reversed second
    let first=head;
    let second=headOfReversedSecond;
    for (let i=0;i<totalSize;i++) {
        if (i%2 == 0) {
            const next = first?.next;
            first.next = second;
            first = next!;
        } else {
            const next = second?.next;
            second!.next = first;
            second = next!;
        }
    }
}

function test() {
    let A = [1,2,3,4];
    const head = fromArray(A);
    reorderList(head);
    print(head);
}

test();
