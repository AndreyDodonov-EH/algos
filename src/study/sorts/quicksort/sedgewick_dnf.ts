import { test_sort } from "../_helpers/test_harness";
import { randomNumberIntArray } from "../../../_helpers/random";

function swap(A:number[], i:number, j:number){
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

// returns tuple [eq,g]; splits effectively into [[l,eq-1][eq,g-1][g,r-1]
// (Dijkstra 3-way)
function partition_sedgewick_dnf(A:number[], l:number, r:number): [number, number] {
    const keyVal = A[l];
    let eq=l+1;
    let i=l+1;
    let g=r;
    while(i<g) {
        if (A[i] < keyVal) {
            swap(A,i++,eq++);
        } else if (A[i] === keyVal) {
            i++;
        } else if (A[i] > keyVal) {
            swap(A,i,--g);
        }
    }
    swap(A,l,--eq);
    return [eq,g];
}


function verify(A: readonly number[], l: number, eq: number, g: number, r:number): boolean {
    if (eq < l || g < eq || r < g) {
        return false;
    }
    let i=l;
    const keyVal = A[eq];
    for (;i<eq;i++) {
        if (A[i]>=keyVal) {
            return false;
        }
    }
    for (;i<g;i++) {
        if (A[i]!==keyVal) {
            return false;
        }
    }
    for (;i<r;i++) {
        if (A[i]<=keyVal) {
            return false;
        }
    }
    return true;
}

function test() {
    for (let i=0;i<100;i++) {
        for (let j=0; j<i;j++) {
            let A:number[] = randomNumberIntArray(j,0,i);
            const backup:number[] = [...A];
            const l = 0;
            const r = A.length;
            let [eq,g] = partition_sedgewick_dnf(A, l, r);
            if (!verify(A,l,eq,g,r)) {
                console.log(backup);
                console.log(A.slice(l,eq),A.slice(eq,g), A.slice(g,r));
                console.log();
            }
        }
    }
}

test();

function quicksort_body(A:number[], l:number, r:number) {
    if (r-l<=1) {
        return;
    }
    const [eq,g] = partition_sedgewick_dnf(A, l, r);
    quicksort_body(A, l, eq);
    quicksort_body(A, g, r);
}

function quicksort(A:number[]) {
    quicksort_body(A, 0, A.length);
}

test_sort(quicksort);
