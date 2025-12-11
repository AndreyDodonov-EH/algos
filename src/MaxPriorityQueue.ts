export class MaxPriorityQueue<T> {
    // 1. constructor: nothing really needed
    constructor() {
    }

    // 2. operations: insert, remove, changePrio, getFirst, extractFirst

    insert(el: T, prio: number) {
        console.log("Inserting " + el + " at prio " +  prio);
        this._heap.push({prio: prio, el: el});
        this._map.set(el, this._heap.length - 1);
        this.changePrio(el, prio); // will always float up
        console.log(this._heap);
        console.log(this._map)
    }

    remove(el: T): boolean {
        if (!this._map.has(el)) {
            return false;
        }
        const idx: number = this._map.get(el)!; 
        this._swap(idx, this._heap.length-1);
        this._heap.pop();
        this._map.delete(el);
        if (idx >= this._heap.length) {
            return true;
        }
        console.log(`removed element replaced with ${this._heap[idx].prio}`)
        this.changePrio(this._heap[idx].el, this._heap[idx].prio);
        return true;
    }

    changePrio(el: T, newPrio: number) {
        if (!this._map.has(el)) {
            throw "No such element in the queue";
        }
        const idx = this._map.get(el)!;
        const parentIdx = this._getParentIdx(idx);
        if (parentIdx < 0) { // we are root
            this._heap[0] = {el: el, prio: newPrio};
            this._floatDown(idx);
            return;
        }
        const parentPrio: number = this._heap[parentIdx].prio;
        this._heap[idx] = {el: el, prio: newPrio};
        if (newPrio > parentPrio) {
            this._floatUp(idx);
        } else if (newPrio < parentPrio) {
            this._floatDown(idx);
        } else {
            // do nothing
        }
    }

    getFirst(): T {
        return this._heap[0].el;
    }

    extractFirst(): T {
        const firstEl = this.getFirst();
        this.remove(firstEl);
        return firstEl;
    }

    size(): number {
        return this._heap.length;
    }

    private _heap:Array<{prio: number, el: T}> = [];
    private _map:Map<T, number> = new Map();

    private _getParentIdx(i: number) {
        return Math.floor((i-1)/2);
    }

    private _swap(i:number, j:number) {
        this._map.set(this._heap[i].el, j);
        this._map.set(this._heap[j].el, i);
        const tmp = this._heap[i];
        this._heap[i] = this._heap[j];
        this._heap[j] = tmp;
    }

    // for floating values up, a.k.a. bubbleUp
    private _floatUp(i:number): number {
        console.log("Floating up idx " + i);
        let parentIdx = this._getParentIdx(i);
        while(parentIdx >= 0 && this._heap[i].prio > this._heap[parentIdx].prio) {
            this._swap(i, parentIdx);
            i = parentIdx;
            parentIdx = this._getParentIdx(i);
        }
        return i;
    }

    // for floating values down, a.k.a. MAX-HEAPIFY
    private _floatDown(i:number) {
        while (i<Math.floor(this._heap.length/2)) {
            // find if any children is larger than the parent
            // if yes, swap with the largest child
            let idxOfLargest = i;
            let leftIdx = 2*i+1;
            let rightIdx = leftIdx+1;
            if (this._heap[leftIdx].prio > this._heap[idxOfLargest].prio) {
                idxOfLargest = leftIdx;
            }
            if (rightIdx < this._heap.length 
                    && this._heap[rightIdx].prio > this._heap[idxOfLargest].prio) {
                idxOfLargest = rightIdx
            }
            if (i == idxOfLargest) {
                break;
            }
            this._swap(i, idxOfLargest);
            i = idxOfLargest;
        }
    }
}
