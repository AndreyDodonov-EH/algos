function minimumAbsDifference(arr: number[]): number[][] {
    // 1. sort
    arr.sort((a,b)=>a-b);
    // 2. find minimum difference
    let minDiff = Infinity;

    for (let i=1;i<arr.length;i++) {
        minDiff = Math.min(minDiff, arr[i] - arr[i-1]);
    }
    let ans = [];
    for (let i=1; i<arr.length;i++) {
        if (arr[i]-arr[i-1] === minDiff) {
            ans.push([arr[i-1],arr[i]]);
        }
    }
    return ans;
};

function test() {
    const arr = [4,2,1,3];
    const ans = minimumAbsDifference(arr);
    console.log(ans);
}

test();
