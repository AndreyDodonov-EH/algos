import { Stack } from "@datastructures-js/stack";
import { vis_bstFromRoot, vis_bstFromRoot_dot } from "../../_helpers/vis/vis_bstFromRoot";
import { find } from "@hediet/debug-visualizer-data-extraction";

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


// return true if sum of any two elements equals to k
// two pointers directly on a tree?!
function findTarget(root: TreeNode | null, k: number): boolean {
    let leftStack: TreeNode[] = [];
    let rightStack: TreeNode[] = [];
    let leftRoot: TreeNode | null = root;
    let rightRoot: TreeNode | null = root;
    let wasUnder = true;
    let wasOver = true;
    while ((leftRoot || leftStack.length > 0)
        && (rightRoot || rightStack.length > 0)
    ) {
        if (wasUnder) { // touch only left root
            while (leftRoot) {
                leftStack.push(leftRoot);
                leftRoot = leftRoot.left;
            }
            leftRoot = leftStack.pop()!;
        }
        if (wasOver) { // touch only right root
            while (rightRoot) {
                rightStack.push(rightRoot);
                rightRoot = rightRoot.right;
            }
            rightRoot = rightStack.pop()!;
        }
        if (leftRoot!.val === rightRoot!.val) return false;
        const sum = leftRoot!.val + rightRoot!.val;
        if (sum < k) { // we need to increase left element;
            // if (wasOver) return false;
            wasUnder = true;
            wasOver = false;
            leftRoot = leftRoot!.right;
        } else if (sum > k) {
            // if (wasUnder) return false;
            wasOver = true;
            wasUnder = false;
            rightRoot = rightRoot!.left;
        } else {
            return true;
        }
    }
    return false;
}

function traverse(root: TreeNode | null) {
    if (!root) return;
    traverse(root.left);
    process.stdout.write(root.val + " ");
    traverse(root.right);
}

function traverseExplicitStack(root: TreeNode | null) {
    let stack: TreeNode[] = [];
    while(root || stack.length > 0) {
        while (root) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop()!;
        console.log(root.val);
        root = root.right;
    }
}

function traverseReverse(root: TreeNode | null) {
    if (!root) return;
    traverseReverse(root.right);
    process.stdout.write(root.val + " ");
    traverseReverse(root.left);
}

function traverseReverseExplicitStack(root: TreeNode | null) {
    let stack: TreeNode[] = [];
    while(root || stack.length > 0) {
        while(root) {
            stack.push(root);
            root = root.right;
        }
        root = stack.pop()!;
        console.log(root.val);
        root = root.left;
    }
}

function test() {
    const A = [-10,-23,19,-41,-18,5,39,-44,-34,-21,-11,-9,6,30,42,-45,null,-36,-32,null,null,-12,null,null,-4,null,8,20,37,40,49,-46,null,null,-35,-33,-31,-17,null,-7,1,null,15,null,24,null,38,null,null,43,null,-47,null,null,null,null,null,null,-26,null,-14,null,null,0,2,null,null,22,28,null,null,null,null,-48,null,-27,null,-16,-13,null,null,null,3,null,null,25,null,null,null,-29];
    const root = fromArrayLeetcode(A);
    vis_bstFromRoot_dot(root);
    const res = findTarget(root, -36);
    console.log(res);
    console.log();
}

test();


