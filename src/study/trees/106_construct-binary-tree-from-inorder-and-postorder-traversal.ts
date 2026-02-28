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

// let result: [number | null] = new Array<number | null>(preorder.length).fill(null);

function indexOfInRange(A: number[], l: number, r: number, val: number) {
    for (let i=l;i<r;i++) {
        if (A[i] === val) return i;
    }
    return -1;
}

function traverse(P: number[], I: number[],
    p_l: number, p_r: number,
    i_l: number, i_r: number,
    root: TreeNode, left: boolean) {
    if (p_r <= p_l) return;
    let graph = vis_bstFromRoot(dummy.left);
    const val = P[p_l];
    const newNode = new TreeNode(val);
    if (left) root.left = newNode;
    else root.right = newNode;
    graph = vis_bstFromRoot(dummy.left);
    const m = indexOfInRange(I, i_l, i_r, val);
    const left_size = (m-i_l);
    traverse(P, I, p_l+1, p_l+1+left_size, i_l, m, newNode, true);
    traverse(P, I, p_l+1+left_size, p_r, m+1, i_r, newNode, false);
}

const dummy = new TreeNode(42);

function buildTree(P: number[], I: number[]) {
    traverse(P, I, 0, P.length, 0, I.length, dummy, true);
    let graph = vis_bstFromRoot(dummy.left);
    return dummy.left;
};

function test() {
    let preorder = [4, 2, 1, 6, 5, 7];
    let inorder = [1, 2, 4, 5, 6, 7];
    buildTree(preorder, inorder);
}

test();