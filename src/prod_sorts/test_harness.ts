// Test harness for number[] based introsorts

export type IntrosortFn = (A: number[]) => void;

function measureTime(task: () => void): number {
    const start = performance.now();
    task();
    const end = performance.now();
    return end - start;
}

export function validate(introsort: IntrosortFn, label: string) {
    console.log(`--- Starting Stress Test (number[]) [${label}] ---`);

    // 1. Random Numbers
    const randomArr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000));
    const controlArr = [...randomArr].sort((a, b) => a - b);
    introsort(randomArr);
    console.log("Random Test:", JSON.stringify(randomArr) === JSON.stringify(controlArr) ? "PASS ✅" : "FAIL ❌");

    // 2. Reverse Sorted
    const reverseArr = Array.from({ length: 1000 }, (_, i) => 1000 - i);
    const controlRev = [...reverseArr].sort((a, b) => a - b);
    introsort(reverseArr);
    console.log("Reverse Test:", JSON.stringify(reverseArr) === JSON.stringify(controlRev) ? "PASS ✅" : "FAIL ❌");

    // 3. Many Duplicates
    const dupesArr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10));
    const controlDupes = [...dupesArr].sort((a, b) => a - b);
    introsort(dupesArr);
    console.log("Dupes Test: ", JSON.stringify(dupesArr) === JSON.stringify(controlDupes) ? "PASS ✅" : "FAIL ❌");
}

export function benchmark(introsort: IntrosortFn, label: string, size = 5_000_000) {
    console.log(`\n--- 🏁 Benchmarking (N = ${size.toLocaleString()}) number[] [${label}] ---`);

    // Generators
    const generateRandom = () => Array.from({ length: size }, () => Math.random() * size);
    const generateReverse = () => Array.from({ length: size }, (_, i) => size - i);
    const generateDupes = () => Array.from({ length: size }, () => Math.floor(Math.random() * 20));

    // Warmup
    const warmup = Array.from({ length: 1000 }, () => Math.random());
    introsort(warmup);

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

        const isCorrect = JSON.stringify(arrIntro) === JSON.stringify(arrNative);

        return {
            "Scenario": test.name,
            "Native (ms)": tNative.toFixed(2),
            "Yours (ms)": tIntro.toFixed(2),
            "Slowdown": `${(tIntro / tNative).toFixed(2)}x`,
            "Valid?": isCorrect ? "✅" : "❌"
        };
    }));
}

export function runAll(introsort: IntrosortFn, label: string) {
    validate(introsort, label);
    benchmark(introsort, label);
}

