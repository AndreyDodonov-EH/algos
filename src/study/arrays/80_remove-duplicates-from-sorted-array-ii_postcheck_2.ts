// post-check if did not get third same element
function removeDuplicates(nums: number[]): number {
    let totalCount = 2;
    for (let i=2;i<nums.length;i++) {
        nums[totalCount] = nums[i];
        if (nums[i] !== nums[totalCount-2]) totalCount++;
    }
    return totalCount;
}


function test() {
    let A = [0,0,1,1,1,1,2,3,3];
    const cnt = removeDuplicates(A);
    console.log(cnt);
    console.log(A);
}

test();
