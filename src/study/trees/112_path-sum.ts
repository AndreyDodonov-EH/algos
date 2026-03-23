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


function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
    if (!root) return false;
    targetSum -= root.val;
    if (!root.left && !root.right) {
        return (targetSum === 0);
    }
    return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum);
}

function test() {
    const A = [5,4,8,11,null,13,4,7,2,null,null,null,1];
    const root = fromArrayLeetcode(A);
    const res: boolean = hasPathSum(root, 22);
    console.log(res);
}

test();