type NumericTypedArray =
  | Int8Array | Uint8Array | Uint8ClampedArray
  | Int16Array | Uint16Array
  | Int32Array | Uint32Array
  | Float32Array | Float64Array;


  // if we want to delete element, we need to shift left to preserver contigious property,
  // and if we shift left, we start from left to right,
  // because we have an empty slot we may/must loose
function deleteElement(A: NumericTypedArray, k: number) {
    for (let i = k; i < A.length - 1; i++) {
        A[i] = A[i + 1];
    }
    A[A.length-1] = Infinity;
}

// if we want to insert element, we need to shift right to make space for it,
// and if we shift right, we start from right to left,
// because we have capacity at the right (error case if we do not is not handled)
function insertElement(A: NumericTypedArray, k:number, val:number) {
    for (let i=A.length-1;i>k;i--) {
        A[i] = A[i-1];
    }
    A[k] = val;
}

function test() {
    let A = new Int32Array(10);
    for (let i=0;i<A.length;i++) {
        A[i] = i;
    }
    console.log(A);
    deleteElement(A,3);
    console.log(A);
    insertElement(A,3, 100500);
    console.log(A);
}

test();
