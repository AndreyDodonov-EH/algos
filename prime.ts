function isPrime(n: number): boolean {
    let primes: number[] = [2, 3, 5, 7, 11, 13, 17, 19];
    let l = 0;
    let r = primes.length;
    while (l<r) {
        const m = l + Math.floor((r-l)/2);
        console.log(`l: ${l}; m: ${m}, r: ${r}`)
        if (primes[m] === n) return true;
        if (primes[m] < n) l = m + 1;
        else r = m;
    }
    return false;
}

console.log(isPrime(1));
console.log(isPrime(2));
console.log(isPrime(3));
console.log(isPrime(4));
console.log(isPrime(10));
