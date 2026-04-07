import { DoublyLinkedList, DoublyLinkedListNode } from "@datastructures-js/linked-list";

class ValueWithPrio {
    value: number;
    prio: DoublyLinkedListNode;
    constructor(value: number, prio: DoublyLinkedListNode) {
        this.value = value;
        this.prio = prio;
    }
}

class LRUCache {
    capacity: number;
    cache: Map<number, ValueWithPrio>;
    prios: DoublyLinkedList<number>;
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map<number, ValueWithPrio>();
        this.prios = new DoublyLinkedList<number>();
    }

    onUse(key: number) {
        const prio: DoublyLinkedListNode = this.cache.get(key)!.prio;
        if (prio.getPrev() === null) return; // it's already highest prio
        // swap with the first
        const crt = this.prios.remove(prio);
        this.prios.insertFirst(crt);
    }

    get(key: number): number {
        const valueWithPrio = this.cache.get(key);
        if (valueWithPrio !== undefined) {
            this.onUse(key);
            return valueWithPrio.value;
        }
        return -1;
    }

    put(key: number, value: number): void {
        if (this.cache.has(key)) {
            const valueWithPrio = this.cache.get(key)!;
            valueWithPrio.value = value;
            this.onUse(key);
            return;
        }
        if (this.cache.size === this.capacity) {
            const prioNode = this.prios.removeLast();
            this.cache.delete(prioNode.getValue());
        }
        this.prios.insertFirst(key);
        this.cache.set(key, new ValueWithPrio(value, this.prios.head()));
    }
}

function test() {
    const lRUCache = new LRUCache(2);
    console.log(lRUCache.put(1, 1)); // cache is {1=1}
    console.log(lRUCache.put(2, 2)); // cache is {1=1, 2=2}
    console.log(lRUCache.get(1));    // return 1
    console.log(lRUCache.put(3, 3)); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
    console.log(lRUCache.get(2));    // returns -1 (not found)
    console.log(lRUCache.put(4, 4)); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
    console.log(lRUCache.get(1));    // return -1 (not found)
    console.log(lRUCache.get(3));    // return 3
    console.log(lRUCache.get(4));    // return 4
}

test();

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */