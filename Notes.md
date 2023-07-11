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

7. .every method | Returns a true or false and check if all elements in the array pass the given function
8. classList.contains(" ") checks the class of the element. Returns true or false
9. shipTile is an item in the array of shipOnBoard
10. The **_dragstart event_** is fired when the user starts dragging an element or text selection.
11. In javascript return { example1, example 2 } means you are returning an object with the same key value pair such as example 1 = example 1 etc,
    1. Every data type and function is an object in javascript ES6
