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

function BFS(root: TreeNode | null) {
    const q = new Queue<TreeNode>();
    if (root) q.push(root);
    while (!q.isEmpty()) {
        const len = q.size()
        for (let i=0; i<len;i++) {
            const el = q.pop()!;
            process.stdout.write(el.val + " ");
            if (el.left) q.push(el.left);
            if (el.right) q.push(el.right);
        }
        console.log("");
    }
}


function invertBFS(root: TreeNode | null) {
    const q = new Deque<TreeNode>();
    let ans: TreeNode | null = null;
    if (root) {q.pushBack(root); ans = root; } 
    while (!q.isEmpty()) {
        const len = q.size()
        for (let i=0; i<len;i++) {
            const el = q.popBack()!;
            const tmp = el.right;
            if (el.left) { q.pushBack(el.left); el.right = el.left};
            if (tmp) { q.pushBack(tmp); el.left = tmp;}
        }
    }
    return ans;
}

function invertRec(root: TreeNode | null) {
    if (!root) return null;
    const tmp = root.right;
    root.right = invertRec(root.left);
    root.left = invertRec(tmp);
    return root;
}


function test() {
    let A = [4,2,7,1,3,6,9]
    let root = fromArrayLeetcode(A);
    const tree = vis_bstFromRoot_dot(root);
    const inv = invertRec(root);
    const invTree = vis_bstFromRoot_dot(inv);
}

test();