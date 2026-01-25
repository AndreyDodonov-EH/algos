function isSorted(nums: number[], prev: Map<number, number>): boolean {
    for (let i = nums.length; i > 1;) {
        const prevIdx = prev.get(i)!;
        const prevPrevIdx = prev.get(prevIdx)!;
        if (nums[prevIdx] < nums[prevPrevIdx]) return false;
        i = prevIdx;
    }
    return true;
}

function print(nums: number[], prev: Map<number, number>) {
    let s = "";
    for (let i = nums.length; i > 0;) {
        const prevIdx = prev.get(i)!;
        s = nums[prevIdx] + " " + s;
        i = prevIdx;
    }
    console.log(s); ``
}

function minimumPairRemoval(nums: number[]): number {
    let opCnt = 0;
    let idx = 0;
    let prev = new Map<number, number>();
    for (let i = nums.length; i >= 0; i--) {
        prev.set(i, i - 1);
    }
    while (!isSorted(nums, prev)) {
        let minSum = Infinity;
        let crtSum = 0;
        for (let i = nums.length; i > 1;) {
            const prevIdx = prev.get(i)!;
            const prevPrevIdx = prev.get(prevIdx)!;
            crtSum = nums[prevIdx] + nums[prevPrevIdx];
            if (crtSum <= minSum) {
                minSum = crtSum;
                idx = prevIdx;
            }
            i = prevIdx;
        }
        opCnt++;
        nums[idx] = minSum;
        const prevPrevIdx = prev.get(prev.get(idx)!)!;
        prev.set(idx, prevPrevIdx);
    }
    return opCnt;
};
