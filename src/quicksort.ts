function partition(A: Array<number>, p: number, r: number) {
    let x = A[r]
    let i = p
    for (let j=p;j<r;j++) {
        if (A[i] > x) {
            [A[i],A[j]] = [A[j],A[i]];
            i++;
        }
    }
    [A[i],A[r]] = [A[r],A[i]];
    return i
}

function my_partition(A: Array<number>, p: number, r: number) {
    let q = Math.floor((r-p)/2);
    let x = A[q];
    for (let i=q-1,j=q+1;i>=0 || j<=r;) {
        const y = A[i];
        const z = A[j];
        if (y>x && z<x) {
            [A[i],A[j]] = [A[j],A[i]] 
        } 
        if (y>x) {
            i--;
        }
        if (z<x) {
            j++
        }
    }
}

// let a: number[] = [3, 5, 1, 9, 8, 7]
// my_partition(a,0, a.length-1);
// console.log(a);

let b: number[] = [2, 8, 7, 1, 3, 5, 6, 4]
my_partition(b,0, b.length-1);
console.log(b);