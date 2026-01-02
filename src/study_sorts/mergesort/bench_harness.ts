const SIZE = 100_000;

function randomArray(n: number): number[] {
    return Array.from({ length: n }, () => Math.random() * n);
}

function isSorted(A: number[]): boolean {
    for (let i = 1; i < A.length; i++) if (A[i - 1] > A[i]) return false;
    return true;
}

export function bench_mergesort(fn: (A: number[]) => void, label = "Custom", size = SIZE) {
    console.log(`\n⏱️  Benchmark: ${label} (N = ${size.toLocaleString()})`);

    const scenarios: [string, () => number[]][] = [
        ["Random", () => randomArray(size)],
        ["Reverse", () => Array.from({ length: size }, (_, i) => size - i)],
        ["Sorted", () => Array.from({ length: size }, (_, i) => i)],
        ["Duplicates", () => Array.from({ length: size }, () => (Math.random() * 20) | 0)],
    ];

    // warmup
    const w = randomArray(1000); fn(w);

    for (const [name, gen] of scenarios) {
        const arr = gen();
        const copy = [...arr];

        const t0 = performance.now();
        fn(arr);
        const tCustom = performance.now() - t0;

        const t1 = performance.now();
        copy.sort((a, b) => a - b);
        const tNative = performance.now() - t1;

        const ok = isSorted(arr) ? "✅" : "❌";
        const ratio = (tCustom / tNative).toFixed(2);
        console.log(`  ${name.padEnd(10)} ${tCustom.toFixed(1).padStart(7)}ms  (${ratio}x native) ${ok}`);
    }
}

