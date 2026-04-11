function countPaths(grid: number[][]) {
    const ROWS = grid.length;
    const COLS = grid[0].length;
    // const visited = new Set<number>();
    function key(r: number, c: number): number {
        return r*COLS + c;
    }
    function dfs(r: number, c: number) {
        // if (visited.has(key(r,c))) return 0;
        if (r<0 || c<0) return 0;
        if (r>=ROWS || c>=COLS) return 0;
        if ((r === ROWS-1) && (c === COLS-1)) return 1;
        if (1 === grid[r][c]) return 0;
        let cnt = 0;
        // visited.add(key(r,c));
        grid[r][c] = 1;
        cnt += dfs(r+1,c);
        cnt += dfs(r-1,c);
        cnt += dfs(r,c+1);
        cnt += dfs(r,c-1);
        grid[r][c] = 0;
        // visited.delete(key(r,c));
        return cnt;
    }
    return dfs(0,0);
}

function test() {
    const grid =   [[0,0,0,0],
                    [1,1,0,0],
                    [0,0,0,1],
                    [0,1,0,0]];
    const cnt = countPaths(grid);
    console.log(cnt);
}

test();