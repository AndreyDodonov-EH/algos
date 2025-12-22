namespace introsort_loop_tail_typed {

    // Helper: Manual swap is often faster than destructuring on TypedArrays in some engines
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

    function partition_sedgewick(A: Float64Array, p: number, r: number): [number, number] {
        const m = Math.floor((p + r) / 2);
        swap(A, m, r);
        // [A[m],A[r]] = [A[r],A[m]];
        
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
            // [A[i],A[j]] = [A[j],A[i]];
            i++; j--;
        }
        swap(A, i, r);
        // [A[i],A[r]] = [A[r],A[i]];
        return [i, j];
    }

    function _floatDown(A: Float64Array, p:number, r:number, i: number) {
        const firstChildIdx = p + Math.floor((r - p + 1) / 2);
        while (i < firstChildIdx) { 
            let idxOfBest = i;
            const idxOfLeft =  2 * i - p + 1;
            
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
                // [A[i],A[idxOfBest]] = [A[idxOfBest],A[i]];
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
            // [A[i],A[p]] = [A[p],A[i]];
            _floatDown(A, p, i - 1, p);
        }
    }

    function _introsortLoop(A: Float64Array, p: number, r: number, currentDepth: number, maxDepth: number, insertionSortLimit = 16) {
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

    export function introsort(A: Float64Array) {
        if (A.length < 2) return;
        const maxDepth = 2 * Math.floor(Math.log2(A.length));
        const insertionSortLimit = 16;
        _introsortLoop(A, 0, A.length - 1, 0, maxDepth, insertionSortLimit);
    }

    // --- Validation & Testing ---

    function validateIntrosort() {
        console.log("--- Starting Stress Test (Float64Array) ---");
        
        // 1. Random Numbers
        const randomArr = new Float64Array(1000);
        for(let i=0; i<1000; i++) randomArr[i] = Math.floor(Math.random() * 10000);
        const controlArr = new Float64Array(randomArr).sort(); // Native typed sort works numerically by default
        
        introsort(randomArr);
        console.log("Random Test:", areEqual(randomArr, controlArr) ? "PASS ✅" : "FAIL ❌");

        // 2. Reverse Sorted
        const reverseArr = new Float64Array(1000);
        for(let i=0; i<1000; i++) reverseArr[i] = 1000 - i;
        const controlRev = new Float64Array(reverseArr).sort();
        
        introsort(reverseArr);
        console.log("Reverse Test:", areEqual(reverseArr, controlRev) ? "PASS ✅" : "FAIL ❌");

        // 3. Many Duplicates
        const dupesArr = new Float64Array(1000);
        for(let i=0; i<1000; i++) dupesArr[i] = Math.floor(Math.random() * 10);
        const controlDupes = new Float64Array(dupesArr).sort();
        
        introsort(dupesArr);
        console.log("Dupes Test: ", areEqual(dupesArr, controlDupes) ? "PASS ✅" : "FAIL ❌");
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
        const SIZE = 5_000_000; // Increased size to 5M for TypedArray (they are fast!)
        console.log(`\n--- 🏁 Benchmarking (N = ${SIZE.toLocaleString()}) Float64Array ---`);

        // Generators
        const fillRandom = (arr: Float64Array) => { for(let i=0; i<arr.length; i++) arr[i] = Math.random() * SIZE; };
        const fillReverse = (arr: Float64Array) => { for(let i=0; i<arr.length; i++) arr[i] = SIZE - i; };
        const fillDupes = (arr: Float64Array) => { for(let i=0; i<arr.length; i++) arr[i] = Math.floor(Math.random() * 20); };

        // Warmup
        const warmup = new Float64Array(1000);
        fillRandom(warmup);
        introsort(warmup);
        
        const tests = [
            { name: "Random Data", filler: fillRandom },
            { name: "Reverse Sorted", filler: fillReverse },
            { name: "Many Duplicates", filler: fillDupes }
        ];

        console.table(tests.map(test => {
            // Allocate Memory
            const arrNative = new Float64Array(SIZE);
            test.filler(arrNative);
            
            // Copy for Introsort
            const arrIntro = new Float64Array(arrNative);

            // Run Native Sort (Float64Array.sort is numeric by default in C++)
            const tNative = measureTime("Native", () => arrNative.sort());

            // Run Your Introsort
            const tIntro = measureTime("Introsort", () => introsort(arrIntro));

            // Validation
            const isCorrect = areEqual(arrIntro, arrNative);

            return {
                "Scenario": test.name,
                "Native (ms)": tNative.toFixed(2),
                "Yours (ms)": tIntro.toFixed(2),
                "Slowdown": `${(tIntro / tNative).toFixed(2)}x`, // Lower is better
                "Valid?": isCorrect ? "✅" : "❌"
            };
        }));
    }

    validateIntrosort();
    runBenchmark();
}
