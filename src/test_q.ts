import {MaxPriorityQueue} from "./MaxPriorityQueue";

const q = new MaxPriorityQueue<string>();
q.insert("A", 3);
q.insert("B", 10);
q.insert("C", 10);
q.insert("D", 6);
q.insert("E", 4);
q.insert("F", 10);

q.remove("F");

// const totalSize = q.size();
// for (let i=0; i<totalSize; i++) {
//     console.log(q.extractFirst())
// }
