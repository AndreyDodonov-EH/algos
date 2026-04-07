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

function morrisPreorder(root: TreeNode | null) {
    while (root) {
        if (root.left) {
            // find the rightmost child of the left subtree
            let lastInSubtree = root.left;
            while (lastInSubtree.right && lastInSubtree.right !== root) {
                lastInSubtree = lastInSubtree.right;
            }
            if (!lastInSubtree.right) { // we are in look ahead phase, no thread yet
                // create thread
                process.stdout.write(root.val.toString() + " ");
                lastInSubtree.right = root;
                root = root.left;
            } else { // we have travelled via thread and are in going back phase, lastInSubtree.right === root
                lastInSubtree.right = null;
                root = root.right;
            }
        } else { // if nothing on the left, just go right - similar to iterative stack approach
            // note: we will travel via thread here too!
            process.stdout.write(root.val.toString() + " ");
            root = root.right;
        }
    }
}

function morrisInorder(root: TreeNode | null) {
    while (root) {
        if (root.left) {
            // find the rightmost child of the left subtree
            let lastInSubtree = root.left;
            while (lastInSubtree.right && lastInSubtree.right !== root) {
                lastInSubtree = lastInSubtree.right;
            }
            if (!lastInSubtree.right) { // we are in look ahead phase, no thread yet
                // create thread
                lastInSubtree.right = root;
                root = root.left;
            } else { // we have travelled via thread and are in going back phase, lastInSubtree.right === root
                process.stdout.write(root.val.toString() + " ");
                lastInSubtree.right = null;
                root = root.right;
            }
        } else { // if nothing on the left, just go right - similar to iterative stack approach
            process.stdout.write(root.val.toString() + " ");
            // note: we will travel via thread here too!
            root = root.right;
        }
    }
}

function inorder(root: TreeNode | null) {
    if (!root) return;
    inorder(root.left);
    process.stdout.write(root.val.toString() + " ");
    inorder(root.right);
}

function preorder(root: TreeNode | null) {
    if (!root) return;
    process.stdout.write(root.val.toString() + " ");
    preorder(root.left);
    preorder(root.right);
}

function postorder(root: TreeNode | null) {
    if (!root) return;
    postorder(root.left);
    postorder(root.right);
    process.stdout.write(root.val.toString() + " ");
}

function test() {
    const A = [4,2,6,1,3,5,7];
    const root = fromArrayLeetcode(A);
    vis_bstFromRoot_dot(root);
    morrisPreorder(root); console.log();
    preorder(root); console.log();
    // inorder(root); console.log();
    // postorder(root); console.log(); // 1, 3, 2, 5, 7, 6, e
}

test();