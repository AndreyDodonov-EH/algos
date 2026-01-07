import { UintArray } from "./types"
// ============ Random Array Generators ============
export function randomNumberIntArray(
    length: number,
    min: number,
    max: number // exclusive
): number[] {
    return Array.from({ length }, () =>
        Math.floor(min + Math.random() * (max - min))
    );
}

export function randomTypedUintArray<T extends UintArray>(
    ctor: new (arg: number | ArrayLike<number>) => T,
    length: number,
    min: number,
    max: number // exclusive
): T {
    const arr = new ctor(length);
    for (let i = 0; i < length; i++) {
        arr[i] = Math.floor(min + Math.random() * (max - min));
    }
    return arr;
}
