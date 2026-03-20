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

function isBalanced(root: TreeNode | null): boolean {
    function dfs(root): [boolean, number] {
            if (!root) return [true, 0];
            let [leftBalanced, leftHeight] = dfs(root.left);
            if (!leftBalanced) return [false, 0];
            leftHeight++;
            let [rightBalanced,rightHeight] = dfs(root.height);
            if (!rightBalanced) return [false, 0];
            rightHeight++;
            const balanced = Math.abs(leftHeight-rightHeight) <= 1;
            if (!balanced) return [false, 0];
            return [true, Math.max(leftHeight, rightHeight)];
        }
        return dfs(root)[0];
};

function test() {
    let A = [1,null,2,null,3]
    let root = fromArray(A);
    const tree = vis_bstFromRoot(root);
}

test();