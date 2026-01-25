import { DoublyLinkedList, DoublyLinkedListNode } from "@datastructures-js/linked-list";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

interface HeapItem {
    nodeL: DoublyLinkedListNode;
    nodeR: DoublyLinkedListNode;
    sum: number;
    index: number; 
}

function minimumPairRemoval(nums: number[]): number {
    if (nums.length < 2) return 0;

    const list = new DoublyLinkedList<number>();
    
    // Map to track the original "index" (creation order) of nodes for tie-breaking.
    // Since we merge into the Left Node, a node's index remains a valid indicator of its relative position.
    const nodeIndices = new WeakMap<DoublyLinkedListNode, number>();

    nums.forEach((n, i) => {
        list.insertLast(n);
        // We know the last inserted node is the tail
        nodeIndices.set(list.tail()!, i);
    });

    // Priority Queue with Custom Comparator for Stability
    // 1. Primary: Sum (Ascending)
    // 2. Secondary: Index (Ascending) -> Process left-most pair first
    const pq = new MinPriorityQueue<HeapItem>({
        compare: (a, b) => {
            if (a.sum !== b.sum) return a.sum - b.sum;
            return a.index - b.index;
        }
    });

    let unsortedCnt = 0;
    let curr = list.head();
    
    while (curr && curr.getNext()) {
        const nextNode = curr.getNext(); 
        if (curr.getValue() > nextNode.getValue()) {
            unsortedCnt++;
        }
        pq.enqueue({
            nodeL: curr,
            nodeR: nextNode,
            sum: curr.getValue() + nextNode.getValue(),
            index: nodeIndices.get(curr)!
        });

        curr = nextNode;
    }

    let opCnt = 0;

    const isViolation = (
        n1: DoublyLinkedListNode | null, 
        n2: DoublyLinkedListNode | null
    ): number => {
        if (!n1 || !n2) return 0;
        return n1.getValue() > n2.getValue() ? 1 : 0;
    };

    while (unsortedCnt > 0) {
        if (pq.isEmpty()) break; 

        const { nodeL, nodeR, sum } = pq.dequeue()!;

        if (nodeL.getNext() !== nodeR || nodeR.getPrev() !== nodeL) {
            continue;
        }

        if (nodeL.getValue() + nodeR.getValue() !== sum) {
            continue;
        }

        const farLeft = nodeL.getPrev();
        const farRight = nodeR.getNext(); 

        unsortedCnt -= isViolation(farLeft, nodeL);
        unsortedCnt -= isViolation(nodeL, nodeR);
        unsortedCnt -= isViolation(nodeR, farRight);

        opCnt++;
        nodeL.setValue(sum);
        list.remove(nodeR); 

        unsortedCnt += isViolation(farLeft, nodeL);
        unsortedCnt += isViolation(nodeL, farRight); 

        // Refill Heap with Correct Indices
        if (farLeft) {
            pq.enqueue({
                nodeL: farLeft,
                nodeR: nodeL,
                sum: farLeft.getValue() + nodeL.getValue(),
                index: nodeIndices.get(farLeft)!
            });
        }

        if (farRight) {
            pq.enqueue({
                nodeL: nodeL,
                nodeR: farRight,
                sum: nodeL.getValue() + farRight.getValue(),
                // nodeL keeps its original index
                index: nodeIndices.get(nodeL)! 
            });
        }
    }

    return opCnt;
}
