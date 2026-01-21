class MinStack {
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

