import { ListNode, print, fromArray } from "./_helpers";

function reverse(head: ListNode | null): ListNode | null {
    if (head == null) {
        return null;
    }
    let prev = null;
    let crt: ListNode | null = head;
    while (crt !== null) {
        const futureCrt: ListNode | null = crt.next;
        crt.next = prev;
        prev = crt;
        crt = futureCrt;
    }
    return prev;
};

function test() {
    const head = fromArray([1,2,3]);
    print(head);
    const newHead = reverse(head);
    print(newHead);
}

test();
