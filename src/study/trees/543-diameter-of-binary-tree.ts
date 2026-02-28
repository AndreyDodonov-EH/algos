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

let diameter = 0;

function height(root: TreeNode | null): number {
    if (!root) return 0;
    const leftHeight = !root.left ? 0 : 1 + height(root.left);
    const rightHeight = !root.right ? 0: 1 + height(root.right);
    diameter = Math.max(diameter, leftHeight + rightHeight);
    return Math.max(leftHeight, rightHeight);
}

function test() {
    // const A = [1,null,3, null,null,4,5,null,null,null,null,6,7,8,9]
    const A = [1, 2, 3, 4, 5];
    const root = fromArray(A);
    height(root);
    console.log(diameter);
}

test();
