// should see if I can map over board instead of use nested for loops everywhere?
// also figure out if there's a cleaner way to check the win condition.
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

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard()

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

    let activePlayer = players[0];

    const toggleMenu = () => {
        const form = document.querySelector('.names')
        form.classList.toggle('hidden')
    }

    const setPlayerNames = () => {
        const playerOne = document.getElementById('playerOne')
        const playerTwo = document.getElementById('playerTwo')
        const playerTurnDiv = document.querySelector('.turn')
        players[0].name = playerOne.value
        players[1].name = playerTwo.value
        playerTurnDiv.textContent = `${playerOne.value}'s turn`
    }

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const checkForWin = () => {
        let rowCount = 0
        let columnOneCount = 0
        let columnTwoCount = 0
        let columnThreeCount = 0
        let diagTopLeftCount = 0
        let diagBotLeftCount = 0
        const token = getActivePlayer().token
        for (let i = 0; i < 3; i++) {
            rowCount = 0
            for (let j = 0; j < 3; j++) {
                if (board.getBoard()[i][j].getValue() === token) {
                    rowCount++
                    switch (j) {
                        case (0):
                            columnOneCount++
                            if (i === 0) {
                                diagTopLeftCount++
                            } else if (i === 2) {
                                diagBotLeftCount++
                            }
                            break;
                        case (1):
                            columnTwoCount++
                            if (i === 1) {
                                diagTopLeftCount++
                                diagBotLeftCount++
                            }
                            break;
                        case (2):
                            columnThreeCount++
                            if (i === 0) {
                                diagBotLeftCount++
                            } else if (i === 2) {
                                diagTopLeftCount++
                            } 
                            break; 
                    }
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
        return false
    }
    
    const checkForDraw = () => {
        let count = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.getBoard()[i][j].getValue() !== "") {
                    count++
                }
            }
        }
        if (count === 9) {
            return true
        }
        return false
    }

    const playRound = (row, column) => {
        if (row > 2 || column > 2 || row < 0 || column < 0) {
            return false
        }

        const mark = board.makeMove(row, column, getActivePlayer().token);

        if (!mark) {
            return false
        }

        if (checkForWin()) {
            return "win"
        }

        if (checkForDraw()) {
            return "draw"
        }

        switchPlayerTurn();

        return false
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setPlayerNames()
        const reset = document.querySelector('.reset')
        reset.style.display = 'block'
        toggleMenu()
    }

    const submit = document.querySelector('.submit')

    submit.addEventListener('click', handleSubmit)

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        handleSubmit
    }
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn')
    const boardDiv = document.querySelector('.board')

    const updateBoard = (board) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellButton = document.createElement('button')
                cellButton.classList.add('cell')
                cellButton.dataset.row = i
                cellButton.dataset.column = j
                cellButton.textContent = board[i][j].getValue()
                boardDiv.appendChild(cellButton)
            }
        }
    }

    const updateScreen = () => {
        boardDiv.textContent = ''

        const board = game.getBoard()
        const activePlayer = game.getActivePlayer()

        playerTurnDiv.textContent = `${activePlayer.name}'s turn`

        updateBoard(board)
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row
        const selectedColumn = e.target.dataset.column
        const board = game.getBoard()
        const submit = document.querySelector('.submit')
        if (!selectedRow || !selectedColumn) return

        gameState = game.playRound(selectedRow, selectedColumn)
        if (gameState === "win") {
            activePlayer = game.getActivePlayer()
            playerTurnDiv.textContent = `${activePlayer.name} WON!!!`
            boardDiv.removeEventListener('click', clickHandlerBoard)
            boardDiv.textContent = ''
            submit.removeEventListener('click', game.handleSubmit)

            updateBoard(board)
            return 
        } else if (gameState === "draw") {
            playerTurnDiv.textContent = "It's a Draw!"
            boardDiv.removeEventListener('click', clickHandlerBoard)
            boardDiv.textContent = ''
            submit.removeEventListener('click', game.handleSubmit)

            updateBoard(board)
            return
        }

        updateScreen()
    }

    boardDiv.addEventListener('click', clickHandlerBoard)

    updateScreen()
}

ScreenController()


// feels like everything below should be inside a function somewhere, but idk where
const reset = document.querySelector('.reset')
reset.addEventListener('click', (e) => {
    e.preventDefault()
    ScreenController()
    const form = document.querySelector('.names')
    form.classList.remove('hidden')
    reset.style.display = 'none'
})
