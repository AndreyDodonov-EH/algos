function minimumAbsDifference(arr: number[]): number[][] {
    let min = Infinity;
    let max = -Infinity;
    for (const el of arr) min = Math.min(min, el);
    for (const el of arr) max = Math.max(max, el);
    // create auxilary array
    let positions = new Uint8Array(max-min+1);
    // for each element we write it to index [arr[i] - min]
    for (const el of arr) positions[el - min] = 1;
    console.log(positions)
    // count distances
    let minDiff = Infinity;
    let lastOnePos = 0;
    for (let i=1;i<positions.length;i++) {
        if (positions[i]===0) continue;
        minDiff = Math.min(minDiff, i-lastOnePos);
        console.log(`minDiff: ${minDiff}`)
        lastOnePos = i;
    }
    let ans = [];
    lastOnePos=0;
    for (let i=1;i<positions.length;i++) {
        if (positions[i]===0) continue;
        if ((i-lastOnePos) === minDiff) {
            ans.push([lastOnePos+min,i+min]);
        }
        lastOnePos=i;
    }
    return ans;
};

function test() {
    const arr = [4,2,1,3];
    const ans = minimumAbsDifference(arr);
    console.log(ans);
}

test();
