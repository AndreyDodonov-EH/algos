export class ListNode {
    constructor(public val: number = 0, public next: ListNode | null = null) {}
}

export function print(head: ListNode|null) {
    while (head) {
        process.stdout.write(head.val.toString()+" ");
        head = head.next;
    }
    console.log()
}

export function fromArray(A: number[]): ListNode | null {
    const dummyHead = new ListNode();
    let cur = dummyHead;
    for (const val of A) {
        const tmp = new ListNode(val);
        cur.next = tmp;
        cur = cur.next;
    }
    return dummyHead.next;
}
