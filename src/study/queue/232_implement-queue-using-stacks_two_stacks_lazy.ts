import { Stack } from "@datastructures-js/stack"

class MyQueue {
    constructor() {
        this.s = new Stack<number>();
        this.outS = new Stack<number>();
    }

    private s: Stack<number>;
    private outS: Stack<number>;

    push(x: number): void {
        this.s.push(x);
    }

    pop(): number {
        this.pourOverIfNeeded();
        return this.outS.pop()!;
    }

    peek(): number {
        this.pourOverIfNeeded();
        return this.outS.peek()!;
    }

    private pourOverIfNeeded() {
        if (this.outS.isEmpty()) {
            while (!this.s.isEmpty()) {
                this.outS.push(this.s.pop()!);
            }
        }
    }

    empty(): boolean {
        return this.s.isEmpty() && this.outS.isEmpty();
    }
}
function test() {
    let q = new MyQueue();
    for (let i = 0; i < 5; i++) {
        q.push(i);
    }
    console.log(q.peek());
    for (let i = 0; i < 5; i++) {
        console.log(q.pop());
    }

}

test();

