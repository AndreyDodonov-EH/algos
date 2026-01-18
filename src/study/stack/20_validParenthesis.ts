function isValid(s: string): boolean {
    if (s.length%2) return false;
    let expected = new Array();
    for (let i=0;i<s.length;i++) {
        switch (s[i]) {
            case '(':
                expected.push(')');
            break;
            case ')':
                if (expected.pop() !== ')') return false;
            break;
             case '{':
                expected.push('}');
            break;
            case '}':
                if (expected.pop() !== '}') return false;
            break;
             case '[':
                expected.push(']');
            break;
            case ']':
                if (expected.pop() !== ']') return false;
            break;
        }
    }
    if (expected.length !== 0) return false;
    return true;
};

function test() {
//  let s = "([]";
// [(  \{()}\  [()])]

//  let s = "[({()}[()])]";
//  let s = "()[]{}";
//  let s = "([]";
let s= "[()[ [] ()  ]]";

 // []())
 const valid = isValid(s);
 console.log(valid);
}

test();
