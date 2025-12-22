import {PriorityQueue} from "./PriorityQueue";

const q = new PriorityQueue<string>(true);

q.insert("A", 3);
q.insert("B", 10);
q.insert("C", 1);
q.insert("D", 7);
q.insert("E", 9);
q.insert("F", 4)

const totalSize = q.size();
for (let i=0; i<totalSize; i++) {
    console.log(q.extractFirst())
}
