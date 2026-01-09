import { randomNumberIntArray } from "../../../_helpers/random";

// ============ Quickselect Verification ============
export function verify_quickselect(A: number[], k: number, val: number): boolean {
    const sorted = [...A].sort((a, b) => a - b);
    return sorted[k] === val;
}

export function verify_quickselect_index(A: readonly number[], k: number, idx: number): boolean {
    const sorted = [...A].sort((a, b) => a - b);
    return A[idx] === sorted[k];
}

export function test_quickselect(fn: (A: number[], k: number) => number) {
    for (let i = 1; i < 100; i++) {
        for (let j = 1; j < i; j++) {
            const A: number[] = randomNumberIntArray(j, 0, i);
            const B: number[] = [...A];
            const k = Math.floor(Math.random() * j);
            const val = fn(B, k);
            if (!verify_quickselect(B, k, val)) {
                console.log("Quickselect failed");
                console.log("k:", k);
                console.log("val:", val);
                console.log("Original:", A);
                console.log("Result:", B);
            }
        }
    }
}

export function test_quickselect_index(fn: (A: number[], k: number) => number) {
    for (let i = 1; i < 100; i++) {
        for (let j = 1; j < i; j++) {
            const A: number[] = randomNumberIntArray(j, 0, i);
            const k = Math.floor(Math.random() * j);
            const idx = fn(A, k);
            const B: number[] = [...A];
            if (!verify_quickselect_index(A, k, idx)) {
                console.log("Quickselect index failed");
                console.log("k:", k);
                console.log("idx:", idx);
                console.log("Original:", A);
                console.log("Sorted:", B.sort((a, b) => a - b));
            }
        }
    }
}
