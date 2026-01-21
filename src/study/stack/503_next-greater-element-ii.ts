function nextGreaterElements(nums: number[]): number[] {
    let ans: number[] = new Array(nums.length).fill(-1);
    let waiters: number[] = [];
    // track waiters
    for (let i=0;i<nums.length;i++) {
        while (waiters.length > 0 && nums[waiters.at(-1)!] < nums[i]) {
            const idx = waiters.pop();
            ans[idx!] = nums[i];
        }
        waiters.push(i);
    }
    for (let i=0;i<nums.length;i++) {
        while (waiters.length > 0 && nums[waiters.at(-1)!] < nums[i]) {
            const idx = waiters.pop();
            ans[idx!] = nums[i];
        }
    }
    return ans;
};

function test() {
    let A: number[] = [1,2,1];
    const ans = nextGreaterElements(A);
    console.log(ans);
}

test();
