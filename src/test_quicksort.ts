function quicksort(A: number[], p: number, r: number) {
    if (p>=r) {
        return;
    }
    let i = _partition(A, p, r);
    quicksort(A, p, i-1);
    quicksort(A, i+1, r);
    // partition array into two parts
    // call quicksort for left and write part
}

// lomuto
function _partition(A: number[], p: number, r: number) {
    // keep going from left to right
    // if element is too small compared to the given element, than sweep it to the left part
    // i is the end index of the sweeped part
    let key = A[r];
    let i=p;
    let j=p;
    while (j<r) {
        while (j<r && A[j]>=key) j++;
        if (j==r) {
            break;
        }
        [A[i],A[j]] = [A[j], A[i]];
        i++;j++;
    }
    [A[i],A[r]] = [A[r], A[i]];
    return i;
}

function test_quicksort() {
   let A = [3, 5, 1, 7, 9, 4];
    quicksort(A, 0, A.length-1);
    console.log(A);
}

test_quicksort();