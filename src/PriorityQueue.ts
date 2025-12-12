// import { vis_arrayAsHeap } from "./_vis";
type Entry<T> = { obj: T; prio: number; toString(): string };

function createEntry<T>(obj: T, prio: number): Entry<T> {
    return {obj, prio, toString: () => `(${obj},${prio})`};
}
 
export class PriorityQueue<T> {
    private _heap: Array<Entry<T>> = [];
    private _map: Map<T, number> = new Map();
    private readonly _virtualWorst: number;
    private readonly _virtualBest: number;
    private readonly _max: boolean;
    constructor(max: boolean) {
        this._max = max;
        this._virtualBest = max ? Infinity : -Infinity;
        this._virtualWorst = max ? -Infinity : Infinity;
    }
    // #region Public Interface
    public insert(obj: T, prio: number) {
        const e: Entry<T> = createEntry(obj, this._virtualWorst);
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
        const parentPrio = parentIdx < 0 ? this._virtualBest : this._heap[parentIdx].prio;
        this._heap[idx] = createEntry(obj, newPrio);
        if (this._isAbetterB(newPrio, parentPrio)) {
            this._floatUp(idx);
        } else if (this._isAbetterB(parentPrio, newPrio)) {
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
            let idxOfBest:number = idx;
            const leftIdx = 2*idx+1;
            const rightIdx = leftIdx+1;
            if (this._isAbetterB(this._heap[leftIdx].prio, this._heap[idxOfBest].prio)) {
                idxOfBest = leftIdx;
            }
            if (rightIdx<this._heap.length && 
                this._isAbetterB(this._heap[rightIdx].prio,this._heap[idxOfBest].prio)) {
                    idxOfBest = rightIdx;
            }
            if (idx == idxOfBest) {
                break;
            }
            this._swap(idx, idxOfBest);
            idx  = idxOfBest;
        }
    }
    private _floatUp(idx: number) {
        while (idx > 0) {
            const parentIdx = this._getParentIdx(idx);
            if (!this._isAbetterB(this._heap[idx].prio, this._heap[parentIdx].prio)) {
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
    private _isAbetterB(prioA: number, prioB: number) {
        return (this._max ? (prioA > prioB) : (prioA < prioB));
    }
    // #endregion Private Helpers
}