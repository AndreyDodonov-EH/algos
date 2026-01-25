function countStudents(students: number[], sandwiches: number[]): number {
    let lovers = [0, 0];
    for (let s of students)
        lovers[s]++;
    for (let i=0;i<sandwiches.length && lovers[0]>=0 && lovers[1]>=0;i++)
        lovers[sandwiches[i]]--;
    return Math.max(lovers[0],lovers[1]);
}
