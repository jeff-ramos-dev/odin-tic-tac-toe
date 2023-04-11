function Gameboard() {
    const rows = 3
    const columns = 3
    const board = []

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell())
        }
    }

    const getBoard = () => board

    const makeMark = (row, column, player) => {
        const availableCells = [] 
        for (let i = 0; i < 3; i++) {
            availableCells[i] = []
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() === 0) {
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

    return {
        getBoard,
        makeMark,
        printBoard
    }
}

// Setup Cell objects
function Cell() {
    let value = 0;

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

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
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
        
        switchPlayerTurn();
        printNewRound();
        return `${getActivePlayer().name}'s turn`
    };

    printNewRound();
    console.log("%c \"Player One's turn\"", 'color: cyan')

    return {
       playRound,
       getActivePlayer 
    }
}

const game = GameController();
