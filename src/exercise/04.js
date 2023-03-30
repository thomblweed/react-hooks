// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = React.useState(() => {
    let currentValue

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(initialValue),
      )
    } catch (error) {
      currentValue = initialValue
    }

    return currentValue
  })

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}

const Square = ({value, onSquareClick}) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

const emptyBoard = Array(9).fill(null)

function Board() {
  const [squares, setSquares] = useLocalStorage('squares', emptyBoard)
  // const [squares, setSquares] = React.useState(() => storedSquares)
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(emptyBoard)
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => selectSquare(0)} />
        <Square value={squares[1]} onSquareClick={() => selectSquare(1)} />
        <Square value={squares[2]} onSquareClick={() => selectSquare(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => selectSquare(3)} />
        <Square value={squares[4]} onSquareClick={() => selectSquare(4)} />
        <Square value={squares[5]} onSquareClick={() => selectSquare(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => selectSquare(6)} />
        <Square value={squares[7]} onSquareClick={() => selectSquare(7)} />
        <Square value={squares[8]} onSquareClick={() => selectSquare(8)} />
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
