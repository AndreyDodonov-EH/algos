export class MaxPriorityQueue<T> {

    private _heap:Array<{prio: number, el: T}> = [];
    private _map:Map<T, number> = new Map();

    // #region Public Methods
    public insert(el: T, prio: number) {
        console.log("Inserting " + el + " at prio " +  prio);
        this._heap.push({prio: -Infinity, el: el});
        this._map.set(el, this._heap.length - 1);
        this.changePrio(el, prio); // will always float up
        console.log(this._heap);
        console.log(this._map)
    }

    public remove(el: T): boolean {
        if (!this._map.has(el)) {
            return false;
        }
        const idx: number = this._map.get(el)!;
        if (idx == this._heap.length -1) {
            this._heap.pop();
            this._map.delete(el);
            return true;
        }
        this._swap(idx, this._heap.length-1);
        this._heap.pop();
        this._map.delete(el);
        this.changePrio(this._heap[idx].el, this._heap[idx].prio);
        return true;
    }

    public changePrio(el: T, newPrio: number) {
        if (!this._map.has(el)) {
            throw "No such element in the queue";
        }
        const idx = this._map.get(el)!;
        const parentIdx = this._getParentIdx(idx);
        const parentPrio: number = parentIdx < 0 ? Infinity : this._heap[parentIdx].prio;
        this._heap[idx] = {el: el, prio: newPrio};
        if (newPrio > parentPrio) {
            this._floatUp(idx);
        } else if (newPrio < parentPrio) {
            this._floatDown(idx);
        } else {
            // do nothing
        }
    }

    public getFirst(): T {
        return this._heap[0].el;
    }

    public extractFirst(): T {
        const firstEl = this.getFirst();
        this.remove(firstEl);
        return firstEl;
    }

    public size(): number {
        return this._heap.length;
    }

    // #endregion

    // #region Floating
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

    // #endregion

    // #region Helpers
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
    // #endregion
}
