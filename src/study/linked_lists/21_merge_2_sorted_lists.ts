import { ListNode, fromArray, print } from "./_helpers";

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    const dummy = new ListNode();
    let tail = dummy;
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    if (list1 !== null) {
        tail.next = list1;
    } else if (list2 !== null) {
        tail.next = list2;
    }
    return dummy.next;
};

function test() {
    const list1 = fromArray([1, 2, 4]);
    const list2 = fromArray([1, 3, 4]);
    const merged = mergeTwoLists(list1, list2);
    print(merged);
}

test();
