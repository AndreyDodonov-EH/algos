type UintArray = Uint16Array | Uint32Array;

function randomUintArray<T extends UintArray>(
    ctor: new (length: number) => T,
    length: number,
    min: number,
    max: number // inclusive
): T {
    const arr = new ctor(length);
    for (let i = 0; i < length; i++) {
        arr[i] = Math.floor(min + Math.random() * (max - min + 1));
    }
    return arr;
}

function hasUndefined(A: UintArray): boolean {
    for (let i = 0; i < A.length; i++) {
        if (A[i] === undefined) return true;
    }
    return false;
}

function allZeroes(A: UintArray): boolean {
    for (let i = 0; i < A.length; i++) {
        if (A[i] !== 0) return false;
    }
    return true;
}

function isSorted(A: UintArray): boolean {
    for (let i = 1; i < A.length; i++) {
        if (A[i - 1] > A[i]) return false;
    }
    return true;
}

function isPermutation(original: UintArray, sorted: UintArray): boolean {
    if (original.length !== sorted.length) return false;
    const originalCopy = Array.from(original).sort((a, b) => a - b);
    const sortedCopy = Array.from(sorted).sort((a, b) => a - b);
    for (let i = 0; i < originalCopy.length; i++) {
        if (originalCopy[i] !== sortedCopy[i]) return false;
    }
    return true;
}

const UINT16_MAX = 0xFFFF;
const UINT32_MAX = 0xFFFFFFFF;

function test_radix_sort_generic<T extends UintArray>(
    fn: (A: T) => void,
    ctor: new (length: number) => T,
    maxValue: number
) {
    for (let i = 0; i < 100; i++) {
        let A = randomUintArray(ctor, 100, 0, maxValue);
        let backup = new ctor(A.length);
        for (let j = 0; j < A.length; j++) {
            backup[j] = A[j];
        }
        fn(A);
        if (!isSorted(A) || hasUndefined(A)) {
            console.log("A is not sorted");
            console.log("Original:", backup);
            console.log("Result:", A);
        }
        if (allZeroes(A)) {
            console.log("A contains only zeroes");
            console.log(backup);
        }
        if (!isPermutation(backup, A)) {
            console.log("A is not a permutation of original array");
            console.log("Original:", backup);
            console.log("Result:", A);
        }
    }
}

export function test_radix_sort_u32(fn: (A: Uint32Array) => void) {
    test_radix_sort_generic(fn, Uint32Array, UINT32_MAX);
}

export function test_radix_sort_u16(fn: (A: Uint16Array) => void) {
    test_radix_sort_generic(fn, Uint16Array, UINT16_MAX);
}
