## 1. HEAP/HEAPSORT/PRIORITY_QUEUE 

    1. Implicit Data Structures (e.g. heap for heapsort / priority queu) 
    2. Unordered Removal (Swap'n'Pop) (to avoid shifting) 
    3. Inverse Index (for actual work, Map<T, idx> or Map<Handle<T>, idx> 
    4. Weak Invariant (el has to be smaller only than parent, no reqs for siblings) 
    5. Invariant Break Locality (we have to restore only part of the structure on operation)
    6. Batch Operations are cheaper (e.g. max-heapify is O(N) vs inserts by one O(NlgN)) 

## 2. Quicksort
- instability: unstable - because we swap non-adjacent elements without guarantees in-between

## 3. 

