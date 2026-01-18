// https://leetcode.com/problems/daily-temperatures/

// track days which are still waiting for a warmer day
// (monotonically non-ascending stack)
function dailyTemperatures(ts: number[]): number[] {
    let daysToWait: number[] = new Array(ts.length).fill(0);
    let waiters: number[] = [];
    for (let i = 0; i < ts.length; i++) {
        while (waiters.length > 0 && ts[waiters.at(-1)!] < ts[i]) {
            const gotIt = waiters.pop()!;
            daysToWait[gotIt] = i-gotIt;
        }
        waiters.push(i);
    }
    return daysToWait;
}

function test() {
    const temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
    const waits = dailyTemperatures(temperatures);
    console.log(waits);
}

test();
