
// post-check if we got two same elements
function removeDuplicates_A(nums: number[]): number {
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

// pre-check if we are not about to get third same element
function removeDuplicates_B(nums: number[]): number {
    let totalCount=2;
    for (let i=2;i<nums.length;i++) {
        if (nums[i] !== nums[totalCount-2]) {
            nums[totalCount++] = nums[i];
        }
    }
    return totalCount;
}

// post-check if did not get third same element
function removeDuplicates_C(nums: number[]): number {
    let totalCount = 2;
    for (let i=2;i<nums.length;i++) {
        nums[totalCount] = nums[i];
        if (nums[i] !== nums[totalCount-2]) totalCount++;
    }
    return totalCount;
}


function test() {
    let A = [0,0,1,1,1,1,2,3,3];
    const cnt = removeDuplicates_C(A);
    console.log(cnt);
    console.log(A);
}

test();
