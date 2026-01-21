import { ListNode, fromArray, addCycleTo, printCycled } from "./_helpers";

function detectCycle(head: ListNode | null): ListNode | null {
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
        if (fast === slow) {
            slow = head;
            while (slow !== fast) {
                slow = slow!.next;
                fast = fast!.next;
            }
            return slow;
        }
    }
    return null;
};


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
}

test();


