import { ListNode, print, fromArray } from "./_helpers";


// return a new linked list without nodes which have nodes with values bigger than they are on the right
// So, we need a descending list
// we don't know what's ahead of us, so to maintain invariant, we:
// 1. reverse it
// 2. build ascending list
// 3. reverse the result

function reverse(head: ListNode|null): ListNode|null {
   let prev = null;
   let cur = head;
   while (cur !== null) {
       const tmpNext = cur.next;
       cur.next = prev;
       prev = cur;
       cur = tmpNext;
   }
   return prev;
}

function removeNodes(head: ListNode|null): ListNode|null {
   if (head === null) {
       return null;
   }
   const end = reverse(head)!;
   // skip small elements
   let cur = end;
   while (cur !== null && cur.next !== null) {
      if (cur.next.val < cur.val) {
           cur.next = cur.next.next;
      } else {
           cur = cur.next;
      }
   }
   return reverse(end);
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
