// https://leetcode.com/problems/daily-temperatures/

// track days which are still waiting for a warmer day
// (monotonically non-ascending stack)
function dailyTemperatures(ts: number[]): number[] {
    // create array of zeros for the number of days
    let daysToWait: number[] = new Array(ts.length).fill(0);
    // create stack to track days which are still waiting for a warmer day
    let waiters: number[] = [];
    // iterate through the temperatures of the days
    for (let i = 0; i < ts.length; i++) {
        // while there are still days waiting for a warmer day
        // and the temperature of the last day in the stack is less than the temperature of the current day
        while (waiters.length > 0 && ts[waiters.at(-1)!] < ts[i]) {
            // pop the last day from the stack
            const gotIt = waiters.pop()!;
            // set the number of days to wait for the warmer day for the last day in the stack
            // to the difference between the current day and the last day in the stack
            daysToWait[gotIt] = i-gotIt;
        }
        // push the current day onto the stack
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
