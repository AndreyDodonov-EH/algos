class ListNode {
    constructor(public val: number = 0,
        public next: ListNode|null = null,
        public prev: ListNode|null = null ) {}
}
class MyDeque {
    constructor() {
        this.dummyHead = new ListNode();
        this.dummyTail = new ListNode();
        this.dummyHead.next = this.dummyTail;
        this.dummyTail.prev = this.dummyHead;
    }

    private dummyHead: ListNode;
    private dummyTail: ListNode;

    print() {
        let cur = this.dummyHead.next;
        while (cur !== this.dummyTail) {
            process.stdout.write(` ${cur!.val} `);
            cur = cur!.next;
        }
        console.log();
    }

    /**
     * @return {boolean}
     */
    isEmpty(): boolean {
        return (this.dummyHead.next === this.dummyTail);
    }

    /**
     * @param {number} value
     */
    append(value: number) {
        const tail = this.dummyTail.prev;
        const newbie = new ListNode(value, this.dummyTail, tail);
        this.dummyTail.prev = newbie;
        tail!.next = newbie;
    }

    /**
     * @param {number} value
     * @return {void}
     */
    appendleft(value: number) {
        const head = this.dummyHead.next;
        const newbie = new ListNode(value, head, this.dummyHead);
        this.dummyHead.next = newbie;
        head!.prev = newbie;

    }

    /**
     * @return {number}
     */
    pop() {
        if (this.isEmpty()) {
            return -1;
        }
        const tail = this.dummyTail.prev!;
        const newTail = tail.prev!;
        // connect previous to the tail to the dummy tail
        newTail.next = this.dummyTail;
        // connect dummy tail to our new tail
        this.dummyTail.prev = newTail;
        return tail.val;
    }

    /**
     * @return {number}
     */
    popleft() {
        if (this.isEmpty()) {
            return -1;
        }
        const head = this.dummyHead.next!;
        const newHead = head.next!;
        newHead.prev = this.dummyHead;
        this.dummyHead.next = newHead;
        return head.val;
    }
}

function test() {
    const d = new MyDeque();
    for(let i=0;i<10;i++) {
        if (i%2) {
            d.append(i);
        } else {
            d.appendleft(i);
        }
    }
    d.print();
}

test();
