class QNode {
    constructor(public val: number, public next:QNode = this, public prev:QNode = this) {}
}

class MyCircularDeque {
    constructor(k: number) {
        this.sentinel = new QNode(42);
        this.capacity = k;
        this.size = 0;
    }

    private sentinel: QNode;
    public capacity: number;
    public size: number;

    insertFront(value: number): boolean {
        if (this.size === this.capacity) {
            return false;
        }
        const node = new QNode(value, this.sentinel.next, this.sentinel);
        this.sentinel.next.prev = node;
        this.sentinel.next = node;
        this.size++;
        return true;
    }

    insertLast(value: number): boolean {
        if (this.size === this.capacity) {
            return false;
        }
        const node = new QNode(value, this.sentinel, this.sentinel.prev);
        this.sentinel.prev.next = node;
        this.sentinel.prev = node;
        this.size++;
        return true;
    }

    deleteFront(): boolean {
        if (this.size === 0) {
            return false;
        }
        this.sentinel.next.next.prev = this.sentinel;
        this.sentinel.next = this.sentinel.next.next;
        this.size--;
        return true;
    }

    deleteLast(): boolean {
        if (this.size === 0) {
            return false;
        }
        this.sentinel.prev.prev.next = this.sentinel;
        this.sentinel.prev = this.sentinel.prev.prev;
        this.size--;
        return true;
    }

    getFront(): number {
        if (this.size === 0) {
            return -1;
        }
        return this.sentinel.next.val;
    }

    getRear(): number {
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

export {}
