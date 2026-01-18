import { kMaxLength } from "buffer";
import { ListNode } from "./_helpers";

class MyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    private head: ListNode | null;
    private tail: ListNode | null;
    private length: number;

    print() {
        let cur = this.head;
        while (cur) {
            process.stdout.write(`${cur.val} `);
            cur = cur.next;
        }
        console.log();
    }

    get(index: number): number {
        if (index >= this.length || index < 0) {
            return -1;
        }
        let cur = this.head;
        for(let i=0;i<index;i++) {
            cur = cur.next;
        }
        return cur.val;
    }
    addAtHead(val: number): void {
        const newHead = new ListNode(val, this.head);
        this.head = newHead;
        this.length++;
    }
    addAtTail(val: number): void {
        const newTail = new ListNode(val, null);
        if (this.tail === null) {
            this.head = newTail;
            this.tail = newTail;
        } else {
            this.tail.next = newTail;
        }
        this.length++;
    }
    addAtIndex(index: number, val: number): void {
        if (index > this.length) {
            return;
        }
        if (index === 0) {
            this.addAtHead(val);
            return;
        }
        if (index === this.length) {
            this.addAtTail(val);
            return;
        }
        let cur = this.head;
        for(let i=0;i<index;i++) {
            cur = cur.next;
        }
        const newNode = new ListNode(val, cur.next);
        cur.next = newNode;
    }
    deleteAtIndex(index: number): void {
        // if (index >= length || index < 0) {
        //     return;
        // }
        // if (index == 0) {

        // }
        // let cur = this.head;
        // for (let i=1;i<index;i++) {
        //     cur = cur.next;
        // }
    }
}
function test() {
    let l: MyLinkedList = new MyLinkedList();
    for (let i=0;i<5;i++) {
        l.addAtIndex(i,i);
    }
    l.print();
}

test();

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * var obj = new MyLinkedList()
 * var param_1 = obj.get(index)
 * obj.addAtHead(val)
 * obj.addAtTail(val)
 * obj.addAtIndex(index,val)
 * obj.deleteAtIndex(index)
 */
