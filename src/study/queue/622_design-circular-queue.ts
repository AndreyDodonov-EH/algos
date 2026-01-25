class QNode {
    constructor(public val: number, public next:QNode = this, public prev:QNode = this) {}
}

class MyCircularQueue {
    constructor(k: number) {
        this.sentinel = new QNode(42);
        this.capacity = k;
        this.size = 0;
    }

    private sentinel: QNode;
    public capacity: number;
    public size: number;

    enQueue(value: number): boolean {
        if (this.size === this.capacity) {
            return false;
        }
        const node = new QNode(value, this.sentinel, this.sentinel.prev);
        this.sentinel.prev.next = node;
        this.sentinel.prev = node;
        this.size++;
        return true;
    }

    deQueue(): boolean {
        if (this.size === 0) {
            return false;
        }
        this.sentinel.next.prev = this.sentinel;
        this.sentinel.next = this.sentinel.next.next;
        this.size--;
        return true;
    }

    Front(): number {
        if (this.size === 0) {
            return -1;
        }
        return this.sentinel.next.val;
    }

    Rear(): number {
        if (this.size === 0) {
            return -1;
        }
        return this.sentinel.prev.val;
    }

    isEmpty(): boolean {
        return (this.size === 0);
    }

    isFull(): boolean {
        return (this.size === this.capacity);
    }
}

function test() {
    
}

test();

export {}
