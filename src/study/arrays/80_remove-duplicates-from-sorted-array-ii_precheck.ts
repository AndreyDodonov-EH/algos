// pre-check if we are not about to get third same element
function removeDuplicates(nums: number[]): number {
    let totalCount=2;
    for (let i=2;i<nums.length;i++) {
        if (nums[i] !== nums[totalCount-2]) {
            nums[totalCount++] = nums[i];
        }
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
