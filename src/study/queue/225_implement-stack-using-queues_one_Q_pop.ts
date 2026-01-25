import { Queue } from "@datastructures-js/queue";

class MyStack {
    private q: Queue<number>;

    constructor() {
        this.q = new Queue();
    }

    push(x: number): void {
        this.q.push(x);
    }

    pop(): number {
        const size = this.q.size();
        for (let i = 0; i < size - 1; i++) {
            this.q.enqueue(this.q.dequeue()!);
        }
        return this.q.dequeue()!;
    }

    top(): number {
        const size = this.q.size();
        let lastVal = -Infinity;
        for (let i = 0; i < size; i++) {
            lastVal = this.q.dequeue()!;
            this.q.enqueue(lastVal);
        }
        return lastVal;
    }

    empty(): boolean {
        return this.q.isEmpty();
    }
}

function test() {
    let s = new MyStack();
    for (let i=0;i<5;i++) {
        s.push(i);
    }
    console.log(s.top());
    for (let i=0;i<5;i++) {
        console.log(s.pop());
    }

}

test();

