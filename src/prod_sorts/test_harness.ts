// Unified test harness for both number[] and Float64Array based introsorts

export type NumericArray = number[] | Float64Array;
export type IntrosortFn = (A: NumericArray) => void;
export type IntrosortTypedFn = (A: Float64Array) => void;
export type IntrosortArrayFn = (A: number[]) => void;

function areEqual(a: NumericArray, b: NumericArray): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function measureTime(task: () => void): number {
    const start = performance.now();
    task();
    const end = performance.now();
    return end - start;
}

// --- number[] tests ---

export function validateArray(introsort: IntrosortFn | IntrosortArrayFn, label: string) {
    console.log(`--- Starting Stress Test (number[]) [${label}] ---`);

    const randomArr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000));
    const controlArr = [...randomArr].sort((a, b) => a - b);
    introsort(randomArr);
    console.log("Random Test:", areEqual(randomArr, controlArr) ? "PASS ✅" : "FAIL ❌");

    const reverseArr = Array.from({ length: 1000 }, (_, i) => 1000 - i);
    const controlRev = [...reverseArr].sort((a, b) => a - b);
    introsort(reverseArr);
    console.log("Reverse Test:", areEqual(reverseArr, controlRev) ? "PASS ✅" : "FAIL ❌");

    const dupesArr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10));
    const controlDupes = [...dupesArr].sort((a, b) => a - b);
    introsort(dupesArr);
    console.log("Dupes Test: ", areEqual(dupesArr, controlDupes) ? "PASS ✅" : "FAIL ❌");
}

export function benchmarkArray(introsort: IntrosortFn | IntrosortArrayFn, label: string, size = 1_000_000) {
    console.log(`\n--- 🏁 Benchmarking (N = ${size.toLocaleString()}) number[] [${label}] ---`);

    const generateRandom = () => Array.from({ length: size }, () => Math.random() * size);
    const generateReverse = () => Array.from({ length: size }, (_, i) => size - i);
    const generateDupes = () => Array.from({ length: size }, () => Math.floor(Math.random() * 20));

    // Warmup
    introsort(Array.from({ length: 1000 }, () => Math.random()));

    const tests = [
        { name: "Random Data", generator: generateRandom },
        { name: "Reverse Sorted", generator: generateReverse },
        { name: "Many Duplicates", generator: generateDupes }
    ];

    console.table(tests.map(test => {
        const arr = test.generator();
        const arrNative = [...arr];
        const arrIntro = [...arr];

        const tNative = measureTime(() => arrNative.sort((a, b) => a - b));
        const tIntro = measureTime(() => introsort(arrIntro));

        return {
            "Scenario": test.name,
            "Native (ms)": tNative.toFixed(2),
            "Yours (ms)": tIntro.toFixed(2),
            "Slowdown": `${(tIntro / tNative).toFixed(2)}x`,
            "Valid?": areEqual(arrIntro, arrNative) ? "✅" : "❌"
        };
    }));
}

// --- Float64Array tests ---

export function validateTyped(introsort: IntrosortFn | IntrosortTypedFn, label: string) {
    console.log(`\n--- Starting Stress Test (Float64Array) [${label}] ---`);

    const randomArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) randomArr[i] = Math.floor(Math.random() * 10000);
    const controlArr = new Float64Array(randomArr).sort();
    introsort(randomArr);
    console.log("Random Test:", areEqual(randomArr, controlArr) ? "PASS ✅" : "FAIL ❌");

    const reverseArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) reverseArr[i] = 1000 - i;
    const controlRev = new Float64Array(reverseArr).sort();
    introsort(reverseArr);
    console.log("Reverse Test:", areEqual(reverseArr, controlRev) ? "PASS ✅" : "FAIL ❌");

    const dupesArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) dupesArr[i] = Math.floor(Math.random() * 10);
    const controlDupes = new Float64Array(dupesArr).sort();
    introsort(dupesArr);
    console.log("Dupes Test: ", areEqual(dupesArr, controlDupes) ? "PASS ✅" : "FAIL ❌");

    const sortedArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) sortedArr[i] = i;
    const controlSorted = new Float64Array(sortedArr).sort();
    introsort(sortedArr);
    console.log("Sorted Test:", areEqual(sortedArr, controlSorted) ? "PASS ✅" : "FAIL ❌");
}

export function benchmarkTyped(introsort: IntrosortFn | IntrosortTypedFn, label: string, size = 1_000_000) {
    console.log(`\n--- 🏁 Benchmarking (N = ${size.toLocaleString()}) Float64Array [${label}] ---`);

    const fillRandom = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * size; };
    const fillReverse = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = size - i; };
    const fillDupes = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 20); };
    const fillSorted = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i; };

    // Warmup
    const warmup = new Float64Array(1000);
    fillRandom(warmup);
    introsort(warmup);

    const tests = [
        { name: "Random Data", filler: fillRandom },
        { name: "Reverse Sorted", filler: fillReverse },
        { name: "Many Duplicates", filler: fillDupes },
        { name: "Already Sorted", filler: fillSorted }
    ];

    console.table(tests.map(test => {
        const arrNative = new Float64Array(size);
        test.filler(arrNative);
        const arrIntro = new Float64Array(arrNative);

        const tNative = measureTime(() => arrNative.sort());
        const tIntro = measureTime(() => introsort(arrIntro));

        return {
            "Scenario": test.name,
            "Native (ms)": tNative.toFixed(2),
            "Yours (ms)": tIntro.toFixed(2),
            "Slowdown": `${(tIntro / tNative).toFixed(2)}x`,
            "Valid?": areEqual(arrIntro, arrNative) ? "✅" : "❌"
        };
    }));
}

// --- Combined runners ---

export function runAll(introsort: IntrosortFn, label: string) {
    validateArray(introsort, label);
    benchmarkArray(introsort, label);
    validateTyped(introsort, label);
    benchmarkTyped(introsort, label);
}

export function runValidateOnly(introsort: IntrosortFn, label: string) {
    validateArray(introsort, label);
    validateTyped(introsort, label);
}

export function runBenchmarkOnly(introsort: IntrosortFn, label: string) {
    benchmarkArray(introsort, label);
    benchmarkTyped(introsort, label);
}
