function insert(B: number[], x: number) {
    B.push(x);
    for (let i = B.length-2;i>=0;i--) {
        if (B[i]>x){
            [B[i], B[i+1]] = [B[i+1], B[i]];
        } else {
            break;
        }
    }
    return B;
}


function insertionsort_swap(A: number[]) {
    for (let i=1;i<A.length;i++) { 
        for (let j=i-1;j>=0;j--) {
            if (A[j]>A[j+1]) {
                [A[j], A[j+1]] = [A[j+1], A[j]];
            } else {
                break;
            }
        }
    }
}

// ToDo: fix
function insertionsort_shift(A:number[]) {
    for (let i=1;i<A.length;i++) {
        const current = A[i];
        for(let j=i-1;j>=0;j--) {
            if (A[j] < current) {
                A[j] = current
                break;
            }
            A[j+1] = A[j]; // shift
        }
    }
}

function test_insertionsort() {
    let A: number[] = [2, 8, 7, 1];
    insertionsort_shift(A);
    console.log(A);
}

test_insertionsort();
