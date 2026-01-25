function climbStairs(n: number, a=1,b=2): number {
    return (n==1) ? a : climbStairs(n-1,b,a+b);
};
