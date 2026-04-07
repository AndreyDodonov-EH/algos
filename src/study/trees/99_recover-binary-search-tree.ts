/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

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

/**
 Do not return anything, modify root in-place instead.
 */
function recoverTree(root: TreeNode | null): void {
    // 1. traverse inorder
    // 2. sort
    // 3. restore
    const nums: number[] = [];
    function inorder(root: TreeNode | null) {
        if (!root) return 
        inorder(root.left);
        nums.push(root.val);
        inorder(root.right);
    }
    nums.sort((a,b)=>(a-b));
    function build(root: TreeNode | null, l: number, r: number) {
        if (l>=r) return null;
        if (!root) return null;
        const m = l + Math.floor((r-l)/2);
        root.val = nums[m];
        build(root.left, l, m);
        build(root.right,m+1,r);
    }
    build(root, 0, nums.length);
};