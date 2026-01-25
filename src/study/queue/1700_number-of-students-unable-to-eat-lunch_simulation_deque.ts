import { Deque } from "@datastructures-js/deque";

function countStudents(students: number[], sandwiches: number[]): number {
    const deque = new Deque(students);
    let unhappy = 0;
    let i=0;
    while(unhappy < deque.size()) {
        const pref = deque.popFront()!;
        if (sandwiches[i] === pref) {
            unhappy = 0;
            i++;
        } else {
            deque.pushBack(pref);
            unhappy++;
        }
    }
    return unhappy;  
};
