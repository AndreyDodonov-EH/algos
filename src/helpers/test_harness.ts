// ============ Common Types ============
type UintArray = Uint16Array | Uint32Array;

// ============ Random Array Generators ============
function randomIntArray(
    length: number,
    min: number,
    max: number // inclusive
): number[] {
    return Array.from({ length }, () =>
        Math.floor(min + Math.random() * (max - min + 1))
    );
}

function randomUintArray<T extends UintArray>(
    ctor: new (arg: number | ArrayLike<number>) => T,
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

// ============ Validation Utilities for number[] ============
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

function isPermutation(original: readonly number[], sorted: readonly number[]): boolean {
    if (original.length !== sorted.length) return false;
    const originalCopy = Array.from(original).sort((a, b) => a - b);
    const sortedCopy = Array.from(sorted).sort((a, b) => a - b);
    for (let i = 0; i < originalCopy.length; i++) {
        if (originalCopy[i] !== sortedCopy[i]) return false;
    }
    return true;
}

// ============ Validation Utilities for UintArray ============
function hasUndefinedUint(A: UintArray): boolean {
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

function isSortedUint(A: UintArray): boolean {
    for (let i = 1; i < A.length; i++) {
        if (A[i - 1] > A[i]) return false;
    }
    return true;
}

function isSortedDescending(A: UintArray): boolean {
    for (let i = 1; i < A.length; i++) {
        if (A[i - 1] < A[i]) return false;
    }
    return true;
}

function isPermutationUint(original: UintArray, sorted: UintArray): boolean {
    if (original.length !== sorted.length) return false;
    const originalCopy = Array.from(original).sort((a, b) => a - b);
    const sortedCopy = Array.from(sorted).sort((a, b) => a - b);
    for (let i = 0; i < originalCopy.length; i++) {
        if (originalCopy[i] !== sortedCopy[i]) return false;
    }
    return true;
}

// ============ Test Functions for number[] ============
export function test_sort(fn: (A: number[]) => void) {
    for (let i = 0; i < 100; i++) {
        let A: number[] = randomIntArray(100, 0, 100);
        let backup: number[] = [...A];
        fn(A);
        if (!isSorted(A) || hasUndefined(A)) {
            console.log("A is not sorted");
            console.log("Original:", backup);
            console.log("Result:", A);
        }
        if (!isPermutation(backup, A)) {
            console.log("A is not a permutation of original array");
            console.log("Original:", backup);
            console.log("Result:", A);
        }
    }
}

// ============ Test Functions for UintArray ============
const UINT16_MAX = 0xFFFF;
const UINT32_MAX = 0xFFFFFFFF;

function test_radix_sort_generic<T extends UintArray>(
    fn: (A: T) => void,
    ctor: new (arg: number | ArrayLike<number>) => T,
    maxValue: number,
    ascending: boolean = true
) {
    for (let i = 0; i < 100; i++) {
        let A = randomUintArray(ctor, 4, 0, 99);
        let backup = new ctor(A.length);
        for (let j = 0; j < A.length; j++) {
            backup[j] = A[j];
        }
        fn(A);
        const sortedCorrectly = ascending ? isSortedUint(A) : isSortedDescending(A);
        if (!sortedCorrectly || hasUndefinedUint(A)) {
            console.log("A is not sorted");
            console.log("Original:", backup);
            console.log("Result:", A);
        }
        if (allZeroes(A)) {
            console.log("A contains only zeroes");
            console.log(backup);
        }
        if (!isPermutationUint(backup, A)) {
            console.log("A is not a permutation of original array");
            console.log("Original:", backup);
            console.log("Result:", A);
        }
    }
}

export function test_radix_sort_u32(fn: (A: Uint32Array) => void, ascending: boolean = true) {
    test_radix_sort_generic(fn, Uint32Array, UINT32_MAX, ascending);
}

export function test_radix_sort_u16(fn: (A: Uint16Array) => void, ascending: boolean = true) {
    test_radix_sort_generic(fn, Uint16Array, UINT16_MAX, ascending);
}
