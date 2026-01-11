function getConcatenation(nums: number[]) {
    const t = 2;
    let ans = new Array(t*nums.length);
    for (let i=0;i<t;i++) {
        const start = i*nums.length;
        const end = start + nums.length;
        for (let j=start;j<end;j++) {
            ans[j] = nums[j-start];
        }
    }
    return ans;
}

function test() {
    const A = [1,2,3,4];
    const B = getConcatenation(A);
    console.log(B);
}

test();

