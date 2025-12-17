function insertionsort_swap_for(A: number[]) {
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

function insertionsort_shift_for(A:number[]) {
    for (let i=1;i<A.length;i++) {
        const current = A[i];
        let j=i-1;
        for(;j>=0;j--) {
            if (A[j] <= current) {
                break;
            }
            A[j+1] = A[j]; // shift
        }
        A[j+1] = current;
    }
}

function insertionsort_shift_while(A: number[]) {
    for (let i=1; i<A.length; i++) {
        const current = A[i];
        let j=i-1;
        while(j>=0 && A[j]>current) {
            A[j+1] = A[j];
            j--;
        }
        A[j+1] = current;
    }
}