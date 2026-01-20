class ListNode {
    constructor(public val: string,
        public next: ListNode|null = null, public prev: ListNode|null = null) {}
}
class BrowserHistory {
    constructor(homepage: string) {
        this.head = new ListNode(homepage);
        this.crt = this.head;
    }
    private head: ListNode;
    private crt: ListNode;
    visit(url: string): void {
        this.crt.next = new ListNode(url, null, this.crt);
        this.crt = this.crt.next;
    }
    back(steps: number): string {
        for (let i=0;i<steps && this.crt !== this.head;i++) {
            this.crt = this.crt.prev!;
        }
        return this.crt.val;
    }
    forward(steps: number): string {
        for (let i=0;i<steps && this.crt.next !== null;i++) {
            this.crt = this.crt.next;
        }
        return this.crt.val;
    }
}


function test() {
    const h = new BrowserHistory("leetcode.com");
    h.visit("google.com");
    h.visit("facebook.com");
    h.visit("youtube.com");
    console.log(h.back(1));
    console.log(h.back(1));
    console.log(h.forward(1));
}

test();
