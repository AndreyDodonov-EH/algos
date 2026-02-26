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

function traverse(preorder: number[], inorder: number[], l: number, r: number, parent: TreeNode, left: boolean) {
    const val = preorder[0];
    const newNode = new TreeNode(val);
    if (left) parent.left = newNode;
    else parent.right = newNode;
    const graph = vis_bstFromRoot(root);
    const m = inorder.indexOf(val);
    traverse(preorder, inorder, l, m, newNode, true);
    traverse(preorder, inorder, m, r, newNode, false);
}

let root: TreeNode | null = null;

function buildTree(preorder: number[], inorder: number[]) {
    // take first element from from preorder
    const val = preorder[0];
    // write it
    root = new TreeNode(val);
    // find it in inorder
    const m = inorder.indexOf(val);
    traverse(preorder, inorder, 1, m, root, true);
    traverse(preorder, inorder, m+1,inorder.length, root, false)
};

function test() {
    let preorder = [4, 2, 1, 6, 5, 7];
    let inorder = [1, 2, 4, 5, 6, 7];
    buildTree(preorder, inorder);
}

test();