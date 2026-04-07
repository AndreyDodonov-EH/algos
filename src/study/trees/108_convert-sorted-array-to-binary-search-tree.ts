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

function sortedArrayToBST(nums: number[]): TreeNode | null {
    let rooty: TreeNode | null = null;
    function divide(l: number, r: number): TreeNode | null {
        if (l>=r) return null;
        const m = l + Math.floor((r-l)/2);
        const root = new TreeNode(nums[m]);
        if (!rooty) rooty = root;
        root.left = divide(l, m);
        root.right = divide(m+1, r);
        return root;
    }
    return divide(0, nums.length);
};

function test() {
    const nums = [-10,-3,0,5,9];
    const root = sortedArrayToBST(nums);
    vis_bstFromRoot_dot(root);
}

test();