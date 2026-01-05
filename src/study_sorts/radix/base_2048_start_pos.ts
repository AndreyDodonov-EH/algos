import { log } from "../../helpers/log";

import { test_radix_sort_u32 } from "../../helpers/test_harness";

const power: number = 11;
const base: number = 1<<power;
const biggest_num_power = 32;
const num_of_passes = Math.ceil(biggest_num_power / power);

// PATTERNS
// binary chunks - e.g. one digit - one byte
// bucket counting
// mapping out instead of multiple dynamic lists ("buckets")
// transforming count to offsets (histogram to pointers)
// ping-pong (swap) of src/dst

function radix_sort(A: Uint32Array) {
    let B: Uint32Array = new Uint32Array(A.length);
    // for each iteration we need to find out how much space each "digit" will occupy and map out accordingly
    let mask: number = base - 1;
    let offsets: Uint32Array = new Uint32Array(base);
    for (let i=0;i<num_of_passes;i++) {
        offsets.fill(0);
        // first count number of elements for each bucket
        for (let j=0;j<A.length;j++) {
            // >>> is a shift for unsigned
            const lsd = (A[j] >>> (i*power)) & mask;
            offsets[lsd]++;
        }
        // transform them into actual offsets
        let total_els = 0;
        for (let j=0;j<offsets.length;j++) {
            const tmp = offsets[j];
            offsets[j] = total_els;
            total_els += tmp;
        }
        for (let j=0;j<A.length;j++) {
            // >>> is a shift for unsigned
            const lsd = (A[j] >>> (i*power)) & mask;
            log(`lsd: ${lsd}`);
            const idx_within_buckets = offsets[lsd];
            B[idx_within_buckets] = A[j];
            offsets[lsd]++;
        }
        // instead of writing back to A we swap roles
        [A, B] = [B, A];
    }
    if (num_of_passes%2) { // if we have odd number of swaps then we need to copy-back, B is our original now
        for (let i=0; i<A.length;i++) {
            B[i] = A[i];
        }
    }
}

test_radix_sort_u32(radix_sort);
