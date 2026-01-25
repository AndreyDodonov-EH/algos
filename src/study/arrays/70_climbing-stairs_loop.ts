function climbStairs(n: number): number {
    if (n==1) return 1;
    let a=1;
    let b=2;
    for (let i=2;i<n;i++) {
        const tmp = b;
        b = a+b;
        a = tmp;
    }
    return b;
};
