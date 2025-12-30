function randomIntArray(
    length: number,
    min: number,
    max: number // inclusive
): number[] {
    return Array.from({ length }, () =>
        Math.floor(min + Math.random() * (max - min + 1))
    );
}

function hasUndefined(A: readonly number[]): boolean {
    for (let i = 0; i < A.length; i++) {
        if (A[i] === undefined) return true;
    }
    return false; 
}

function isSorted(A: readonly number[]): boolean {
    for (let i = 1; i < A.length; i++) {
        if (A[i - 1] > A[i]) return false;
    }
    return true;
}

export function test_mergesort(fn: (A: number[]) => void) {
    for (let i = 0; i < 100; i++) {
        let A: number[] = randomIntArray(100, 0, 100);
        let backup: number[] = new Array(A.length);
        for (let j=0; j<A.length;j++) {
            backup[j] = A[j];
        }
        fn(A);
        if (!isSorted(A) || hasUndefined(A)) {
            console.log("A is not sorted");
            console.log(backup);
        }
    }
}