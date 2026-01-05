import { log } from "../../helpers/log";

import { test_radix_sort_u16 } from "../../helpers/test_harness";

const power: number = 8;
const base: number = 1<<power;
const biggest_num_power = 16;
const num_of_passes = biggest_num_power / power;

function radix_sort(A: Uint16Array) {
    const digits: number[][] = Array.from({length:base}, () => []);
    let mask: number = base - 1;
    for (let i=0;i<num_of_passes;i++) {
        for (let j=0;j<A.length;j++) {
            // >>> is a shift for unsigned
            const lsd = (A[j] >>> (i*power)) & mask;
            log(`lsd: ${lsd}`);
            digits[lsd].push(A[j]);
        }
        let k=0;
        for(let i=0;i<digits.length;i++) {
            for (let j=0;j<digits[i].length;j++) {
                A[k++] = digits[i][j];
            }
            digits[i].length = 0;
        }
    }
}

test_radix_sort_u16(radix_sort);
