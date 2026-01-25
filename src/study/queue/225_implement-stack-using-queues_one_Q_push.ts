import { Queue } from "@datastructures-js/queue";

class MyStack {
    constructor() {
        this.q = new Queue();
    }

    private q: Queue<number>;

    push(x: number): void {
        let oldSize = this.q.size();
        this.q.push(x);
        for (let i=0;i<oldSize;i++) {
            this.q.push(this.q.dequeue()!);
        }
    }

    pop(): number {
        return this.q.dequeue()!;
    }

    top(): number {
        return this.q.front()!;        
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

