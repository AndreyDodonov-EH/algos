import { vis_bstFromRoot_dot } from "../../_helpers/vis/vis_bstFromRoot"

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

function fromArrayLeetcode(A: (number | null)[]): TreeNode | null {
    if (A.length === 0 || A[0] === null) return null;
    const root = new TreeNode(A[0]);
    const queue: TreeNode[] = [root];
    let i = 1;
    while (i < A.length) {
        const node = queue.shift()!;
        if (i < A.length && A[i] !== null) {
            node.left = new TreeNode(A[i]!);
            queue.push(node.left);
        }
        i++;
        if (i < A.length && A[i] !== null) {
            node.right = new TreeNode(A[i]!);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function fromArrayNeetcode(A: (number | null)[]): TreeNode | null {
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


function isValidBST(r: TreeNode | null): boolean {
    if (!r) return true;
    let min = r.val;
    let max = r.val;
    function validate(root: TreeNode | null, min: number, max: number): boolean {
        if (!root) return true;
        if (root.val < min) return false;
        if (root.val > max) return false;
        const leftOk = root.left ? root.left.val < root.val && validate(root.left, -Infinity, Math.min(min, root.val)) : true;
        const rightOk = root.right ? root.right.val > root.val && validate(root.right, Math.max(max, root.val), Infinity) : true;
        return leftOk && rightOk;
    }
    return validate(r, min, max)
};

function test() {
    let A = [5,4,6,null,null,3,7];
    let root = fromArrayLeetcode(A);
    let tree = vis_bstFromRoot_dot(root);
    const res = isValidBST(root);
    console.log(res);
}

test();