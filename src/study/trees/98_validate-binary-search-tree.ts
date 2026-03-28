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


function isValidBST(root: TreeNode | null, min: number = -Infinity, max: number = Infinity): boolean {
    if (!root) return true;
    if (root.val <= min || root.val >= max) return false;
    return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
};

function isValidBSTInotder(root: TreeNode | null) {
    // every element should be bigger than the previouis one
    let prev = -Infinity;
    function dfs(root: TreeNode | null): boolean {
        if (!root) return true;
        let ok: boolean = dfs(root.left);
        if (!ok) return false;
        ok = (root.val > prev);
        if (!ok) return false;
        prev = root.val;
        ok = dfs(root.right);
        return ok;
    }
    dfs(root);
}

function traverse(root: TreeNode | null) {
    if (!root) return;
    traverse(root.left);
    console.log(root.val);
    traverse(root.right);
}

function test() {
    let A = [5,4,6,null,null,3,7];
    let root = fromArrayLeetcode(A);
    let tree = vis_bstFromRoot_dot(root);
    // const res = isValidBST(root);
    traverse(root);
    console.log();
}

test();