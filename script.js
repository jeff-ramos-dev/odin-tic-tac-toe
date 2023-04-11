function Gameboard() {
    const rows = 3
    const columns = 3
    const board = []

    const getBoard = () => board

    const makeMark = (row, column, player) => {
        const availableCells = [] 
        for (let i = 0; i < 3; i++) {
            availableCells[i] = []
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() === '-') {
                    availableCells[i].push(true)
                } else {
                    availableCells[i].push(false)
                }
            }
        }

        const cell = availableCells[row][column] ? board[row][column] : console.log('invalid cell')

        if (!cell) return false
        
        cell.addMark(player)

        return true
    }

    const printBoard = () => {
        let boardWithCellValues = ''
        for (let i = 0; i < 3; i++) { 
            boardWithCellValues += '\n'
            for (let j = 0; j < 3; j++) {
                boardWithCellValues += `${board[i][j].getValue()} `
            }
        }
        console.log(boardWithCellValues)
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
        makeMark,
        printBoard,
        clearBoard
    }
}

function Cell() {
    let value = "-";

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value

    return {
        addMark,
        getValue
    }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard()
    let win = false

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

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    };

    const checkForWin = () => {
        let rowCount = 0
        let columnOneCount = 0
        let columnTwoCount = 0
        let columnThreeCount = 0
        let diagTopLeftCount = 0
        let diagBotLeftCount = 0
        for (let i = 0; i < 3; i++) {
            rowCount = 0
            for (let j = 0; j < 3; j++) {
                if (board.getBoard()[i][j].getValue() === getActivePlayer().token) {
                    switch (j) {
                        case (0):
                            rowCount++
                            columnOneCount++
                            if (i === 0) {
                                diagTopLeftCount++
                            } else if (i === 2) {
                                diagBotLeftCount++
                            }
                            break;
                        case (1):
                            rowCount++
                            columnTwoCount++
                            if (i === 1) {
                                diagTopLeftCount++
                                diagBotLeftCount++
                            }
                            break;
                        case (2):
                            rowCount++
                            columnThreeCount++
                            if (i === 0) {
                                diagBotLeftCount++
                            } else if (i === 2) {
                                diagTopLeftCount++
                            } 
                            break; 
                        default:
                            break;
                    }
                    if (rowCount === 3 ||
                        columnOneCount === 3 ||
                        columnTwoCount === 3 ||
                        columnThreeCount === 3 ||
                        diagTopLeftCount === 3 ||
                        diagBotLeftCount === 3
                    ) {
                        board.printBoard()
                        console.log(`%c ${getActivePlayer().name} WON!!!`, 'color: cyan')
                        switchPlayerTurn()
                        board.clearBoard()
                        return `${getActivePlayer().name}'s turn`
                    }
                }
            }
        }
    }

    const playRound = (row, column) => {
        if (row > 2 || column > 2 || row < 0 || column < 0) {
            console.log('invalid cell')
            return `${getActivePlayer().name}'s turn`
        }
        const mark = board.makeMark(row, column, getActivePlayer().token);
        if (!mark) {
            return `${getActivePlayer().name}'s turn`
        }
        console.log(`Adding ${getActivePlayer().name}'s mark to cell (${row}, ${column})`)
        // check if player has won the game
        checkForWin()
        
         
        switchPlayerTurn();
        printNewRound();
        return `${getActivePlayer().name}'s turn`
    };

    printNewRound();
    console.log(`%c "${getActivePlayer().name}'s turn"`, 'color: cyan')

    return {
       playRound,
       getActivePlayer 
    }
}

const game = GameController();
