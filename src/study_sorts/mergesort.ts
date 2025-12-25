function swap(A: number[], i: number, j: number) {
    const tmp = A[j];
    A[j] = A[i];
    A[i] = tmp;
}

function merge_rec(A: number[], a: number, p: number, r: number) {
    // Tail Call Optimization: Loop instead of recursing on the right side
    while (p < r) {
        let i = a;
        let j = p;

        // 1. Comparison Loop
        for (; i < p && j < r; i++) {
            if (A[i] <= A[j]) {
                continue;
            }

            swap(A, i, j);

            // Buffer Extension
            if (j + 1 < r && A[j] > A[j + 1]) {
                j++;
            }
        }

        // If no buffer was created (p == j), we are done with this segment.
        if (p >= j) {
            break;
        }

        // 2. Recursion (Left vs Buffer)
        // We must recurse here to clean up the Left side [a, j)
        // This cannot be easily eliminated without a manual stack, 
        // but it typically operates on a smaller range.
        merge_rec(A, a, p, j);

        // 3. Tail Call Elimination (Buffer vs Rest)
        // Instead of: merge_rec(A, p, j, r);
        // We update the pointers to treat the Buffer as the new "Left" 
        // and the Rest as the new "Right", then loop.
        a = p;
        p = j;
        // r remains r
    }
}


function mergesort_body(A: number[], p: number, r: number) {
    if (r - p < 2) {
        return;
    }
    const mid = p + Math.floor((r-p)/2);
    mergesort_body(A, p, mid);
    mergesort_body(A, mid, r);
    merge_rec(A, p, mid, r);
}



function mergesort(A: number[]) {
    mergesort_body(A, 0, A.length);
}

function randomIntArray(
    length: number,
    min: number,
    max: number // inclusive
  ): number[] {
    return Array.from({ length }, () =>
      Math.floor(min + Math.random() * (max - min + 1))
    );
  }

  function isSorted(a: readonly number[]): boolean {
  for (let i = 1; i < a.length; i++) {
    if (a[i - 1] > a[i]) return false;
  }
  return true;
}

function test_merge() {
    // let A: number[] = [2, 3, 8, 19, 50, 100, 1, 5, 7, 11, 20, 37, 10, 25];
    // let A: number[] = [2,8, 19, 3, 10];
    for (let i = 0; i < 10; i++) {
    let A: number[] = randomIntArray(10000, 0, 1000000);
    // let A: number[] = [6, 9, 4, 6, 2, 7, 5, 1];
    // console.log(A);
    mergesort(A);
    if (!isSorted(A)) {
        console.error("Array is not sorted!");
    }
    // console.log(A);
    }
}

test_merge();
