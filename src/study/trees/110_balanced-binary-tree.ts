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

function isBalanced(root: TreeNode | null) {
    let balanced = true;
    function dfs(root: TreeNode | null): number {
        if (!root) return 0;
        const leftHeight = 1 + dfs(root.left);
        const rightHeight = 1 + dfs(root.right);
        balanced = (Math.abs(rightHeight - leftHeight) <= 1);
        console.log(root.val + " " + leftHeight + " " + rightHeight)
        return Math.max(leftHeight, rightHeight);
    }
    dfs(root);
    return balanced;
}

function test() {
    let A = [1,2,2,3,null,null,3,4,null,null,4]
    let root = fromArrayLeetcode(A);
    const tree = vis_bstFromRoot(root);
    const res = isBalanced(root);
    console.log(res);
}

test();