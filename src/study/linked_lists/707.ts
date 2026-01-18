import { ListNode } from "./_helpers";

// ToDo: copy in both singly and doubly (from my Leetcode solutions)

class MyLinkedList {
    constructor() {
        this.left = new ListNode(0);
        this.right = new ListNode(0);
        this.left.next = this.right;
        this.right.prev = this.left;
        this.length = 0;
    }
    private left: ListNode;
    private right: ListNode;
    private length: number;

    print() {
        let cur = this.left.next;
        for (let i=0;i<this.length;i++) {
            process.stdout.write(`${cur.val} `);
            cur = cur.next;
        }
        console.log();
    }

    get(index: number): number {
        if (index >= this.length || index < 0) {
            return -1;
        }
        let cur;
        if (index < this.length/2) {
            cur = this.left.next;
            for(let i=0;i<index;i++) {
                cur = cur.next;
            }
        } else {
            cur = this.right.prev;
            for(let i=this.length-1;i>index;i--) {
                cur = cur.prev;
            }
        }
        return cur.val;
    }
    addAtHead(val: number): void {
        const newHead = new ListNode(val, this.left.next, this.left);
        this.left.next.prev = newHead;
        this.left.next = newHead;
        this.length++;
    }
    addAtTail(val: number): void {
        const newTail = new ListNode(val, this.right, this.right.prev );
        this.right.prev.next = newTail;
        this.right.prev = newTail;
        this.length++;
    }
    addAtIndex(index: number, val: number): void {
        if (index > this.length || index < 0) {
            return;
        }
        if (index < this.length/2) {
            let cur = this.left;
            for(let i=0;i<index;i++) {
                cur = cur.next;
            }
            const newNode = new ListNode(val, cur.next, cur);
            cur.next.prev = newNode;
            cur.next = newNode;
        } else {
            let cur = this.right;
            for (let i=this.length-1;i>=index;i--) {
                cur = cur.prev;
            }
            const newNode = new ListNode(val, cur, cur.prev);
            cur.prev.next = newNode;
            cur.prev = newNode;
        }

        this.length++;
    }
    deleteAtIndex(index: number): void {
        if (index >= this.length || index < 0) {
            return;
        }
        if (index < this.length/2) {
            let cur = this.left;
            for(let i=0;i<index;i++) {
                cur = cur.next;
            }
            cur.next = cur.next?.next;
            cur.next.prev = cur;

        } else {
            let cur = this.right;
            for (let i=this.length-1;i>index;i--) {
                cur = cur.prev;
            }
            cur.prev = cur.prev?.prev;
            cur.prev.next = cur;
        }
        this.length--;
    }
}
function test() {
    let l: MyLinkedList = new MyLinkedList();
    for (let i=0;i<10;i++) {
        l.addAtTail(i);
    }
    // l.print();
    for (let i=0;i<5;i++) {
        l.deleteAtIndex(l.length-2);
        l.print();
    }
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
