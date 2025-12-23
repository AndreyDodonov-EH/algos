/// keep sweeping smaller elements to the left side
function partition_lomuto(A: number[], p: number, r: number):[number, number] {
    let x = A[r]
    let i = p
    let j = p
    for (j = p; j < r; j++) {
        if (A[j] < x) {
            [A[i], A[j]] = [A[j], A[i]];
            i++;
        }
    }
    [A[i], A[r]] = [A[r], A[i]];
    return [i, j];
}

/// go from two ends and swap if both are mismatched
/// also added swap middle with end "ritual"
/// a.k.a. Introsort partition
function partition_sedgewick(A: number[], p: number, r: number):[number, number] {
    const m = Math.floor((p+r)/2);
    [A[m], A[r]] = [A[r], A[m]];
    let x = A[r];
    let i = p;
    let j = r - 1;
    while (true) {
        while (A[i] < x) i++;
        while (j > i && A[j] > x) {
            j--;
        }
        if (i >= j) {
            break;
        }
        [A[i], A[j]] = [A[j], A[i]];
        i++; j--;
    }
    [A[i], A[r]] = [A[r], A[i]];
    return [i, j];
}

// pick element in the middle and then sweep to the left and right relative to it's value,
// but not it's position
function partition_hoare(A: number[], p: number, r: number): [number, number] {
    let x = A[Math.floor((r + p) / 2)];
    let i = p;
    let j = r;

    while (true) {
        while (A[i] < x) i++;
        while (A[j] > x) j--;
        if (i >= j) return [i,j];
        [A[i], A[j]] = [A[j], A[i]];
        i++; j--;
    }
}

function partition_hoare_claude(A: number[], p: number, r: number): [number, number] {
    let x = A[Math.floor((p + r) / 2)];
    let i = p - 1;
    let j = r + 1;

    while (true) {
        do { i++; } while (A[i] < x);
        do { j--; } while (A[j] > x);

        if (i >= j) return [i, j];

        [A[i], A[j]] = [A[j], A[i]];
    }
}

function quicksort_lomuto(A: number[], p: number, r: number) {
    if (r<=p) return;
    const pivots = partition_lomuto(A, p, r);
    quicksort_sedgewick(A, p, pivots[0]-1);
    quicksort_sedgewick(A, pivots[0]+1, r);
}

function quicksort_sedgewick(A: number[], p: number, r: number) {
    if (r<=p) return;
    const pivots = partition_sedgewick(A, p, r);
    quicksort_sedgewick(A, p, pivots[0]-1);
    quicksort_sedgewick(A, pivots[0]+1, r);
}

function quicksort_hoare(A: number[], p: number, r: number) {
    if (r<=p) return;
    const pivots = partition_hoare(A, p, r);
    quicksort_hoare(A, p, pivots[1]);
    quicksort_hoare(A, pivots[1]+1, r);
}


