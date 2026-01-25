function isSorted(nums: number[]) {
    for (let i=1;i<nums.length;i++) {
        if (nums[i-1] > nums[i]) return false;
    }
    return true;
}

function minimumPairRemoval(nums: number[]): number {
    let opCnt = 0;
    let idx = -1;
    while (!isSorted(nums)) {
        let minSum = Infinity;
        let crtSum=0;
        for (let i = nums.length - 1; i > 0; i--) {
            crtSum = nums[i] + nums[i - 1];
            if (crtSum <= minSum) {
                minSum = crtSum;
                idx = i;
            }
        }
        opCnt++;
        nums[idx] = minSum;
        // delete nums[idx-1]
        nums.splice(idx-1,1)
    }
    return opCnt;
};
