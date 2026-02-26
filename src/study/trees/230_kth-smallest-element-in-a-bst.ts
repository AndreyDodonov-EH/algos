import { vis_bstFromRoot } from "../../_helpers/vis/vis_bstFromRoot";

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


function kthSmallest(root: TreeNode | null, k: number = 1): number {
    let stack: TreeNode[] = [];

    let crt = root;
    while (true) {
        while (crt) {
            stack.push(crt);
            crt = crt.left;
        }
        crt = stack.pop()!;
        k--;
        if (k === 0) {
            return crt.val;
        }
        crt = crt.right;
    }
};

function test() {
    let A = [3,1,4,null,2];
    const root = fromArray(A);
    const before = vis_bstFromRoot(root);
    const res = kthSmallest(root, 3);
    console.log(res);
}

test();