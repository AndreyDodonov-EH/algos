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

function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    let parent = new TreeNode(Infinity, root);
    let cur = parent.left;
    while (cur && cur.val !== key) {
        parent = cur;
        cur = (cur.val < key) ? cur.right : cur.left;
    }
    if (!cur) return root;
    if (!cur.left || !cur.right) {
        if (parent === null) return cur.left || cur.right;
        parent[(parent.left === cur) ? 'left':'right'] = cur.left || cur.right;
        return root;
    }
    let min = cur.right;
    let minParent = cur;
    while (min.left) {
        minParent = min;
        min = min.left;
    }
    deleteNode(minParent, min.val);
    cur.val = min.val;
    return root;
};

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

function dfs(root: TreeNode | null) {
    if (!root) {
        return;
    }
    dfs(root.left);
    // process.stdout.write(`${root.val} `);
    process.stdout.write(`${root.val}->${root.left?.val} `);
    process.stdout.write(`${root.val}->${root.right?.val} `);
    dfs(root.right);
}

function test() {
    let A = [50,30,70,null,40,60,80]
    const root = fromArray(A);
    const before = vis_bstFromRoot(root);
    const res = deleteNode(root, 40);
    const after = vis_bstFromRoot(res);
    console.log();
}

test();