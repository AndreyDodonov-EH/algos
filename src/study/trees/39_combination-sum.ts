function combinationSum(candidates: number[],  target: number): number[][] {
    const res: number[][] = [];
    const cur: number[] = [];
    let total = 0;
    function dfs(i: number) {
        if (total > target || i >= candidates.length) {
            return;
        }
        if (total === target) {
            res.push([...cur]);
            return;
        }
        cur.push(candidates[i]);
        total += candidates[i];
        dfs(i);
        // we are not allowed to add this candidate anymore,
        // BUT move on onto the next one
        total -= candidates[i];
        cur.pop();
        dfs(i+1);
    }
    dfs(0);
    return res;
}

function test() {
    const candidates = [2,3,6,7];
    const target = 7;
    const res = combinationSum(candidates, target);
    console.log(res);
}

test();