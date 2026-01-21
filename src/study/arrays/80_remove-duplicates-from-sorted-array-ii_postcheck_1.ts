
// post-check if we got two same elements
function removeDuplicates(nums: number[]): number {
    let totalCount=1;
    let i = 1;
    while (i<nums.length) { // we go through the array
        nums[totalCount++] = nums[i++]; //and copy elements starting with second one
        if (nums[totalCount-1] === nums[totalCount-2]) { // if we got two same in the target array, 
            while(i<nums.length && nums[i] === nums[totalCount-1]) i++; // we keep skipping
        }
    }
    return totalCount;
};

function test() {
    let A = [0,0,1,1,1,1,2,3,3];
    const cnt = removeDuplicates(A);
    console.log(cnt);
    console.log(A);
}

test();
