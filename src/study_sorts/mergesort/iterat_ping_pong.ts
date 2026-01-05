import { test_sort } from "../../helpers/test_harness";
import { bench_mergesort } from "../../helpers/bench_harness";

// merge 2 sorted arrays
function merge(src: number[], dst: number[], l: number, m: number, r: number) {
    let i = l;
    let j = m;
    let k = l;
    while (i < m && j < r) {
        dst[k++] = (src[i] <= src[j]) ? src[i++] : src[j++];
    }
    while (i < m) {
        dst[k++] = src[i++];
    }
    while (j < r) {
        dst[k++] = src[j++];
    }
}

function mergesort(A: number[]) {
    let B = new Array(A.length);
    for (let i = 0; i < A.length; i++) {
        B[i] = A[i];
    }
    let size = 1;
    let src = A;
    let dst = B;
    while (size < A.length) {
        let i = 0;
        // console.log("Size is " + size);
        while (i < A.length) {
            const m: number = Math.min(i + size, A.length);
            const r: number = Math.min(m + size, A.length);
            // console.log(`[${i},${m}):${src.slice(i, m)} [${m},${r}) ${src.slice(m, r)}`);
            if (i>=m) {
                console.log("ANUS");
            }
            if (r-i>1) merge(src, dst, i, m, r);
            i += 2*size;
        }
        // console.log(dst);
        size *= 2;
        [src, dst] = [dst, src];
    }
    if (A === dst) {
        for (let i=0;i<A.length;i++) {
            A[i] = B[i];
        }
    }
}


test_sort(mergesort);
bench_mergesort(mergesort, "Iterat ping pong");
