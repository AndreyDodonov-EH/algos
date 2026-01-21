import { ListNode, print, fromArray } from "./_helpers";


// we need to create descending list, for that we need to go from the end

// head.next !== null is needed only for the last element:
// the last element is always present - it has nothing to it's right

// then we compare element of the built invariant of ascending list
// (at first consisting just of the last element)
// and current elements on the stack
// if current element on the stack is smaller, we skip it to preserve invariant
// otherwise we include it
// once stack is exhausted, we return the biggest element effectively

function removeNodes(head: ListNode|null): ListNode|null {
    if (head === null) {
        return null;
    }
    head.next = removeNodes(head.next);

    if (head.next !== null && head.val < head.next.val) {
        return head.next;
    }
    return head;
}

function test() {
    let A = [5,2,13,3,8];
    const head = fromArray(A);
    print(head);
    const resultHead = removeNodes(head);
    print(resultHead);

    let i =0;
    for(;i<10;i++) {
        if (i==5) {
            break;
        }
    }
    console.log(i);
    
}

test();
