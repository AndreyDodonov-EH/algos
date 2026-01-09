import { UintArray } from "../../../_helpers/types";
import { randomNumberIntArray, randomTypedUintArray } from "../../../_helpers/random";

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

// ============ Partition Verification for number[] ============
export function verify_partition(A: readonly number[], l: number, r: number, pivot_idx: number): boolean {
    const pivot_val = A[pivot_idx];
    for (let i = l; i < pivot_idx; i++) {
        if (A[i] > pivot_val) return false;
    }
    for (let i = pivot_idx + 1; i < r; i++) {
        if (A[i] < pivot_val) return false;
    }
    return true;
}

// DNF (Dutch National Flag) 3-way partition: [[l,eq)[eq,g)[g,r)]
export function verify_partition_dnf(A: readonly number[], l: number, eq: number, g: number, r: number): boolean {
    if (eq < l || g < eq || r < g) return false;
    const keyVal = A[eq];
    for (let i = l; i < eq; i++) {
        if (A[i] >= keyVal) return false;
    }
    for (let i = eq; i < g; i++) {
        if (A[i] !== keyVal) return false;
    }
    for (let i = g; i < r; i++) {
        if (A[i] <= keyVal) return false;
    }
    return true;
}

export function test_partition(fn: (A: number[], l: number, r: number) => number) {
    for (let i = 1; i < 100; i++) {
        for (let j = 1; j < i; j++) {
            let A: number[] = randomNumberIntArray(j, 0, 100);
            const backup = [...A];
            const pivot_idx = fn(A, 0, A.length);
            if (!verify_partition(A, 0, A.length, pivot_idx)) {
                console.log("Partition failed");
                console.log("Original:", backup);
                console.log("Result:", A);
            }
        }
    }
}

export function test_partition_dnf(fn: (A: number[], l: number, r: number) => [number, number]) {
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < i; j++) {
            let A: number[] = randomNumberIntArray(j, 0, i);
            const backup = [...A];
            const l = 0;
            const r = A.length;
            let [eq, g] = fn(A, l, r);
            if (!verify_partition_dnf(A, l, eq, g, r)) {
                console.log("DNF Partition failed");
                console.log("Original:", backup);
                console.log("Result:", A.slice(l, eq), A.slice(eq, g), A.slice(g, r));
            }
        }
    }
}

// ============ Test Functions for number[] ============
export function test_sort(fn: (A: number[]) => void) {
    for (let i = 0; i < 100; i++) {
        let A: number[] = randomNumberIntArray(100, 0, 100);
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
        let A = randomTypedUintArray(ctor, 4, 0, 99);
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
