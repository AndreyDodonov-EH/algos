export class ListNode {
    constructor(public val: number = 0, public next: ListNode | null = null, public prev: ListNode | null = null) {}
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


export function print(head: ListNode|null) {
    while (head) {
        process.stdout.write(head.val.toString()+" ");
        head = head.next;
    }
    console.log()
}

export function printCycled(head: ListNode|null) {
    // brute force cycle detection
    let A: Array<ListNode|null> = [];
    while (head) {
        const idx = A.indexOf(head);
        if (idx !== -1) {
            console.log(`to ${A[idx]!.val} (idx ${idx})`);
            return;
        }
        A.push(head);
        process.stdout.write(head.val.toString() + " ");
        head = head.next;
    }
}

export function addCycleTo(head: ListNode | null, idx: number) {
    let cycleTarget = head;
    let i=0;
    for (i;i<idx;i++) {
        cycleTarget = cycleTarget?.next!;
    }
    let cur = cycleTarget;
    while (cur!.next !== null) {
        cur = cur?.next!;
    }
    cur!.next = cycleTarget;
}
