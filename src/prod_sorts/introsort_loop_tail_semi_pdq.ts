namespace introsort_semi_pdq_typed_loop_tail {

    function swap(A: Float64Array, i: number, j: number) {
        const tmp = A[i];
        A[i] = A[j];
        A[j] = tmp;
    }

    function insertionsort_shift_while(A: Float64Array, p: number, r: number) {
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

    // Check if range [p..r] is sorted ascending
    function isSorted(A: Float64Array, p: number, r: number): boolean {
        for (let i = p; i < r; i++) {
            if (A[i] > A[i + 1]) return false;
        }
        return true;
    }

    function partition_sedgewick(A: Float64Array, p: number, r: number): number {
        const m = Math.floor((p + r) / 2);
        swap(A, m, r);
        
        let x = A[r];
        let i = p;
        let j = r - 1;
        while (true) {
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
        return i;  // Just return pivot position
    }

    function _floatDown(A: Float64Array, p: number, r: number, i: number) {
        const firstChildIdx = p + Math.floor((r - p + 1) / 2);
        while (i < firstChildIdx) {
            let idxOfBest = i;
            const idxOfLeft = 2 * i - p + 1;
            
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

    function _buildMaxHeap(A: Float64Array, p: number, r: number) {
        const lastParentIdx = p + Math.floor((r - p + 1) / 2) - 1;
        for (let i = lastParentIdx; i >= p; i--) {
            _floatDown(A, p, r, i);
        }
    }

    function heapsort(A: Float64Array, p: number, r: number) {
        _buildMaxHeap(A, p, r);
        for (let i = r; i > p; i--) {
            swap(A, p, i);
            _floatDown(A, p, i - 1, p);
        }
    }

    function _introsortLoop(A: Float64Array, p: number, r: number, currentDepth: number, maxDepth: number, insertionSortLimit = 16) {
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

            const pivotIdx = partition_sedgewick(A, p, r);
            
            // PDQSort optimization: detect bad pivot and check if already sorted
            if (pivotIdx === p) {
                // Pivot landed at start - everything else was >= pivot
                // Check if [p+1..r] is already sorted
                if (isSorted(A, p + 1, r)) {
                    return;  // Done! Pivot is smallest, rest is sorted
                }
                // Could add shuffle here to break pattern, but let's keep it simple
            }
            
            if (pivotIdx === r) {
                // Pivot landed at end - everything else was <= pivot
                // Check if [p..r-1] is already sorted
                if (isSorted(A, p, r - 1)) {
                    return;  // Done! Rest is sorted, pivot is largest
                }
            }

            const leftLen = (pivotIdx - 1) - p;
            const rightLen = r - (pivotIdx + 1);

            currentDepth++;

            if (leftLen < rightLen) {
                _introsortLoop(A, p, pivotIdx - 1, currentDepth, maxDepth, insertionSortLimit);
                p = pivotIdx + 1;
            } else {
                _introsortLoop(A, pivotIdx + 1, r, currentDepth, maxDepth, insertionSortLimit);
                r = pivotIdx - 1;
            }
        }
    }

    export function introsort(A: Float64Array) {
        if (A.length < 2) return;
        const maxDepth = 2 * Math.floor(Math.log2(A.length));
        const insertionSortLimit = 16;
        _introsortLoop(A, 0, A.length - 1, 0, maxDepth, insertionSortLimit);
    }

    // --- Validation & Testing ---

    function validateIntrosort() {
        console.log("--- Starting Stress Test (Float64Array + PDQ optimization) ---");
        
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

        // 4. Already Sorted (new test - should benefit from optimization)
        const sortedArr = new Float64Array(1000);
        for (let i = 0; i < 1000; i++) sortedArr[i] = i;
        const controlSorted = new Float64Array(sortedArr).sort();
        
        introsort(sortedArr);
        console.log("Sorted Test:", areEqual(sortedArr, controlSorted) ? "PASS ✅" : "FAIL ❌");
    }

    function areEqual(a: Float64Array, b: Float64Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function measureTime(label: string, task: () => void): number {
        const start = performance.now();
        task();
        const end = performance.now();
        return end - start;
    }

    function runBenchmark() {
        const SIZE = 5_000_000;
        console.log(`\n--- 🏁 Benchmarking (N = ${SIZE.toLocaleString()}) Float64Array + PDQ ---`);

        const fillRandom = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * SIZE; };
        const fillReverse = (arr: Float64Array) => { for (let i = 0; i < arr.length; i++) arr[i] = SIZE - i; };
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
            const arrNative = new Float64Array(SIZE);
            test.filler(arrNative);
            
            const arrIntro = new Float64Array(arrNative);

            const tNative = measureTime("Native", () => arrNative.sort());
            const tIntro = measureTime("Introsort", () => introsort(arrIntro));

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

    validateIntrosort();
    runBenchmark();
}