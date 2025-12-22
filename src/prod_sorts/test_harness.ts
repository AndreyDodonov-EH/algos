// Unified test harness for both number[] and Float64Array based introsorts

export type NumericArray = number[] | Float64Array;
export type IntrosortFn = (A: NumericArray) => void;

const BENCH_SIZE = 1_000_000;

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

export function validateArray(introsort: IntrosortFn, label: string) {
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

    const pipeOrganArr = Array.from({ length: 1000 }, (_, i) => i < 500 ? i : 1000 - i);
    const controlPipeOrgan = [...pipeOrganArr].sort((a, b) => a - b);
    introsort(pipeOrganArr);
    console.log("Pipe Organ Test:", areEqual(pipeOrganArr, controlPipeOrgan) ? "PASS ✅" : "FAIL ❌");
}

export function benchmarkArray(introsort: IntrosortFn, label: string, size: number) {
    console.log(`--- 🏁 Benchmarking (N = ${size.toLocaleString()}) number[] [${label}] ---`);

    const generateRandom = () => Array.from({ length: size }, () => Math.random() * size);
    const generateReverse = () => Array.from({ length: size }, (_, i) => size - i);
    const generateDupes = () => Array.from({ length: size }, () => Math.floor(Math.random() * 20));
    const generatePipeOrgan = () => Array.from({ length: size }, (_, i) => i < size / 2 ? i : size - i);

    // Warmup
    introsort(Array.from({ length: 1000 }, () => Math.random()));

    const tests = [
        { name: "Random Data", generator: generateRandom },
        { name: "Reverse Sorted", generator: generateReverse },
        { name: "Many Duplicates", generator: generateDupes },
        { name: "Pipe Organ", generator: generatePipeOrgan }
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

export function validateTyped(introsort: IntrosortFn, label: string) {
    console.log(`--- Starting Stress Test (Float64Array) [${label}] ---`);

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

    const pipeOrganArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) pipeOrganArr[i] = i < 500 ? i : 1000 - i;
    const controlPipeOrgan = new Float64Array(pipeOrganArr).sort();
    introsort(pipeOrganArr);
    console.log("Pipe Organ Test:", areEqual(pipeOrganArr, controlPipeOrgan) ? "PASS ✅" : "FAIL ❌");
}

export function benchmarkTyped(introsort: IntrosortFn, label: string, size: number) {
    console.log(`--- 🏁 Benchmarking (N = ${size.toLocaleString()}) Float64Array [${label}] ---`);

    const fillRandom = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * size; };
    const fillReverse = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = size - i; };
    const fillDupes = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 20); };
    const fillSorted = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i; };
    const fillPipeOrgan = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i < size / 2 ? i : size - i; };

    // Warmup
    const warmup = new Float64Array(1000);
    fillRandom(warmup);
    introsort(warmup);

    const tests = [
        { name: "Random Data", filler: fillRandom },
        { name: "Reverse Sorted", filler: fillReverse },
        { name: "Many Duplicates", filler: fillDupes },
        { name: "Already Sorted", filler: fillSorted },
        { name: "Pipe Organ", filler: fillPipeOrgan }
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

// --- Combined runner ---

export function runAll(introsort: IntrosortFn, label: string) {
    console.log(`\n=== 🔀 POLYMORPHIC (number[] | Float64Array) ===`);
    // NOTE: Running with number[] causes polymorphic deoptimization at runtime!
    // The static type system allows both, but for benchmarking typed arrays
    // we only run Float64Array tests to avoid the performance penalty.
    validateTyped(introsort, label);
    benchmarkTyped(introsort, label, BENCH_SIZE);
}
