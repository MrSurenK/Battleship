# Battleship Project Notes

1. Treatment of NodeList

   - Not an array!
   - can iterate over it with forEach
   - can be converted into an array with the method: **_Array.from_**

2. Math.random < 0.5 returns **_True or False_** with 50/50 chance

3. Why must horizontal check be done with a random Boolean?

4. Number method ensures that integar is returned

5. The "ReferenceError: document is not defined" error is thrown when the code tries to access the document object, but the object is not defined in the current scope. This error usually occurs when the code is running in a non-browser environment, such as in a Node.

   - When doing web development with Javascript just ignore Node

6. The conditional (ternary) operator is the only JavaScript operator that takes three operands: a condition followed by a question mark (?), then an expression to execute if the condition is truthy followed by a colon (:), and finally the expression to execute if the condition is falsy.
   1. condition ? exprIfTrue : exprIfFalse
