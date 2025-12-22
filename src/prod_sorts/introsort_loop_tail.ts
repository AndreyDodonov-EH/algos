namespace introsort_loop_tail {

    // Helper: Manual swap is often faster than destructuring on TypedArrays in some engines
    function swap(A: number[], i: number, j: number) {
        const tmp = A[i];
        A[i] = A[j];
        A[j] = tmp;
    }

    function insertionsort_shift_while(A: number[], p: number, r: number) {
        for (let i = p + 1; i <= r; i++) {
            const current = A[i];
            let j = i - 1;
            while (j >= p && A[j] > current) {
                A[j + 1] = A[j];
                j--;
            }
            A[j + 1] = current;
        }
    }

    function partition_sedgewick(A: number[], p: number, r: number): [number, number] {
        const m = Math.floor((p + r) / 2);
        swap(A, m, r);

        let x = A[r];
        let i = p;
        let j = r - 1;
        while (true) {
            // Note: In tight loops on TypedArrays, direct access is very fast
            while (A[i] < x) i++;
            while (j > i && A[j] > x) {
                j--;
            }
            if (i >= j) {
                break;
            }
            swap(A, i, j);
            i++; j--;
        }
        swap(A, i, r);
        return [i, j];
    }

    function _floatDown(A: number[], p: number, r: number, i: number) {
        const firstChildIdx = p + Math.floor((r - p + 1) / 2);
        while (i < firstChildIdx) {
            let idxOfBest = i;
            const idxOfLeft = 2 * i - p + 1;

            // Bounds check removed for speed, logic ensures safety inside loop limits
            if (A[idxOfLeft] > A[idxOfBest]) {
                idxOfBest = idxOfLeft;
            }

            const idxOfRight = idxOfLeft + 1;
            if (idxOfRight <= r &&
                (A[idxOfRight] > A[idxOfBest])) {
                idxOfBest = idxOfRight;
            }

            if (idxOfBest === i) {
                break;
            } else {
                swap(A, i, idxOfBest);
                i = idxOfBest;
            }
        }
    }

    function _buildMaxHeap(A: number[], p: number, r: number) {
        const lastParentIdx = p + Math.floor((r - p + 1) / 2) - 1;
        for (let i = lastParentIdx; i >= p; i--) {
            _floatDown(A, p, r, i);
        }
    }

    function heapsort(A: number[], p: number, r: number) {
        _buildMaxHeap(A, p, r);
        for (let i = r; i > p; i--) {
            swap(A, p, i);
            _floatDown(A, p, i - 1, p);
        }
    }

    function _introsortLoop(A: number[], p: number, r: number, currentDepth: number, maxDepth: number, insertionSortLimit = 16) {
        // Loop optimization: Turn tail recursion into a while loop to save stack frames
        while (r - p > 0) {
            const n = r - p + 1;

            if (n <= insertionSortLimit) {
                insertionsort_shift_while(A, p, r);
                return;
            }

            if (currentDepth > maxDepth) {
                heapsort(A, p, r);
                return;
            }

            const pivots = partition_sedgewick(A, p, r);

            // Recurse on the smaller partition, loop on the larger (tail call elimination simulation)
            // Left partition: p to pivots[0] - 1
            // Right partition: pivots[0] + 1 to r
            const leftLen = (pivots[0] - 1) - p;
            const rightLen = r - (pivots[0] + 1);

            currentDepth++;

            if (leftLen < rightLen) {
                _introsortLoop(A, p, pivots[0] - 1, currentDepth, maxDepth, insertionSortLimit);
                p = pivots[0] + 1; // Update 'p' to process the right side in next loop iteration
            } else {
                _introsortLoop(A, pivots[0] + 1, r, currentDepth, maxDepth, insertionSortLimit);
                r = pivots[0] - 1; // Update 'r' to process the left side in next loop iteration
            }
        }
    }

    export function introsort(A: number[]) {
        if (A.length < 2) return;
        const maxDepth = 2 * Math.floor(Math.log2(A.length));
        const insertionSortLimit = 16;
        _introsortLoop(A, 0, A.length - 1, 0, maxDepth, insertionSortLimit);
    }

    // --- Validation & Testing ---

    function validateIntrosort() {
        console.log("--- Starting Stress Test (number[]) ---");

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

    function measureTime(label: string, task: () => void): number {
        const start = performance.now();
        task();
        const end = performance.now();
        return end - start;
    }

    function runBenchmark() {
        const SIZE = 5_000_000; // Same size as Float64Array version for comparison
        console.log(`\n--- 🏁 Benchmarking (N = ${SIZE.toLocaleString()}) number[] ---`);

        // Generators
        const generateRandom = () => Array.from({ length: SIZE }, () => Math.random() * SIZE);
        const generateReverse = () => Array.from({ length: SIZE }, (_, i) => SIZE - i);
        const generateDupes = () => Array.from({ length: SIZE }, () => Math.floor(Math.random() * 20));

        // Warmup
        const warmup = Array.from({ length: 1000 }, () => Math.random());
        introsort(warmup);

        const tests = [
            { name: "Random Data", generator: generateRandom },
            { name: "Reverse Sorted", generator: generateReverse },
            { name: "Many Duplicates", generator: generateDupes }
        ];

        console.table(tests.map(test => {
            // Generate data
            const arr = test.generator();

            // Copy for both sorts
            const arrNative = [...arr];
            const arrIntro = [...arr];

            // Run Native Sort (requires comparator for numeric sort)
            const tNative = measureTime("Native", () => arrNative.sort((a, b) => a - b));

            // Run Your Introsort
            const tIntro = measureTime("Introsort", () => introsort(arrIntro));

            // Validation
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

    validateIntrosort();
    runBenchmark();
}
