import { Queue } from "@datastructures-js/queue";

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

function fromArray(A: (number | null)[]): TreeNode | null {
    const n = A.length;
    const nodes = new Array<TreeNode | null>(n);
    for (let i=0;i<n;i++) {
        nodes[i] = (A[i] === null) ? null : new TreeNode(A[i]!);
    }
    for (let i=0;i<n;i++) {
        if (nodes[i] !== null) {
            nodes[i]!.left = (1+2*i < n) ? nodes[1+2*i] : null;
            nodes[i]!.right = (2+2*i < n) ? nodes[2+2*i] : null;
        }
    }
    return nodes[0];
}

function levelOrder(root: TreeNode | null): number[][] {
    let res = [];
    const q = new Queue<TreeNode | null>();
    q.enqueue(root);
    let crtArray = new Array<number>();
    let nextLevelElement = null;
    while (!q. isEmpty()) {
        const el = q.dequeue();
        if (el == nextLevelElement) {
            res.push(crtArray);
            crtArray = new Array<number>();
        }
        if (el) crtArray.push(el.val);
        if (el?.left)  {
            q.enqueue(el.left)
            nextLevelElement = el.left;
        }
        if (el?.right) {
            q. enqueue(el.right)
            if (nextLevelElement === null || nextLevelElement !== el.left)
                nextLevelElement = el.right;
        }
    }
    if (crtArray.length !== 0) res.push(crtArray);
    return res;
}

function test() {
    let A = [1, null, 2];
    let root = fromArray(A);
    const res = levelOrder(root);
    console.log(res);
}

test();