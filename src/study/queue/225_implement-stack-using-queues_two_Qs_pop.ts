import { Queue } from "@datastructures-js/queue";

class MyStack {
    constructor() {
        this.q = new Queue();
    }

    private q: Queue<number>;

    push(x: number): void {
        this.q.push(x);
    }

    pop(): number {
        let tmpQ = new Queue<number>();
        let last = -Infinity;
        while(!this.q.isEmpty()) {
            last = this.q.dequeue()!;
            if (!this.q.isEmpty()) {
                tmpQ.push(last);
            }
        }
        this.q = tmpQ;
        return last;
    }

    top(): number {
        let tmpQ = new Queue<number>();
        let last = -Infinity;
        while(!this.q.isEmpty()) {
            last = this.q.dequeue()!;
            tmpQ.push(last);
        }
        this.q = tmpQ;
        return last;
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

