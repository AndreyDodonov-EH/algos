import { vis_bstFromRoot_dot } from "../../_helpers/vis/vis_bstFromRoot";

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

function flatten(root: TreeNode | null): void {
    // flattens and returns tail
    function dfs(root: TreeNode | null): TreeNode | null {
        if (!root) return null;
        const leftTail = dfs(root.left);
        const rightTail = dfs(root.right);
        if (leftTail) {
            leftTail.right = root.right;
            root.right = root.left;
        }
        return rightTail || leftTail || root;
    }
    dfs(root);
}

function test() {
    const A = [1,2,5,3,4,null,6];
    const root = fromArrayLeetcode(A);
    vis_bstFromRoot_dot(root);
    const res = flatten(root);
    console.log()
}

test();