import { log } from "../../helpers/log";
import { test_radix_sort_u32 } from "../../helpers/test_harness";

function find_max_element(A: Uint32Array): number {
    let max = -Infinity;
    for (let i=0; i<A.length;i++) {
        max = (A[i] > max) ? A[i] : max;
    }
    return max;
}

function radix_sort(A: Uint32Array) {
    // add elements to bucket digits
    let B: Uint32Array = new Uint32Array(A.length);
    let offsets: Uint32Array = new Uint32Array(10);
    let max_element = find_max_element(A);
    let divider = 1;
    let pass_cnt = 0;
    while (divider <= max_element) {
        offsets.fill(0);
        // 1. count elements
        for (let i=0;i<A.length;i++) {
            const lsd = (Math.floor(A[i] / divider)) % 10;
            offsets[lsd]++;
        }
        // 2. calculate their offsets
        let total_el_cnt = 0;
        for(let i=0;i<offsets.length;i++) {
            const tmp = offsets[i];
            offsets[i] = total_el_cnt;
            total_el_cnt += tmp;
        }
        // 3. write into proper offsets
        for (let i=0;i<A.length;i++) {
            const lsd = (Math.floor(A[i] / divider)) % 10;;
            B[offsets[lsd]++] = A[i];
        }
        // 4. swap A and B
        [A,B] = [B,A];
        divider *= 10;
    }
    pass_cnt++;
    if (pass_cnt%2) {
        for (let i=0;i<A.length;i++) {
            B[i] = A[i];
        }
    }
}

test_radix_sort_u32(radix_sort);
