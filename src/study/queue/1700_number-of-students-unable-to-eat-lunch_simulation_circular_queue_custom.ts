class Node {
    constructor(public val: number, public next: Node = this, public prev: Node = this) {
    }
}

class cQueue {
    constructor(A: Array<number>=[]) {
        this.sentinel = new Node(0);
        let cur = this.sentinel;
        for (const el of A) {
            const newbie = new Node(el, this.sentinel);
            cur.next = newbie;
            cur = cur.next;
        }
        // lock the circle
        cur.next = this.sentinel;
        this.sentinel.prev = cur;
        this.length = A.length;
    }
    private sentinel: Node;
    public length: number;

    getFront(): number|null {
        if (this.length === 0) {
            return null;
        }
        return this.sentinel.next.val;
    }
    popFront() {
        if (this.length === 0) {
            return null;
        }
        const head = this.sentinel.next;
        this.sentinel.next = head.next;
        this.length--;
        return head.val;
    }
    // move sentinel after the head,
    // i.e. swap sentinel and head
    next() {
        const head = this.sentinel.next;
        const newHead = head.next;
        const tail = this.sentinel.prev;
        tail.next = head;
        head.next = this.sentinel;
        this.sentinel.prev = head;
        this.sentinel.next = newHead;
    }

    print() {
        let cur = this.sentinel.next;
        process.stdout.write("[ ");
        while(cur !== this.sentinel) {
            process.stdout.write(`${cur.val}, `);
            cur = cur.next;
        }
        process.stdout.write("]");
        console.log();
    }
}

function countStudents(students: number[], sandwiches: number[]): number {
    let q = new cQueue(students);
    let i=0;
    let unhappy = 0;
    while(unhappy < q.length) {
        const pref = q.getFront();
        if (pref === sandwiches[i]) {
            q.popFront();
            i++;
            unhappy=0;
        } else {
            q.next();
            unhappy++;
        }
    }
    return unhappy;
};
