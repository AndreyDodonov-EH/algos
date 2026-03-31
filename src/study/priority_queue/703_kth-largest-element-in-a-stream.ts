import { MinPriorityQueue } from "@datastructures-js/priority-queue"

class KthLargest {
    k: number;
    q: MinPriorityQueue<number>;
    constructor(k: number, nums: number[]) {
        this.k = k;
        nums.sort((a,b)=>(b-a));
        nums.length = Math.min(nums.length, k);
        this.q = MinPriorityQueue.fromArray(nums);
    }

    add(val: number): number | null {
        if (this.q.size() < this.k) {
            this.q.push(val);
            if (this.q.size() < this.k)
                return null;
            else return this.q.front();
        }
        if (this.q.size() < this.k) {
            return null;
        }
        const lowest: number = this.q.front()!;
        if (val < lowest) return lowest;
        this.q.push(val);
        this.q.pop();
        return this.q.front()!;
    }
}

function test() {
    const c = new KthLargest(1, []);
    console.log(c.add(-3));
    console.log(c.add(-2));
    console.log(c.add(-4));
    console.log(c.add(0));
    console.log(c.add(4));
}

test();