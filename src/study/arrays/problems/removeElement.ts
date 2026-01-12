// Neetcode 150

function swap(nums: number[], i: number, j: number) {
    const tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = nums[i];
}

function removeElement(nums: number[], val: number) {
    let k = nums.length;
    for (let i=0;i<k;){
        if (nums[i] == val) {
            k--;
            [nums[i],nums[k]] = [nums[k],nums[i]];
        } else {
            i++;
        }
    }
    return k;
}

function test() {
    let A = [1,1,2,3,4]
    const k = removeElement(A,1);
    console.log(k);
    console.log(A.slice(0,k));
}

test();
