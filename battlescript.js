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

// -- AI/Computer component --

// Place object into an array for computer to generate into its board //
const shipsArray = [
  destroyer,
  cruiser,
  submarine,
  battleship,
  aircraft_carrier,
];

// Variable to allow player to drop ship instead of computer
let notDropped;

//Check position validity
// Pass through allBoardTIles depending on if it is computer or user board
// Pass through horizontalShip true or false
// Pass through startIndex of the first tile for the ship
// Pass through the type of ship
function checkPosVal(allBoardTiles, horizontalShip, startIndex, ship) {
  // Edge case 1: Ship tiles out of range (Tile div exceeds index 99)
  let validStart = horizontalShip
    ? startIndex <= width * width - ship.length
      ? startIndex
      : // if not we adjust the starting index back to an index that will fit the ship. (eg for aircraft carrier: 100 - 5 = 95. So the last index it can start on is 95)
        width * width - ship.length
    : // if horizontalShip is not true means the ship is verticle (compare back up with validStart = horizontalShip for the 2nd :)
    // if verticle width * ship.length to check the squares under it and if not true manipulate it to add 10
    // No issue with negative numbers because vertically i adds downwards. We are solving the issue of the board below running out of divs so we are concerned with higher index divs.
    startIndex <= width * width - width * ship.length
    ? startIndex
    : // eg startIndex = 60 and the ship is an aircraft-carrier with length 5 (index 60 onwards will not fit an aircraft-carrier on the board vertically) -- if 90 it will push back 5 blocks just nice to fit the aircraft-carrier(easier to visualise)
      // 60 - 5 * 10 + 10 = 20 --> new starting index for aircraft-carrier will be 20 and that will fit all 5 tiles beneath it
      startIndex - ship.length * width + width;

  // Array that stores the dom elements of the blocks containing the ships
  let shipsOnBoard = [];

  // eg elements for shipsOnBoard//
  // shipsOnBoard = [div#49.tile, div#59.tile, div#69.tile]]

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
  // Decalre a variable valid to store the result of the if statement
  let valid;
  // Check if ships split at the ends when orientated horizontalally
  //Eg, randomIndexStart is tile 19 for aircraft-carrier of 5 tiles.
  if (horizontalShip) {
    shipsOnBoard.every(
      (_shipTile, index) =>
        (valid =
          // index 0 is used as the function is called 5x through a forEach loop below.Each time the function runs shipsOnBoard will only have 1 ship item with all the tiles needed for the ship and index 0 being the first tile that ship will be placed on
          // Check if (19/10 remainder = 9) is not equal to [10 - (5-(19 + 1 )= 25]) --> Therefore, valid is false ( it will be fed into the if statement below for coloring the tiles) -- in this case it will go to else and the whole function repeats
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

  console.log(`ShipsOnBoard array length: ${shipsOnBoard.length}`);
  console.log(`Valid value = ${valid}`);

  // Edge case 3: Prevent overlapping
  const notTaken = shipsOnBoard.every(
    // Check if in the shipsOnBoard array any tile is not taken
    (shipTile) => !shipTile.classList.contains("taken")
  );

  // return the 3 objects to be used in other functions to check the space validity and prevent edge cases from happening, 1. shipsOnBoard array storing the div doms that the ship will take up, 2. if the space is a valid space or not, 3. if the spake has already be taken or not
  // shipsOnBoard returns array
  // valid returns true or false
  // notTaken returs true or false
  return { shipsOnBoard, valid, notTaken };
}

// Function to place the ships --> startIdForShip variable only for user drag and dropped ship
function addAShip(user, ship, startIdForShip) {
  const allBoardTiles = document.querySelectorAll(`#${user} div`);
  // console.log(allBoardTiles);
  // Create ship orientation, horizontal or vertical
  // trueOrFalse returms a random boolean
  const RandomTrueOrFalse = Math.random() < 0.5; // Makes it 50% chance of true or False
  //if true then ship will be placed horizontally on the board
  const horizontalShip = user === "player" ? angle === 0 : RandomTrueOrFalse; //If the user is the player then we set angle to 0 to let player decide ship orientation. If not it is the computer and we generate a random orientation for the ship to be placed on the computer board.
  // Creates a random index for computer to start placing its ship on
  let randomStartIndex = Math.floor(Math.random() * width * width);
  // If startIdForShip exists, it means the player is placing his ship and we return the start id for the ship the player decides on. If not it is the computer and we let it decide the random Start index on its board.
  let startIndex = startIdForShip ? startIdForShip : randomStartIndex;
  console.log(startIndex);

  // Pass through validity check function and return the output of the checkPosVal function
  const { shipsOnBoard, valid, notTaken } = checkPosVal(
    allBoardTiles,
    horizontalShip,
    startIndex,
    ship
  );

  // Add color only if valid and notTaken is true // -- ships will not be cut off onto the next line or overlap one another
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
    // if computer, we want to regenerate a new randomStartIndex to place the ship
    //  Have to pass the user in the addShip so that the above code will run accordingly as the querySelector(1st line requires a user input)
    if (user === "computer") {
      addAShip(user, ship, startIdForShip);
    }
    // if player we do not want the computer to drop the ship.
    if (user === "player") {
      notDropped = true;
    }
  }
}
// Computer nows randomly places ships on its board //
// Computer does not need startId parameter as it uses randomStartId so can just pass in 2 parameters.
shipsArray.forEach((ship) => addAShip("computer", ship));

// -- Ship drag and drop -- //

// Decalare a variable called draggedShip to get the id from dragged ships
let draggedShip;

// Convert the shiyardContainer children DOM into an array
const optionShips = Array.from(shipyardContainer.children);
// Add event listener "dragstart" to each of the children element in the new array storing children elements of shipYardContainer optionShips
optionShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", startDragShip)
);

// Save to the variable all the player tiles on the player board (NodeList)
const allPlayerTiles = document.querySelectorAll("#player div");

// Listen for drag over event on all the player tiles (Node List can be iterated using forEach)
allPlayerTiles.forEach((eachTile) => {
  eachTile.addEventListener("dragover", dragOverTile);
  eachTile.addEventListener("drop", dropShip);
});

// Callback function for event listener "dragstart"
function startDragShip(event) {
  // Restarts the dragging process after a ship has been dropped so another ship can be dropped
  notDropped = false;
  // draggedShip decared globally outside of the function and stores the dom of the ship being dragged (which is one of the children from shipYardContainer)
  draggedShip = event.target;
}

// Callback function for event listener "dragover"
function dragOverTile(event) {
  //Default event of "dragover" will be cancelled
  event.preventDefault();
  // Get the correct ship out through the id from shipsArray
  const ship = shipsArray[draggedShip.id];
  // pass in the exact if of the tile being draggwedw over
  // pass through the ship
  tileAreaIndicator(event.target.id, ship);
}

// Callback function for event listener "drop"
function dropShip(event) {
  // startIdForShip stores the id of the target starting div we want to drop the ship on
  const startIdForShip = event.target.id;
  console.log(startIdForShip);
  // stores the type of ship we are dragging by getting the element attribute associated with the ship in the shipyard container (Manually creat an id for each ship on the html)
  const ship = shipsArray[draggedShip.id];
  // Run the function to add a ship to the player board
  // if StartIdForShip not defined the ship will not be dropped. > Ship cannot be dropped outside the player board! (The function runs validity checks as per normal! so there must be enough space for selected ship on the board and no overlaps)
  addAShip("player", ship, startIdForShip);
  // Remove the dragged ship from shipyard if the ship is dropped onto the board (notDropped is false means the ship is dropped on the board)
  if (notDropped === false) {
    draggedShip.remove();
  }
}

// Add tile highlight to indicate to player where exactly it will go on board
function tileAreaIndicator(startIdForShip, ship) {
  // Get the tiles for the playerboard
  const allPlayerTiles = document.querySelectorAll("#player div");
  // If angle = 0 it means ship being dragged around is horizontal
  let horizontalShip = angle === 0;
  // Get return values of checkPosVal --> which checkst the position validity on the board
  const { shipsOnBoard, valid, notTaken } = checkPosVal(
    allPlayerTiles,
    horizontalShip,
    startIdForShip,
    ship
  );

  // Add and remove the hover classes on the tile divs on the board
  if (valid && notTaken) {
    shipsOnBoard.forEach((shipTile) => {
      shipTile.classList.add("hover");
      setTimeout(() => shipTile.classList.remove("hover"), 500);
    });
  }
}

// --GAME LOGIC-- //
