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
    let q = new Array<TreeNode>();
    let ans: TreeNode | null = null;
    if (root) {q.push(root); ans = root; } 
    let inv = false;
    while (q.length > 0) {
        const len = q.length;
        if (inv) {
            // inverse all values in the queue
            for(let i=0,j=len-1;i<j;i++,j--) {
                const tmp = q[i].val;
                q[i].val = q[j].val;
                q[j].val = tmp;
            }
        }
        for (let i=0;i<len;i++) {
            process.stdout.write(q[i].val + " ");
        }
        console.log("");
        for (let i=0; i<len;i++) {
            const el = q.shift()!;
            if (el.left) { q.push(el.left);}
            if (el.right) { q.push(el.right);}          
        }
        inv = !inv;
    }
    return ans;
};

function test() {
    let A = [4,2,7,1,3,6,9]
    let root = fromArrayLeetcode(A);
    const tree = vis_bstFromRoot_dot(root);
    const inv = reverseOddLevels(root);
    const invTree = vis_bstFromRoot_dot(inv);
}

test();