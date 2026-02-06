function test() {
    let A=[1,2,3];
    let B=[1,2,3];
    console.log(A+B)
  // Arithmetic chaos
  console.log([] + []);           // "" (empty string)
  console.log([] + {});           // "[object Object]"
  console.log({} + []);           // "[object Object]" (or 0 in some consoles)
  console.log([] - []);           // 0
  
  // The classics
  console.log("5" - 3);           // 2 (string becomes number)
  console.log("5" + 3);           // "53" (number becomes string)
  console.log("5" - "3");         // 2
  console.log("5" * "3");         // 15
  
  // Boolean fun
  console.log(true + true);       // 2
  console.log(true + "false");    // "truefalse"
  console.log(true - false);      // 1
  
  // null vs undefined
  console.log(null + 1);          // 1 (null becomes 0)
  console.log(undefined + 1);     // NaN
  
  // Array coercion madness
  console.log([1] + [2]);         // "12"
  console.log([1] - [2]);         // -1
  console.log([1, 2] - [3, 4]);   // NaN
  
  // The legendary
  console.log((!+[]+[]+![]).length); // 9 (spells "falsefalse".length... wait, it's "truefalse")
  
  // Equality circus
  console.log([] == false);       // true
  console.log([] == ![]);         // true (both sides become 0)
  console.log(NaN === NaN);       // false (NaN is not equal to itself)
  
  // typeof lies
  console.log(typeof null);       // "object" (historic bug)
  console.log(typeof NaN);        // "number" (Not a Number is a number)
}

test();