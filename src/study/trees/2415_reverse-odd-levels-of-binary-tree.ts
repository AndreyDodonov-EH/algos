import { Queue } from "@datastructures-js/queue";
import { vis_bstFromRoot, vis_bstFromRoot_dot } from "../../_helpers/vis/vis_bstFromRoot";
import { Deque } from "@datastructures-js/deque";

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

function reverseOddLevels(root: TreeNode | null): TreeNode | null {
    let crtLevel = new Array<TreeNode>();
    let nextLevel = new Array<TreeNode>();
    let ans: TreeNode | null = null;
    if (root) {crtLevel.push(root); ans = root; } 
    let inv = false;
    while (crtLevel.length > 0) {
        const len = crtLevel.length;
        if (inv) {
            for(let i=0,j=len-1;i<j;i++,j--) {
                const tmp = crtLevel[i].val;
                crtLevel[i].val = crtLevel[j].val;
                crtLevel[j].val = tmp;
            }
        }
        nextLevel = [];
        for (let i=0;i<len;i++) {
            if (crtLevel[i].left) nextLevel.push(crtLevel[i].left!);
            if (crtLevel[i].right) nextLevel.push(crtLevel[i].right!);
        }
        crtLevel = nextLevel;
        inv = !inv;
    }
    return ans;
};

function reverseOddLevelsRec(root: TreeNode | null, inv: boolean = true) {
    if (!root) return null;
    function dfs(left: TreeNode, right: TreeNode, inv: boolean) {
        let x = root;
        if (inv) {
            const tmp = left.val;
            left.val = right.val;
            right.val = tmp;
        }
        if (left.left && right.right) dfs(left.left, right.right, !inv);
        if (left.right && right.left) dfs(left.right, right.left, !inv);
    }
    if (root.left && root.right) dfs(root.left, root.right, true);
    return root;
}

function test() {
    let A = [4,2,7,1,3,6,9]
    let root = fromArrayLeetcode(A);
    const tree = vis_bstFromRoot_dot(root);
    const inv = reverseOddLevelsRec(root);
    const invTree = vis_bstFromRoot_dot(inv);
}

test();