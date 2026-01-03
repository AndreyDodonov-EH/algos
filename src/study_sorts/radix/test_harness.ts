function randomUint16Array(
    length: number,
    min: number,
    max: number // inclusive
): Uint16Array {
    const arr = new Uint16Array(length);
    for (let i = 0; i < length; i++) {
        arr[i] = Math.floor(min + Math.random() * (max - min + 1));
    }
    return arr;
}

function hasUndefined(A: Uint16Array): boolean {
    for (let i = 0; i < A.length; i++) {
        if (A[i] === undefined) return true;
    }
    return false;
}

function isSorted(A: Uint16Array): boolean {
    for (let i = 1; i < A.length; i++) {
        if (A[i - 1] > A[i]) return false;
    }
    return true;
}

const UINT16_MAX = 0xFFFF;

export function test_radix_sort(fn: (A: Uint16Array) => void) {
    for (let i = 0; i < 100; i++) {
        let A: Uint16Array = randomUint16Array(100, 0, UINT16_MAX);
        let backup: Uint16Array = new Uint16Array(A.length);
        for (let j = 0; j < A.length; j++) {
            backup[j] = A[j];
        }
        fn(A);
        if (!isSorted(A) || hasUndefined(A)) {
            console.log("A is not sorted");
            console.log(backup);
        }
    }
}

