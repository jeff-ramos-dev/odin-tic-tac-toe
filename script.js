//GAMEBOARD FUNCTION
function Gameboard() {
    const rows = 3
    const columns = 3
    const board = []

    const getBoard = () => board

    const makeMove = (row, column, token) => {
        const availableCells = [] 
        let r = rows
        let c = columns
        for (let i = 0; i < r; i++) {
            availableCells[i] = []
            for (let j = 0; j < c; j++) {
                if (board[i][j].getValue() === '') {
                    availableCells[i].push(true)
                } else {
                    availableCells[i].push(false)
                }
            }
        }

        const cell = availableCells[row][column] ? board[row][column] : console.log('invalid cell')

        if (!cell) return false
        
        cell.addToken(token)

        return true
    }

    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = []
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell())
            }
        }
    }

    clearBoard()

    return {
        getBoard,
        makeMove,
        clearBoard
    }
}

// CELL FUNCTION
function Cell() {
    let value = "";

    const addToken = (token) => {
        value = token;
    }

    const getValue = () => value

    return {
        addToken,
        getValue
    }
}

// GAME CONTROLLER FUNCTION
// Set up default player names for game controller
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    // initialize board
    const board = Gameboard()

    // initialize win/draw state to be false
    let win = false
    let draw = false

    // initialize players their tokens using the values passed into GameController
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    // initialize active player to player1
    let activePlayer = players[0];

    // create function to turn menu on and off
    const toggleMenu = () => {
        const form = document.querySelector('.names')
        form.classList.toggle('hidden')
    }

    // create function to update player names with whatever is in the form inputs
    const setPlayerNames = () => {
        // get form inputs
        const playerOne = document.getElementById('playerOne')
        const playerTwo = document.getElementById('playerTwo')
        // get game heading
        const playerTurnDiv = document.querySelector('.turn')
        // set player names to be whatever was typed into the form inputs
        players[0].name = playerOne.value
        players[1].name = playerTwo.value
        // set game heading text to show that it starts as player1's turn
        playerTurnDiv.textContent = `${playerOne.value}'s turn`
    }

    // create function to switch whose turn it is
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    // create function to see whose turn it is
    const getActivePlayer = () => activePlayer;

    // create function to check the board state for a win condition
    const checkForWin = () => {
        // initialize counts to 0
        let rowCount = 0
        let columnOneCount = 0
        let columnTwoCount = 0
        let columnThreeCount = 0
        let diagTopLeftCount = 0
        let diagBotLeftCount = 0
        // set token to be checked for in the loop
        const token = getActivePlayer().token
        // loop over whole board
        for (let i = 0; i < 3; i++) {
            // every time we get to a new row, reset the rowCount to 0
            rowCount = 0
            for (let j = 0; j < 3; j++) {
                // check if the current cell has the current player's token in it
                if (board.getBoard()[i][j].getValue() === token) {
                    // increment the rowCount
                    rowCount++
                    switch (j) {
                        // if in the first column, increment the column 1 count
                        case (0):
                            columnOneCount++
                            // if also in the first row, increment the diagTopLeft count
                            if (i === 0) {
                                diagTopLeftCount++
                            // else if in the last row, increment the diagBotLeft count
                            } else if (i === 2) {
                                diagBotLeftCount++
                            }
                            break;
                        // if in the second column, increment the column 2 count
                        case (1):
                            columnTwoCount++
                            // if also in the second row, increment both diagonal counts
                            if (i === 1) {
                                diagTopLeftCount++
                                diagBotLeftCount++
                            }
                            break;
                        // if in the third column, increment the column 3 count
                        case (2):
                            columnThreeCount++
                            // if also in the first row, increment the diagBotLeft count
                            if (i === 0) {
                                diagBotLeftCount++
                            // else if also in the last row, increment the diagTopLeft count
                            } else if (i === 2) {
                                diagTopLeftCount++
                            } 
                            break; 
                    }
                    // after incrementing all the counts, if any of them are equal to 3,
                    // then the current player has won: return true
                    if (rowCount === 3 ||
                        columnOneCount === 3 ||
                        columnTwoCount === 3 ||
                        columnThreeCount === 3 ||
                        diagTopLeftCount === 3 ||
                        diagBotLeftCount === 3
                    ) {
                        return true
                    }
                }
            }
        }
        // if we didn't return true earlier, then the game isn't over, so return false
        return false
    }

    // create function that plays a round, taking in the row and column the player chooses
    const playRound = (row, column) => {
        // if somehow the player didn't choose a column in the grid, return false, and log error message
        if (row > 2 || column > 2 || row < 0 || column < 0) {
            console.log('invalid cell')
            return false
        }
        // make a move with the given cell using the current player token, and save the result to a variable
        const mark = board.makeMove(row, column, getActivePlayer().token);
        // if the move wasn't valid, return false
        if (!mark) {
            return false
        }
        // if the move results in a win, return true
        if (checkForWin()) {
            return true
        }

        // if the move was valid, and the game isn't over, switch turn to the other player and return false
        switchPlayerTurn();
        return false
    };

    // create variable for start game button
    const submit = document.querySelector('.submit')
    // add event listener for start game button
    submit.addEventListener('click', (e) => {
        // make sure button doesn't try to send data to a server
        e.preventDefault()
        // set the player names to whatever is in the form
        setPlayerNames()
        // create variable for reset button
        const reset = document.querySelector('.reset')
        // display the reset button on the screen
        reset.style.display = 'block'
        // hide the menu
        toggleMenu()
    })

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
    }
}

// SCREEN CONTROLLER FUNCTION
function ScreenController() {
    // initialize GameController to variable
    const game = GameController();
    // initialize variable for game heading
    const playerTurnDiv = document.querySelector('.turn')
    // initialize variable for board display
    const boardDiv = document.querySelector('.board')

    // initialize win state to false (Do I need to do this? Can't I just get it from the game controller?)
    let win = false

    // create function for updating the display
    const updateScreen = () => {
        // initialize the board display to be empty
        boardDiv.textContent = ''

        // get current board state from game controller and save it to variable
        const board = game.getBoard()
        // get active player from game controller and save it to variable
        const activePlayer = game.getActivePlayer()

        // set game heading to show whose turn it is 
        playerTurnDiv.textContent = `${activePlayer.name}'s turn`

        // loop over board and add buttons to each cell
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // create button
                const cellButton = document.createElement('button')
                // add class for styling
                cellButton.classList.add('cell')
                // add data variable for row
                cellButton.dataset.row = i
                // add data variable for column
                cellButton.dataset.column = j
                // get value of cell from the board state and set the text content accordingly
                cellButton.textContent = board[i][j].getValue()
                // add the button to the DOM
                boardDiv.appendChild(cellButton)
            }
        }

        // if a player has won the game (should be getting this from the game controller...)
        if (win) {
            // change the game heading to display who won
            playerTurnDiv.textContent = `${activePlayer.name} WON!!!`
            // stop players from being able to add any more tokens to the board
            boardDiv.removeEventListener('click', clickHandlerBoard)
        }
    }

    // create function to handle when the board is clicked on
    function clickHandlerBoard(e) {
        // initialize variable for the selected row based on where the player clicked
        const selectedRow = e.target.dataset.row
        // initialize variable for the selected column based on where the player clicked
        const selectedColumn = e.target.dataset.column
        // if they clicked in between the rows/columns or something, return
        if (!selectedRow || !selectedColumn) return

        // if they selected a valid cell, and ended up winning the game
        // (because playRound returns true if the game was won), set win to true
        // (this also feels dumb, I should just be able to call the game controller to check if the game is won)
        if (game.playRound(selectedRow, selectedColumn)) {
            win = true
        }

        // update the screen
        updateScreen()
    }

    // add an event listener to the board that calls the clickHandler
    boardDiv.addEventListener('click', clickHandlerBoard)

    // update the screen
    updateScreen()
}

// call the screen controller
ScreenController()


// feels like everything below should be inside a function somewhere
// initialize a variable for the reset button
const reset = document.querySelector('.reset')
// add an event listener to the reset button
reset.addEventListener('click', (e) => {
    // make sure it doesn't do any weird default shit
    e.preventDefault()
    // call the screen controller again, which should restart everything basically
    ScreenController()
    // initalize variable for the form 
    const form = document.querySelector('.names')
    // show the form again
    form.classList.remove('hidden')
    // hide the reset button
    reset.style.display = 'none'
})

