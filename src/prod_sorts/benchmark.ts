/**
 * Shared benchmark utility for sorting algorithms
 * Separate functions for Float64Array and number[] to avoid polymorphic deoptimization
 */

export type SortFnTyped = (A: Float64Array) => void;
export type SortFnTypedCmp = (A: Float64Array, cmp: (a: number, b: number) => number) => void;
export type SortFnArray = (A: number[]) => void;

const BENCH_SIZE = 1_000_000;

// --- Float64Array Benchmark ---

const numericCmp = (a: number, b: number) => a - b;

function areEqualTyped(a: Float64Array, b: Float64Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function measureTime(task: () => void): number {
    const start = performance.now();
    task();
    return performance.now() - start;
}

export function benchmark(sortFn: SortFnTyped, label: string, size: number = BENCH_SIZE) {
    console.log(`--- 🏁 Benchmarking ${label} [Float64Array] (N = ${size.toLocaleString()}) ---`);

    const fillRandom = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * size; };
    const fillReverse = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = size - i; };
    const fillDupes = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 20); };
    const fillSorted = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i; };
    const fillPipeOrgan = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i < size / 2 ? i : size - i; };
    const fillSawtooth = (arr: Float64Array) => { 
        const period = Math.max(1, arr.length / 10 | 0);
        for (let i = 0; i < arr.length; i++) arr[i] = i % period; 
    };
    const fillStaircase = (arr: Float64Array) => { 
        const step = Math.max(1, arr.length / 10 | 0);
        for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(i / step) * step; 
    };
    const fillNearlySorted = (arr: Float64Array) => {
        for (let i = 0; i < arr.length; i++) arr[i] = i;
        for (let i = 0; i < arr.length / 1000; i++) {
            const a = Math.floor(Math.random() * arr.length);
            const b = Math.floor(Math.random() * arr.length);
            const tmp = arr[a]; arr[a] = arr[b]; arr[b] = tmp;
        }
    };

    // Warmup
    const warmup = new Float64Array(1000);
    fillRandom(warmup);
    sortFn(warmup);

    const tests = [
        { name: "Random Data", filler: fillRandom },
        { name: "Reverse Sorted", filler: fillReverse },
        { name: "Many Duplicates", filler: fillDupes },
        { name: "Already Sorted", filler: fillSorted },
        { name: "Pipe Organ", filler: fillPipeOrgan },
        { name: "Sawtooth", filler: fillSawtooth },
        { name: "Staircase", filler: fillStaircase },
        { name: "Nearly Sorted", filler: fillNearlySorted }
    ];

    console.table(tests.map(test => {
        const arrNative = new Float64Array(size);
        test.filler(arrNative);
        const arrNativeCmp = new Float64Array(arrNative);
        const arrTest = new Float64Array(arrNative);

        const tNative = measureTime(() => arrNative.sort());
        const tNativeCmp = measureTime(() => arrNativeCmp.sort(numericCmp));
        const tTest = measureTime(() => sortFn(arrTest));

        return {
            "Scenario": test.name,
            "Native (ms)": tNative.toFixed(2),
            "Native+cmp (ms)": tNativeCmp.toFixed(2),
            "Custom (ms)": tTest.toFixed(2),
            "vs Native": `${(tTest / tNative).toFixed(2)}x`,
            "vs Native+cmp": `${(tTest / tNativeCmp).toFixed(2)}x`,
            "OK?": areEqualTyped(arrTest, arrNative) ? "✅" : "❌"
        };
    }));
}

// --- Float64Array with Comparator Benchmark ---

export function benchmarkTypedCmp(sortFn: SortFnTypedCmp, label: string, size: number = BENCH_SIZE) {
    console.log(`--- 🏁 Benchmarking ${label} [Float64Array + comparator] (N = ${size.toLocaleString()}) ---`);

    const fillRandom = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * size; };
    const fillReverse = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = size - i; };
    const fillDupes = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 20); };
    const fillSorted = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i; };
    const fillPipeOrgan = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = i < size / 2 ? i : size - i; };
    const fillSawtooth = (arr: Float64Array) => { 
        const period = Math.max(1, arr.length / 10 | 0);
        for (let i = 0; i < arr.length; i++) arr[i] = i % period; 
    };
    const fillStaircase = (arr: Float64Array) => { 
        const step = Math.max(1, arr.length / 10 | 0);
        for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(i / step) * step; 
    };
    const fillNearlySorted = (arr: Float64Array) => {
        for (let i = 0; i < arr.length; i++) arr[i] = i;
        for (let i = 0; i < arr.length / 1000; i++) {
            const a = Math.floor(Math.random() * arr.length);
            const b = Math.floor(Math.random() * arr.length);
            const tmp = arr[a]; arr[a] = arr[b]; arr[b] = tmp;
        }
    };

    // Warmup
    const warmup = new Float64Array(1000);
    fillRandom(warmup);
    sortFn(warmup, numericCmp);

    const tests = [
        { name: "Random Data", filler: fillRandom },
        { name: "Reverse Sorted", filler: fillReverse },
        { name: "Many Duplicates", filler: fillDupes },
        { name: "Already Sorted", filler: fillSorted },
        { name: "Pipe Organ", filler: fillPipeOrgan },
        { name: "Sawtooth", filler: fillSawtooth },
        { name: "Staircase", filler: fillStaircase },
        { name: "Nearly Sorted", filler: fillNearlySorted }
    ];

    console.table(tests.map(test => {
        const arrNative = new Float64Array(size);
        test.filler(arrNative);
        const arrTest = new Float64Array(arrNative);

        // Native Float64Array.sort() with comparator
        const tNative = measureTime(() => arrNative.sort(numericCmp));
        const tTest = measureTime(() => sortFn(arrTest, numericCmp));

        return {
            "Scenario": test.name,
            "Native+cmp (ms)": tNative.toFixed(2),
            "Custom (ms)": tTest.toFixed(2),
            "vs Native+cmp": `${(tTest / tNative).toFixed(2)}x`,
            "Valid?": areEqualTyped(arrTest, arrNative) ? "✅" : "❌"
        };
    }));
}

// --- number[] Benchmark ---

function areEqualArray(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export function benchmarkArray(sortFn: SortFnArray, label: string, size: number = BENCH_SIZE) {
    console.log(`--- 🏁 Benchmarking ${label} [number[]] (N = ${size.toLocaleString()}) ---`);

    const generateRandom = () => Array.from({ length: size }, () => Math.random() * size);
    const generateReverse = () => Array.from({ length: size }, (_, i) => size - i);
    const generateDupes = () => Array.from({ length: size }, () => Math.floor(Math.random() * 20));
    const generateSorted = () => Array.from({ length: size }, (_, i) => i);
    const generatePipeOrgan = () => Array.from({ length: size }, (_, i) => i < size / 2 ? i : size - i);
    const generateSawtooth = () => Array.from({ length: size }, (_, i) => i % (size / 10 | 0));
    const generateStaircase = () => Array.from({ length: size }, (_, i) => Math.floor(i / (size / 10 | 0)) * (size / 10 | 0));
    const generateNearlySorted = () => {
        const arr = Array.from({ length: size }, (_, i) => i);
        for (let i = 0; i < size / 1000; i++) {
            const a = Math.floor(Math.random() * size);
            const b = Math.floor(Math.random() * size);
            [arr[a], arr[b]] = [arr[b], arr[a]];
        }
        return arr;
    };

    // Warmup
    const warmup = Array.from({ length: 1000 }, () => Math.random());
    sortFn(warmup);

    const tests = [
        { name: "Random Data", generator: generateRandom },
        { name: "Reverse Sorted", generator: generateReverse },
        { name: "Many Duplicates", generator: generateDupes },
        { name: "Already Sorted", generator: generateSorted },
        { name: "Pipe Organ", generator: generatePipeOrgan },
        { name: "Sawtooth", generator: generateSawtooth },
        { name: "Staircase", generator: generateStaircase },
        { name: "Nearly Sorted", generator: generateNearlySorted }
    ];

    console.table(tests.map(test => {
        const arr = test.generator();
        const arrNative = [...arr];
        const arrTest = [...arr];

        const tNative = measureTime(() => arrNative.sort((a, b) => a - b));
        const tTest = measureTime(() => sortFn(arrTest));

        return {
            "Scenario": test.name,
            "Native+cmp (ms)": tNative.toFixed(2),
            "Custom (ms)": tTest.toFixed(2),
            "vs Native+cmp": `${(tTest / tNative).toFixed(2)}x`,
            "Valid?": areEqualArray(arrTest, arrNative) ? "✅" : "❌"
        };
    }));
}
