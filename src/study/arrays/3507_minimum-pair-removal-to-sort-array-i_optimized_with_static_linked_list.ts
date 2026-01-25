class StaticLinkedList {
    constructor(nums: number[]) {
        this.nums = nums;
        this.prev = new Uint16Array(nums.length+1);
        for (let i = nums.length; i >= 0; i--) {
            this.prev[i] = i-1;
        }
    }
    p(i: number): number {
        return this.prev[i];
    }
    pp(i: number): number {
        return this.prev[this.prev[i]];
    }

    removePrev(i: number) {
        this.prev[i] = this.pp(i);
    }
    isSorted(): boolean {
        for (let i = this.nums.length; i > 1;) {
            if (this.nums[this.p(i)] < this.nums[this.pp(i)]) return false;
            i = this.p(i);
        }
        return true;
    }
    print() {
        let s = "";
        for (let i = this.nums.length; i > 0;) {
            s = this.nums[this.p(i)] + " " + s;
            i = this.p(i);
        }
        console.log(s);
    }

    private prev: Uint16Array;
    private nums: number[];
}

function minimumPairRemoval(nums: number[]): number {
    let opCnt = 0;
    let idx = 0;
    const al = new StaticLinkedList(nums);
    while (!al.isSorted()) {
        let minSum = Infinity;
        let crtSum = 0;
        for (let i = nums.length; i > 1;) {
            crtSum = nums[al.p(i)] + nums[al.pp(i)];
            if (crtSum <= minSum) {
                minSum = crtSum;
                idx = al.p(i);
            }
            i = al.p(i);
        }
        opCnt++;
        nums[idx] = minSum;
        al.removePrev(idx);
    }
    return opCnt;
};
