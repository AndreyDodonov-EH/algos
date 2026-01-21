import { ListNode, print, fromArray } from "./_helpers";

function reverse(head: ListNode | null): ListNode | null {
    if (head == null) { // covers empty lsit case;
        return null;
    }
    if (head!.next == null) {
        return head;
    }
    // we let the head found in the last step propagate back up
    const newHead = reverse(head!.next);
    // once we are at the second last
    // we create a link from next to current
    head!.next!.next = head;
    // we break the link  from curent to next
    head!.next = null;
    // keep returning new head (ex-end)
    return newHead;
}

function test() {
    const head = fromArray([1,2,3]);
    print(head);
    const newHead = reverse(head);
    print(newHead);
}

test();
