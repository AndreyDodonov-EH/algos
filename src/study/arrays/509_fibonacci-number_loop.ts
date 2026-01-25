function fib(n: number,a=0,b=1): number {
    if (n<=1) {
    return n;
}
let f = 0;
let s = 1;
for (let i=2;i<=n;i++) {
    const tmp = f;
    f = s;
    s = s+tmp;
}
return s;
};
