function Cell() {
    let value = ''

    const getValue = () => value

    const addToken = (token) => {
        value = token
    }

    return {
        getValue,
        addToken
    }
}

function Gameboard() {
    let board = []
    const numOfCells = 9

    const clearBoard = () => {
        board = []
        for (let i = 0; i < numOfCells; i++) {
            board.push(Cell())
        }
    }

    const makeMove = (cellIdx, token) => {
        const cell = board[cellIdx].getValue() ? false : board[cellIdx]

        if (!cell) return false

        cell.addToken(token)

        return true
    }

    const getBoard = () => board

    clearBoard()

    return {
        clearBoard,
        makeMove,
        getBoard
    }
}

function GameController(p1Name = 'Player One', p2Name = 'Player Two') {
    const board = Gameboard()

    const players = [
        {
            name: p1Name,
            token: 'X'
        },
        {
            name: p2Name,
            token: 'O'
        }
    ]

    let activePlayer = players[0]



    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    const getActivePlayer = () => activePlayer

    const checkWin = (token) => {
        const winCons = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontals
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticals
            [0, 4, 8], [6, 4, 2] // diagonals
        ]

        const numOfConditions = winCons.length
        for (let i = 0; i < numOfConditions; i++) {
            let currCon = false
            for (let j = 0; j < 3; j++) {
                let currCell = winCons[i][j]
                if (board.getBoard()[currCell].getValue() === token) {
                    currCon = true    
                } else {
                    currCon = false
                    break
                }
            }
            if (currCon) {
                return true
            }
        }
    }

    const checkDraw = () => {
        for (let i = 0; i < 9;) {
            if (board.getBoard()[i].getValue()) {
                i++
                if (i === 9) {
                    return true
                }
                continue
            } else {
                return false
            }
        }

    }

    const checkGameStatus = () => {
        const token = getActivePlayer().token
        let win = false
        let draw = false
        if (checkWin(token)) {
            win = true
        } else if (checkDraw()) {
            draw = true
        }
        if (win) return 'win'
        else if (draw) return 'draw'
        return false
    }
    
    const playRound = (cellIdx) => {
        if (cellIdx > 8 || cellIdx < 0) return false
        const token = getActivePlayer().token

        if (!board.makeMove(cellIdx, token)) {
            console.log('invalid cell')
            return `${getActivePlayer().name}'s turn`
        }

        if (checkGameStatus() === 'win') {
            return 'win'
        } else if (checkGameStatus() === 'draw') {
            return 'draw'
        }
        switchPlayer()
        console.log(
            board.getBoard()[0].getValue() ? board.getBoard()[0].getValue() : '-', 
            board.getBoard()[1].getValue() ? board.getBoard()[1].getValue() : '-', 
            board.getBoard()[2].getValue() ? board.getBoard()[2].getValue() : '-'
        )
        console.log(
            board.getBoard()[3].getValue() ? board.getBoard()[3].getValue() : '-', 
            board.getBoard()[4].getValue() ? board.getBoard()[4].getValue() : '-', 
            board.getBoard()[5].getValue() ? board.getBoard()[5].getValue() : '-'
        )
        console.log(
            board.getBoard()[6].getValue() ? board.getBoard()[6].getValue() : '-', 
            board.getBoard()[7].getValue() ? board.getBoard()[7].getValue() : '-', 
            board.getBoard()[8].getValue() ? board.getBoard()[8].getValue() : '-'
        )
        return `${getActivePlayer().name}'s turn`
    }

    return {
        checkGameStatus,
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        players
    }
    
}


function ScreenController() {
    const game = GameController()
    const heading = document.querySelector('.turn')
    const boardDisplay = document.querySelector('.board')
    const numOfCells = 9

    const updateBoard = (board) => {
        for (let i = 0; i < numOfCells; i++) {
            const cell = document.createElement('button')
            cell.classList.add('cell')
            if (board[i].getValue() === 'X') {
                cell.classList.add('X')
            } else if (board[i].getValue() === 'O') {
                cell.classList.add('O')
            }
            cell.dataset.num = i
            cell.textContent = board[i].getValue()
            boardDisplay.appendChild(cell)
        }
    }

    const updateScreen = () => {
        boardDisplay.textContent = ''
        const board = game.getBoard()
        const activePlayer = game.getActivePlayer().name

        heading.textContent = `${activePlayer}'s Turn`
        updateBoard(board)
    }

    const setPlayerNames = () => {
        const playerOne = document.getElementById('playerOne')
        const playerTwo = document.getElementById('playerTwo')
        game.players[0].name = playerOne.value
        game.players[1].name = playerTwo.value
        heading.textContent = `${playerOne.value}'s turn`
    }

    function boardClickHandler(e) {
        const cellNum = e.target.dataset.num
        const board = game.getBoard()
        console.log(cellNum)

        if (!cellNum) return

        const gameState = game.playRound(cellNum)

        if (gameState === "win") {
            console.log('win')
            const activePlayer = game.getActivePlayer().name
            heading.textContent = `${activePlayer} WON!!!`
            boardDisplay.removeEventListener('click', boardClickHandler)
            boardDisplay.textContent = ''

            updateBoard(board)
            return 
        } else if (gameState === "draw") {
            console.log('draw')
            heading.textContent = "It's a Draw!"
            boardDisplay.removeEventListener('click', boardClickHandler)
            boardDisplay.textContent = ''

            updateBoard(board)
            return
        } 
        console.log('no win, no draw')

        updateScreen()
    }

    const toggleMenu = () => {
        const form = document.querySelector('.names')
        form.classList.toggle('hidden')
    }

    function handleSubmit(e) {
        e.preventDefault()
        setPlayerNames()
        const reset = document.querySelector('.reset')
        reset.style.display = 'block'
        toggleMenu()
        submit.removeEventListener('click', handleSubmit)
    }

    const submit = document.querySelector('.submit')
    submit.addEventListener('click', handleSubmit)
    boardDisplay.addEventListener('click', boardClickHandler)
    updateScreen()

    return {
        game,
        updateBoard,
        updateScreen
    }

}

ScreenController()

const reset = document.querySelector('.reset')
reset.addEventListener('click', (e) => {
    e.preventDefault()
    ScreenController()
    const form = document.querySelector('.names')
    form.classList.remove('hidden')
    reset.style.display = 'none'
})