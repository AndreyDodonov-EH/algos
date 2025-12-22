// Test harness for Float64Array based introsorts

export type IntrosortTypedFn = (A: Float64Array) => void;

function areEqual(a: Float64Array, b: Float64Array): boolean {
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

export function validate(introsort: IntrosortTypedFn, label: string) {
    console.log(`--- Starting Stress Test (Float64Array) [${label}] ---`);

    // 1. Random Numbers
    const randomArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) randomArr[i] = Math.floor(Math.random() * 10000);
    const controlArr = new Float64Array(randomArr).sort();
    introsort(randomArr);
    console.log("Random Test:", areEqual(randomArr, controlArr) ? "PASS ✅" : "FAIL ❌");

    // 2. Reverse Sorted
    const reverseArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) reverseArr[i] = 1000 - i;
    const controlRev = new Float64Array(reverseArr).sort();
    introsort(reverseArr);
    console.log("Reverse Test:", areEqual(reverseArr, controlRev) ? "PASS ✅" : "FAIL ❌");

    // 3. Many Duplicates
    const dupesArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) dupesArr[i] = Math.floor(Math.random() * 10);
    const controlDupes = new Float64Array(dupesArr).sort();
    introsort(dupesArr);
    console.log("Dupes Test: ", areEqual(dupesArr, controlDupes) ? "PASS ✅" : "FAIL ❌");

    // 4. Already Sorted
    const sortedArr = new Float64Array(1000);
    for (let i = 0; i < 1000; i++) sortedArr[i] = i;
    const controlSorted = new Float64Array(sortedArr).sort();
    introsort(sortedArr);
    console.log("Sorted Test:", areEqual(sortedArr, controlSorted) ? "PASS ✅" : "FAIL ❌");
}

export function benchmark(introsort: IntrosortTypedFn, label: string, size = 5_000_000) {
    console.log(`\n--- 🏁 Benchmarking (N = ${size.toLocaleString()}) Float64Array [${label}] ---`);

    // Fillers
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

        const isCorrect = areEqual(arrIntro, arrNative);

        return {
            "Scenario": test.name,
            "Native (ms)": tNative.toFixed(2),
            "Yours (ms)": tIntro.toFixed(2),
            "Slowdown": `${(tIntro / tNative).toFixed(2)}x`,
            "Valid?": isCorrect ? "✅" : "❌"
        };
    }));
}

export function runAll(introsort: IntrosortTypedFn, label: string) {
    validate(introsort, label);
    benchmark(introsort, label);
}

