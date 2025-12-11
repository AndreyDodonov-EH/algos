type Entry<T> = { obj: T; prio: number };
 
export class MinPriorityQueue<T> {
    // ToDo: debug with Debug Visualizer
    private _heap: Array<Entry<T>> = [];
    private _map: Map<T, number> = new Map();
    // #region Public Interface
    public insert(obj: T, prio: number) {
        const e: Entry<T> = {obj:obj, prio:Infinity};
        this._heap.push(e);
        this._map.set(obj, this._heap.length - 1);
        this.changePrio(obj, prio);
    }
    public remove(obj: T): boolean {
        
        if (!this._map.has(obj)) {
            return false;
        }
        const idx: number = this._getIdx(obj);
        if (idx == this._heap.length-1) {
            this._heap.pop();
            this._map.delete(obj);
            return true;
        }
        const last: Entry<T> = this._heap[this._heap.length-1];
        this._swap(idx, this._heap.length-1);
        this._heap.pop();
        this._map.delete(obj);
        this.changePrio(last.obj, last.prio);
        return true;
    }
    public getFirst(): T | undefined {
        if (this._heap.length == 0) {
            return undefined;
        }
        return this._heap[0].obj;
    }
    public extractFirst(): T | undefined {
        const first: T | undefined = this.getFirst();
        if (first === undefined) {
            return undefined;
        }
        this.remove(first);
        return first;
    }
    public changePrio(obj: T, newPrio: number) {
        const idx = this._getIdx(obj);
        const parentIdx = this._getParentIdx(idx);
        const parentPrio = parentIdx < 0 ? -Infinity : this._heap[parentIdx].prio;
        this._heap[idx] = {obj:obj, prio:newPrio};
        if (newPrio < parentPrio) {
            this._floatUp(idx);
        } else if (newPrio > parentPrio) {
            this._floatDown(idx);
        } else {
            // do nothing
        }
    }
    public size() {
        return this._heap.length;
    }
    // #endregion Public Interface

    // #region Private Helpers
    private _floatDown(idx: number) {
        const lastParentIdx = this._getLastParentIdx();
        while (idx<=lastParentIdx) {
            let idxOfSmallest:number = idx;
            const leftIdx = 2*idx+1;
            const rightIdx = leftIdx+1;
            if (this._heap[leftIdx].prio < this._heap[idxOfSmallest].prio) {
                idxOfSmallest = leftIdx;
            }
            if (rightIdx<this._heap.length && 
                this._heap[rightIdx].prio < this._heap[idxOfSmallest].prio) {
                    idxOfSmallest = rightIdx;
            }
            if (idx == idxOfSmallest) {
                break;
            }
            this._swap(idx, idxOfSmallest);
            idx  = idxOfSmallest;
        }
    }
    private _floatUp(idx: number) {
        while (idx > 0) {
            const parentIdx = this._getParentIdx(idx);
            if (this._heap[parentIdx].prio <= this._heap[idx].prio) {
                break;
            }
            this._swap(parentIdx, idx);
            idx = parentIdx;
        }
    }
    private _getIdx(obj: T) {
        if (!this._map.has(obj)) throw "No such element";
        return this._map.get(obj)!;
    }
    private _getParentIdx(idx: number) {
        return Math.floor((idx-1)/2);
    }
    private _getLastParentIdx() {
        // same as get parent for last idx,
        // i.e. Math.floor((len-1-1)/2)
        return Math.floor(this._heap.length/2)-1;
    }
    private _swap(i: number, j: number) {
        
        this._map.set(this._heap[i].obj, j);
        this._map.set(this._heap[j].obj, i);
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    // #endregion Private Helpers
}