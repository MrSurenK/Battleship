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
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

//Initiaite each battleship type into new object class//
// Made sure the name initiated matches CSS styling as objects will be put as classname in dom.
const destroyer = new Ship("destroyer", 2);
const cruiser = new Ship("cruiser", 3);
const submarine = new Ship("submarine", 3);
const battleship = new Ship("battleship", 4);
const aircraft_carrier = new Ship("aircraft-carrier", 5);

// console.log(destroyer);
// AI/Computer component

// Place object into an array for computer to generate into its board //
const shipsArray = [
  destroyer,
  cruiser,
  submarine,
  battleship,
  aircraft_carrier,
];

// Function to place the ships //
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

  // Edge case 1: Ship tiles out of range and
  let validStart = horizontalShip
    ? randomStartIndex <= width * width - ship.length
      ? randomStartIndex
      : width * width - ship.length
    : // if verticle width * ship.length to check the squares under it and if not true manipulate it to add 10 (UNDERSTAND THIS!)
    // No issue with negative numbers because vertically i adds downwards. We are solving the issue of the board below running out of divs so we are concerned with div 50 onwards
    randomStartIndex <= width * width - width * ship.length
    ? randomStartIndex
    : randomStartIndex - ship.length * width + width;

  // Array that stores the dom elements of the blocks containing the ships
  let shipsOnBoard = [];

  // for loop to determine the position of the ship on the board
  // i will only range from 1 to 5 as defined in class for the Ships
  for (let i = 0; i < ship.length; i++) {
    // if statement to identify the divs that the ship will take up within the board
    // Picks the next few tiles from the random first pick according to ship length and pushes into shipsOnBoard array
    if (horizontalShip) {
      shipsOnBoard.push(allBoardTiles[Number(validStart) + i]);
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
  console.log(shipsOnBoard);

  // Edge case 2: Ships splitting at the ends
  // Decalre a variable valid to store the result of the last iteration
  let valid;
  //  Check if ships split at the ends when orientated horizontalally
  // index 0 is used as it is the first tile random tile that will determine the subsequent tiles (ship length)
  if (horizontalShip) {
    shipsOnBoard.every(
      (_shipTile, index) =>
        (valid =
          shipsOnBoard[0].id % width !==
          width - (shipsOnBoard.length - (index + 1)))
    );
  } else {
    // For verticle ships check if ship tile split at the top or bottom
    shipsOnBoard.every(
      (_shipTile, index) =>
        // 90 is the first tile of the last row.
        // Check if the 1st item in the array is less than 90 + (10+0+1) = 101(it shd be below 90 but it does not exist as the board is only 10x10) and if it is then it is valid and assign to valid (if not generate random again later by calling the higher order function below!)
        // Since the verticles ships are added downwards. We are only concerned with the last row of the board (index 90-99)
        (valid = shipsOnBoard[0].id < 90 + (width + index + 1))
    );
  }

  // Edge case 3: Prevent overlapping
  const notTaken = shipsOnBoard.every(
    // Check if in the shipsOnBoard array any tile is not taken
    (shipTile) => !shipTile.classList.contains("taken")
  );

  // Add color only if valid is true // -- ships will not be cut off onto the next line
  if (valid && notTaken) {
    // Coloring of the tiles taken up by the ship. Identified via the shipsOnBoard array.
    shipsOnBoard.forEach((shipTile) => {
      shipTile.classList.add(ship.name);
      // This indicates that the tile has been taken
      shipTile.classList.add("taken");
    });
    // Means there are invalid ships cutting onto wrong lines on the board or invalid ships overlapping. So generate random index again.
    // Creates a sort of while loop in the function//
    // It will regenrate the wrong indexed ship only -- > console.log will shipsOnBoard to see!
  } else {
    placeShip(ship);
  }
}
// Computer nows randomly places ships on its board //
shipsArray.forEach((ship) => placeShip(ship));

// To do (11/07):
// 2. Complete Edge case of ships overlapping each other and cutting at the ends of the board.
// 3. Finish up MVP
