function fib(n: number,a=0,b=1): number {
    return n ? fib(n-1,b,a+b) : a;
};
