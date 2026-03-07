class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
}

function fromArray(A: (number | null)[]): TreeNode | null {
    const n = A.length;
    const nodes = new Array<TreeNode | null>(n);
    for (let i=0;i<n;i++) {
        nodes[i] = (A[i] === null) ? null : new TreeNode(A[i]!);
    }
    for (let i=0;i<n;i++) {
        if (nodes[i] !== null) {
            nodes[i]!.left = (1+2*i < n) ? nodes[1+2*i] : null;
            nodes[i]!.right = (2+2*i < n) ? nodes[2+2*i] : null;
        }
    }
    return nodes[0];
}

function sumRootToLeaf(root: TreeNode | null): number {
    let sum = 0;
    let stack: [TreeNode, number][] = [];
    if (root) stack.push([root, root.val]);
    while (stack.length > 0) {
   
    }
    return sum;
}

function test() {
    let A = [1,0,1,0,1,0,1];
    const root = fromArray(A);
    let res = sumRootToLeaf(root);
    console.log(res);
}

test();