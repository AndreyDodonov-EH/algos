// function subsets(nums: number[]): number[][] {
//     let subs: number[][] = [];
//     let crt: number[] = [];
//     function traverse(nums: number[], crt: number[], idx: number) {
//         if (idx === nums.length) {
//             subs.push(crt);
//             return;
//         }
//         traverse(nums, [...crt, nums[idx]], idx+1);
//         traverse(nums, crt, idx+1);
//     }
//     traverse(nums, crt, 0);
//     return subs;
// };

function subsets(nums: number[]): number[][] {
    let subs: number[][] = [];
    let crt: number[] = [];
    function traverse(nums: number[], idx: number) {
        if (idx === nums.length) {
            subs.push([...crt]);
            return;
        }
        crt.push(nums[idx]);
        traverse(nums, idx+1);
        crt.pop();
        traverse(nums, idx+1);
    }
    traverse(nums, 0);
    return subs;
};

function test() {
    const nums = [1,2,3];
    const res = subsets(nums);
    console.log(res);
}

test();