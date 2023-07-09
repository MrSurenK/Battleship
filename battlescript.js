// --Rotate ships feature-- //

// Get the shipyard container holding all the ships into a variable //
const shipyardContainer = document.querySelector(".shipyard-container");

// Get the rotate button into a variable //
const rotateButton = document.querySelector("#rotate-ship");

// angle variable allows for toggle rotate feature
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
const width = 10;

function createBoard(color, user) {
  // Create div for a game board and append both player and cpu gameboards //
  const board = document.createElement("div");
  board.classList.add("game-board");
  board.style.backgroundColor = color;
  gameBoardsContainer.append(board);
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

// Call Gameboard function twice to create 2 boards: 1 for player and 1 for AI
// Input a string for the color
createBoard("#6699CC", "player");
createBoard("#6699CC", "Computer");
