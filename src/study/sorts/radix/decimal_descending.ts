import { log } from "../../../_helpers/log";

import { test_radix_sort_u32 } from "../_helpers/test_harness";

function log_digits(digits: number[][]) {
    for (let i=0;i<digits.length;i++) {
        log(digits[i]);
    }
}

function find_max_element(A: Uint32Array): number {
    let max = -Infinity;
    for (let i=0; i<A.length;i++) {
        max = (A[i] > max) ? A[i] : max;
    }
    return max;
}

function radix_sort(A: Uint32Array) {
    // add elements to bucket digits
    const digits: number[][] = Array.from({length:10}, () => []);
    let max_element = find_max_element(A);
    log("Max element: " + max_element);
    let divider = 1;
    while (divider <= max_element) {
        log(`Divider: ${divider}`);
        for (let i=0;i<A.length;i++) {
            let lsd = (Math.floor(A[i] / divider)) % 10;
            log(`lsd: ${lsd}`);
            digits[lsd].push(A[i]);
        }
        log_digits(digits);
        // write back to the original array and clear
        // iterate buckets in reverse order to make array descending
        let k=0;
        for(let i=digits.length-1;i>=0;i--) {
            for (let j=0;j<digits[i].length;j++) {
                A[k++] = digits[i][j];
            }
            digits[i].length = 0;
        }
        // alternatively we could have inverted order in which we take from the bucket
        // and writing order
        // let k=A.length-1;
        // for(let i=0;i<digits.length;i++) {
        //     for (let j=digits[i].length-1;j>=0;j--) {
        //         A[k--] = digits[i][j];
        //     }
        //     digits[i].length = 0;
        // }
        divider *= 10;
    }
}

test_radix_sort_u32(radix_sort, false);
