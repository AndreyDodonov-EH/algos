import { visul } from "./visul"
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

function findNode(root: TreeNode | null, key: number): [parent: TreeNode | null, cur: TreeNode | null] {
    let parent: TreeNode | null = null;
    let cur: TreeNode | null = root;
    while (cur) {
        parent = cur;
        if (cur.val < key) {
            cur = cur.right;
        } else if (cur.val > key) {
            cur = cur.left
        } else {
            return [parent, cur];
        }
    }
    return [parent, cur];
}

function findMax(root: TreeNode) {
    while (root.right) {
        root = root.right;
    }
    return root;
}

function findMin(root: TreeNode) {
    while (root.left) {
        root = root.left;
    }
    return root;
}

function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    const [parent, nodeToBeDeleted] = findNode(root, key);
    // if node not found (0)
    if (!nodeToBeDeleted) {
        return root;
    }
    // if any child is null (1)
    if (!nodeToBeDeleted.left) { 
        if (!parent) return nodeToBeDeleted.right;
        parent.right = nodeToBeDeleted.right;
        return root;
    } else if (!nodeToBeDeleted.right) {
        if (!parent) return nodeToBeDeleted.left;
        parent.left = nodeToBeDeleted.left;
        return root;
    // node to be deleted has two children (2)
    } else {
        // find either max of the left subtree min of the right subtree (i.e. closest el by val)
        const min = findMin(nodeToBeDeleted.right);
        // delete that node (simple, will be case (1))
        deleteNode(min, min.val);
        // replace value of our target node with the value of actually deleted node
        nodeToBeDeleted.val = min.val;
    }
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
    let A = [5,3,6,2,4,null,7];
    const root = fromArray(A);
    visul(root);
    console.log();
}

test();

export {};