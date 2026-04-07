import { vis_bstFromRoot_dot } from "../../_helpers/vis/vis_bstFromRoot";
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

function fromArrayLeetcode(A: (number | null)[]): TreeNode | null {
    if (A.length === 0 || A[0] === null) return null;
    const root = new TreeNode(A[0]);
    const queue: Queue<TreeNode> = new Queue<TreeNode>();
    queue.push(root);
    let i = 1;
    while (i < A.length) {
        const node = queue.pop()!;
        if (A[i] !== null) {
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

function bst(root: TreeNode | null) {
    const q: Queue<TreeNode> = new Queue<TreeNode>();
    if (root) q.push(root);
    while(q.size() > 0) {
        const crt: TreeNode = q.pop()!;
        process.stdout.write(crt.val + ",");
        if (crt.left) q.push(crt.left);
        if (crt.right) q.push(crt.right);
    }
    console.log();
}

function serialize(root: TreeNode | null): string {
    // level by level, BST
    // put null (x) only only in the first level where it's present
    let q: Queue<TreeNode | null> = new Queue<TreeNode | null>();
    let res: string = "";
    if (root) {
        q.push(root);
    }
    while(q.size() > 0) {
        root = q.pop();
        if (root) {
            res += root.val + ",";
            q.push(root.left);
            q.push(root.right);
        } else {
            res += "x"+",";
        }
    }
    // trim trailing
    let trimPos = res.length-1;
    while(trimPos>0 && res[trimPos-1] === "x") {
        trimPos-=2;
    }
    res = res.slice(0, trimPos+1);
    return res;
};

function createNode(data: string, pos: number): [number | null, number] {
    const nextComma = data.indexOf(",",pos);
    const val = data.slice(pos, nextComma);
    const nextPos = nextComma === - 1 ? -1 : nextComma + 1;
    if ("x" === val) return [null, nextPos];
    else return [Number(val), nextPos];
}

function deserialize(data: string): TreeNode | null {
    if (0 === data.length) return null;
    let arr = new Array<number | null>();
    let posInStr: number = 0;
    let val: number | null = 0;
    while(posInStr < data.length && posInStr !== -1) {
        [val, posInStr] = createNode(data, posInStr);
        arr.push(val);
    }
    if (0 === arr.length || null === arr[0]) {
        return null;
    }
    const root = new TreeNode(arr[0]);
    const q = new Queue<TreeNode>();
    q.push(root);
    let i = 1;
    while (q.size() > 0) {
        const crt: TreeNode = q.pop()!;
        if (i < arr.length && arr[i] !== null) {
            crt.left = new TreeNode(arr[i]!);
            q.push(crt.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            crt.right = new TreeNode(arr[i]!);
            q.push(crt.right);
        }
        i++;
    }
    return root;
}



function buildPostorder(root: TreeNode | null): number[] {
    const res: number[] = [];
    function postorder(root: TreeNode | null) {
        if (!root) return;
        postorder(root.left);
        postorder(root.right);
        res.push(root.val);
    }
    postorder(root);
    return res;    
}

function buildPreorder(root: TreeNode | null): number[] {
    const res: number[] = [];
    function preorder(root: TreeNode | null) {
        if (!root) return;
        res.push(root.val);
        preorder(root.left);
        preorder(root.right);
    }
    preorder(root);
    return res;
}

function constructFromPostorder(A: number[]): TreeNode | null {
    if (0 === A.length) return null;
    let i = A.length-1;
    function build(l: number, r: number): TreeNode | null {
        if (i<0 || A[i] < l || A[i] > r) return null;
        const root = new TreeNode(A[i]);
        i--;
        root.right = build(root.val, r);
        root.left = build(l, root.val);
        return root;
    }
    return build(-Infinity, Infinity);
}

function constructFromPreorder(A: number[]): TreeNode | null {
    if (0 === A.length) return null;
    let i = 0;
    function build(l: number, r: number): TreeNode | null {
        if (i>=A.length || A[i]<l || A[i]>r) return null;
        const root = new TreeNode(A[i]);
        i++;
        root.left = build(l, root.val);
        root.right = build(root.val, r);
        return root;
    }
    return build(-Infinity, Infinity);
}

function serializeDFSPreorder(root: TreeNode | null): (number | null)[] {
    // preorder dfs including nulls
    let res: (number | null)[] = [];
    function dfs(root: TreeNode | null) {
        res.push(root ? root.val : null);
        if (!root) return;
        dfs(root.left);
        dfs(root.right);
    }
    dfs(root);
    return res;
}

function deserializeDFSPreorder(A: (number | null)[]): TreeNode | null {
    // preorder dfs iterating from left to right on array
    if (0 === A.length) return null;
    let i = 0;
    function build() : TreeNode | null {
        if (null === A[i]) {i++; return null;}
        const root = new TreeNode(A[i]!);
        i++;
        root.left = build();
        root.right = build();
        return root;
    }
    return build();
}


function test() {
    // const A = [10, 5,11, 3,6,null,13, 2,4,null,null,12,null];
    // const A = [2, 1, 3];
    const A = [1, 2,5, 3,4];
    const root = fromArrayLeetcode(A);
    vis_bstFromRoot_dot(root);
    const res = serializeDFSPreorder(root);
    console.log(res);
    const restored = deserializeDFSPreorder(res);
    vis_bstFromRoot_dot(restored);

    // const preorderArray = buildPreorder(root);
    // const restored = constructFromPreorder(preorderArray);
    // vis_bstFromRoot_dot(restored);
    // const root = fromArrayLeetcode(A);
    // postorder(root);
    // vis_bstFromRoot_dot(root);
    // const str = serialize(root);
    // const newRoot = deserialize(str);
    // vis_bstFromRoot_dot(newRoot);
}

test();