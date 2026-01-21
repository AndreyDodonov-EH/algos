import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { ListNode, fromArray, print } from "./_helpers";

function prepare_input() {
    const lists: Array<ListNode | null> = [];
    const input = [[1,2,5], [0, 3, 5]];
    for (let i=0;i<input.length;i++) {
        const head = fromArray(input[i]);
        lists.push(head);
    }
    return lists;
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const dummy = new ListNode();
    let tail = dummy;
    const minPQ = new MinPriorityQueue<number>();
    for (let l of lists) {
        while(l) {
            minPQ.enqueue(l.val);
            l = l.next;
        }
    }
    while (!minPQ.isEmpty()) {
        tail.next = new ListNode(minPQ.dequeue()!);
        tail = tail.next;
    }
    tail.next = null;
    return dummy.next;
};

function test() {
    const lists = prepare_input();
    for (let i=0;i<lists.length;i++){
        print(lists[i]);
        console.log();
    }
    const merged = mergeKLists(lists);
    print(merged);
}

test();
