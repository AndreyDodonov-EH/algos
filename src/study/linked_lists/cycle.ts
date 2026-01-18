import { ListNode, fromArray } from "./_helpers";

function printCycled(head: ListNode|null) {
    // brute force cycle detection
    let A: Array<ListNode|null> = [];
    while (head) {
        const idx = A.indexOf(head);
        if (idx !== -1) {
            console.log(`to ${A[idx]!.val} (idx ${idx})`);
            return;
        }
        A.push(head);
        process.stdout.write(head.val.toString() + " ");
        head = head.next;
    }
}


function addCycleTo(head: ListNode | null, idx: number) {
    let cycleTarget = head;
    let i=0;
    for (i;i<idx;i++) {
        cycleTarget = cycleTarget?.next!;
    }
    let cur = cycleTarget;
    while (cur!.next !== null) {
        cur = cur?.next!;
    }
    cur!.next = cycleTarget;
}

// ToDo: copy from Leetcode

function detectCycle(head: ListNode | null): ListNode | null {
    if (head === null) {
        return null;
    }
    let slow = head;
    let fast = head?.next;
    let slowDistance = 0;
    let fastDistance = 0;
    while (fast && fast.next) {
        if (fast === slow) {
            process.stdout.write(`[s: ${slow.val},f: ${fast.val}] `);
            break;
        }
        slow = slow.next!;
        fast = fast.next.next;
        slowDistance+=1;
        fastDistance+=2;
    }
    if (fast != slow) {
        return null;
    }
    process.stdout.write(`sd: ${slowDistance},fd: ${fastDistance}`)
    const dummyHead = new ListNode(0, head);
    slow = dummyHead;
    while (slow !== fast) {
        slow = slow.next!;
        fast = fast?.next!;
    }
    return slow;
}

function test() {
    const n = 10;
    for (let i=5;i<n;i++) {
        process.stdout.write(`${i}: `);
        const A = [0,1,2,3,4,5,6,7,8,9];
        const head = fromArray(A);
        addCycleTo(head, i);
        printCycled(head);
        const ans = detectCycle(head);
        console.log(ans);
    }
    // printCycled(head);
    // console.log(ans);
}

test();


