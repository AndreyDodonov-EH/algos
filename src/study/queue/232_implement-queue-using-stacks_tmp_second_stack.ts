import { Stack } from "@datastructures-js/stack"

class MyQueue {
    constructor() {
        this.s = new Stack<number>();
    }

    private s: Stack<number>;

    push(x: number): void {
        this.s.push(x);
    }

    pop(): number {
        let tmpS = new Stack<number>();
        let first = -Infinity;
        while(!this.s.isEmpty()) {
            first = this.s.pop()!;
            if (!this.s.isEmpty()) {
                tmpS.push(first)!;
            }
        }
        let newFirst = -Infinity;
        while(!tmpS.isEmpty()) {
            newFirst = tmpS.pop()!;
            this.s.push(newFirst);
        }
        return first;
    }

    peek(): number {
        let tmpS = new Stack<number>();
        let first = -Infinity;
        while(!this.s.isEmpty()) {
            first = this.s.pop()!;
            tmpS.push(first)!;
        }
        let newFirst = -Infinity;
        while(!tmpS.isEmpty()) {
            newFirst = tmpS.pop()!;
            this.s.push(newFirst);
        }
        return first;
    }

    empty(): boolean {
        return this.s.isEmpty();
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

