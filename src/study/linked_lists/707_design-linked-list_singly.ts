import { ListNode } from "./_helpers";

class MyLinkedList {
    constructor() {
        this.left = new ListNode(0);
        this.length = 0;
    }
    private left: ListNode;
    private length: number;

    get(index: number): number {
        if (index >= this.length || index < 0) {
            return -1;
        }
        let cur = this.left.next;
        for(let i=0;i<index;i++) {
            cur = cur!.next;
        }
        return cur!.val;
    }
    addAtHead(val: number): void {
        const newHead = new ListNode(val, this.left.next);
        this.left.next = newHead;
        this.length++;
    }
    addAtTail(val: number): void {
        const newTail = new ListNode(val, null);
        let cur = this.left;
        while(cur.next) {
            cur = cur.next;
        }
        cur.next = newTail;
        this.length++;
    }
    addAtIndex(index: number, val: number): void {
        if (index > this.length || index < 0) {
            return;
        }
        let cur = this.left;
        for(let i=0;i<index;i++) {
            cur = cur.next!;
        }
        const newNode = new ListNode(val, cur.next);
        cur.next = newNode;
        this.length++;
    }
    deleteAtIndex(index: number): void {
        if (index >= this.length || index < 0) {
            return;
        }
        let cur = this.left;
        for(let i=0;i<index;i++) {
            cur = cur.next!;
        }
        cur.next = cur.next!.next;
        this.length--;
    }
}

function test() {
    let l: MyLinkedList = new MyLinkedList();
    for (let i=0;i<10;i++) {
        l.addAtTail(i);
    }
    for (let i=0;i<5;i++) {
        l.deleteAtIndex(i);
    }
}

test();
