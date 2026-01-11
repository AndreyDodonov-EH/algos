// Neetcode 150

function removeDuplicates(nums: number[]) {
    let unique=0;
    for (let i=1;i<nums.length;i++) {
        if (nums[i] !== nums[unique]) {
            nums[++unique] = nums[i];
        }
        console.log(nums);
    }
    return unique+1;
}

function test() {
    let A = [1,1,2,3,4]
    const k = removeDuplicates(A);
    console.log(k);
}

test();
