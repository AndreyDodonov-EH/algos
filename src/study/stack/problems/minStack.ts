class MinStack_A {
    constructor() {
        this.stack = new Array<number>;
        this.minStack = new Array<number>;
    }
    public stack: Array<number>;
    public minStack: Array<number>;
    push(val: number): void {
        this.stack.push(val);
        if (val <= this.minStack[this.minStack.length-1] || this.minStack.length === 0) {
            this.minStack.push(val);
        }        
    }
    pop(): void {
        const val = this.stack.pop();
        if (val === this.minStack[this.minStack.length-1]) {
            this.minStack.pop();
        }
    }
    top(): number {
        return this.stack[this.stack.length-1];
    }
    getMin(): number {
        return this.minStack[this.minStack.length-1];
    }
}

class MinStack_B {
    constructor() {
        this.stack = new Array<number>;
        this.min = 0;
    }
    public stack: Array<number>;
    public min: number;

    push(val: number): void {
        if ( this.stack.length === 0) {
            this.stack.push(0);
            this.min = val;
        } else {
            const diff = val - this.min;
            this.stack.push(diff);
            if (diff < 0) {
                this.min = val;
            }
        }
    }
    pop(): void {
        if (this.stack.length === 0) {
            return;
        }
        const diff = this.stack.pop()!;
        if (diff < 0) { // we need to update the min
            this.min = this.min - diff;
        }
    }
    top(): number {
        const diff = this.stack[this.stack.length-1];
        if (diff < 0) {
            return this.min;
        }
        return diff + this.min;
    }
    getMin(): number {
        return this.min;
    }
}
