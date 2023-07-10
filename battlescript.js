// --Rotate ships feature-- //

// Get the shipyard container holding all the ships into a variable //
const shipyardContainer = document.querySelector(".shipyard-container");

// Get the rotate button into a variable //
const rotateButton = document.querySelector("#rotate-ship");

// Angle variable allows for toggle rotate feature
let angle = 0;
function rotate() {
  // Get hold of all the ships
  //element.children to get all the child element of the shipyard div > the ships
  // array.from converts the HTML collection into an array
  const shipOptions = Array.from(shipyardContainer.children);
  //if angle is 0 set angle to 90. If angle is 90 set angle back to 0
  angle = angle === 0 ? 90 : 0;
  //Loop through the array of ships and apply the transform CSS to each to rotate the ships.
  shipOptions.forEach((eachShip) => {
    eachShip.style.transform = `rotate(${angle}deg)`;
  });
}

// const shipOptions = shipyardContainer.children;
// console.log(shipOptions);

//Higher order event listener calling the rotate function defined above
rotateButton.addEventListener("click", rotate);

// --Gameboard creation-- //

// Get the gameboards container
const gameBoardsContainer = document.querySelector("#gameboards-container");
// Board width is 10
const width = 10;

function createBoard(color, user) {
  // Create div for a game board and append both player and cpu gameboards //
  const board = document.createElement("div");
  board.classList.add("game-board");
  board.style.backgroundColor = color;
  gameBoardsContainer.append(board);
  // User as an input to differentiate game boards to make it easier to target boards for functionality//
  board.id = user;

  // Create the game tiles //

  // Creating a 100 divs with the for loop below //
  for (let i = 0; i < width * width; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    // Give each tile an ID //
    tile.id = i;
    board.append(tile);
  }
}

// Call Gameboard function twice to create 2 boards: 1 for player and 1 for computer
// Input a string for the color
createBoard("#6699CC", "player");
createBoard("#6699CC", "computer");

// Battleship Object Creation //
class Ship {
  construction(name, length) {
    this.name = name;
    this.length = length;
  }
}

//Initiaite each battleship type into new object class//
const destroyer = new Ship("destroyer", 2);
const cruiser = new Ship("cruiser", 3);
const submarine = new Ship("submarine", 3);
const battleship = new Ship("battleship", 4);
const aircraft_carrier = new Ship("aircraft_carrier", 5);

// AI/Computer component

// Place object into an array for computer to generate into its board //
const shipsArray = [
  destroyer,
  cruiser,
  submarine,
  battleship,
  aircraft_carrier,
];

// To Do: (21/03/2023) 43:18

// Function to place the ships //
// Edge case: Ship object length is too long for the board horizontally and vertically (Requires check for space on board!)
function placeShip(ship) {
  const allBoardTiles = document.querySelectorAll("#computer div");
  // console.log(allBoardTiles);
  // Create ship orientation, horizontal or vertical
  // trueOrFalse returms a random boolean
  let RandomTrueOrFalse = Math.random() < 0.5; // Makes it 50% chance of true or False
  let horizontalShip = RandomTrueOrFalse; //if true then ship will be placed horizontally on the board
  // Creates a random index for computer to start placing its ship on
  let randomStartIndex = Math.floor(Math.random() * width * width);
  console.log(randomStartIndex);

  // Edge case 1: Not enought tiles on the board for the ship at the ends. After adding up the ship length the ship is longer than the board width (eg random index starts at index 98 + ship length of 5 = index 100 to 113 out of range) but board only has 100 divs  55:30//

  // Check horizontal and vertical validity using ternary operator
  // condition ? exprIfTrue : exprIfFalse
  // if ship is horizontal check to see if the start index is samller than 100 - the ship length
  // if the above is true then just return the randomStartIndex and go as per normal
  // if not true then return 100 - ship length as starting index in validStart variable
  let validStart = horizontalShip
    ? randomStartIndex <= width * width - ship.length
      ? randomStartIndex
      : width * width - ship.length
    : // if verticle width * ship.length to check the squares under it and if not true manipulate it to add 10 (UNDERSTAND THIS!)
    // No issue with negative numbers because vertically i adds downwards. We are solving the issue of the board below running out of divs so we are concerned with div 50 onwards
    randomStartIndex <= width * width - width * ship.length
    ? randomStartIndex
    : randomStartIndex - ship.length * width + width;

  let shipsOnBoard = [];

  // for loop to determine the position of the ship on the board
  // i will only range from 1 to 5 as defined in class for the Ships
  for (let i = 0; i < ship.length; i++) {
    // if statement to identify the divs that the ship will take up within the board
    // Picks the next few tiles from the random first pick according to ship length and pushes into shipsOnBoard array
    if (horizontalShip) {
      shipsOnBoard.push(allBoardTiles[Number(validStart) + i]); //***NOT CONSOLE.LOGGING!*** or ***NOT BEING ADDED TO shipsOnBoard array***/
      // This means that the the ship is verticle.
    } else {
      // Instead of adding to the div with the next index number, will add to the div (i * width) index number away. Which should bne directly below the first random div index making the ship verticle. (Loop logic commented below)
      // 0 * 10 = 0
      // 1 * 10 = 10
      // 2 * 10 = 20
      // 3 * 10 = 30 .... so on and so forth
      // Since the gameboard is 10 x 10. Every 10 numbers will end up directly below the first!
      shipsOnBoard.push(allBoardTiles[Number(validStart) + i * width]);
    }
  }
  console.log(shipsOnBoard); //***NOT CONSOLE.LOGGING!*** or ***NOT BEING ADDED TO shipsOnBoard array***/

  // Edge case 2: Ships overlapping each other and splitting at the ends 55:00

  // Coloring of the tiles taken up by the ship. Identified via the shipsOnBoard array.
  shipsOnBoard.forEach((ship) => {
    shipsOnBoard.classlist.add(ship.name);
    // This indicates that the tile has been taken so there wont be overlaps
    shipsOnBoard.classList.add("taken");
  });
}

// Computer nows randomly places ships on its board //
shipsArray.forEach((ship) => placeShip(ship));

// To do (11/07):
// 1. Solve ship not displaying on board issue and array adding for that matter.
// 2. Complete Edge case of ships overlapping each other and cutting at the ends of the board.
// 3. Finish up MVP
