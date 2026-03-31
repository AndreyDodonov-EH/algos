function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number,number>();
    for (let i=0; i<nums.length; i++) {
        if (!map.has(nums[i])) {
            map.set(nums[i], 1);
        } else {
            map.set(nums[i], (map.get(nums[i])!+1));
        }
    }
    for (let i=0; i<nums.length; i++) {
        const expected = target - nums[i];
        const val = map.get(expected);
        if (!val) continue;
        if (val === 1 && nums[i] === expected) continue;
        return [i,nums.lastIndexOf(expected)];
    }
    return [0,0];
}

function test() {
    const nums = [3,2,4];
    const res = twoSum(nums, 6);
    console.log(res);
}

test();