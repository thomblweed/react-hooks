// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window?.localStorage.getItem(key)

      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = value => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      window?.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

const GameInfo = ({history, currentStep, onHistoryClick}) => {
  return (
    <div>
      <div>History</div>
      <ul>
        {history.map((_, index) => {
          const isCurrentStep = index === currentStep
          return (
            <li key={index}>
              <button
                disabled={isCurrentStep}
                onClick={() => onHistoryClick(index)}
              >
                {index === 0 ? 'Go to game start' : `Go to move #${index}`}
                {isCurrentStep ? ' (current)' : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
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
  // const [squares, setSquares] = useLocalStorage('squares', emptyBoard)
  const [history, setHistory] = useLocalStorage('history', [
    {
      squares: emptyBoard,
    },
  ])
  const [currentStep, setCurrentStep] = React.useState(0)
  const currentStepHistory = history[currentStep]
  const squares = currentStepHistory.squares
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)
  const historyMoves = history.length

  function handleHistoryClick(moveIndex) {
    setCurrentStep(moveIndex)
  }

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    const moves = squaresCopy.filter(Boolean).length

    if (historyMoves - 1 > currentStep) {
      const backHistorySquares = [...history.slice(0, currentStep + 1)]
      setHistory([...backHistorySquares, {squares: squaresCopy}])
      setCurrentStep(moves)
      return
    }

    // setSquares(squaresCopy)
    setHistory(currentHistory => [...currentHistory, {squares: squaresCopy}])
    setCurrentStep(moves)
  }

  function restart() {
    setHistory([{squares: emptyBoard}])
    setCurrentStep(0)
    // setSquares(emptyBoard)
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
      <GameInfo
        history={history}
        currentStep={currentStep}
        onHistoryClick={handleHistoryClick}
      />
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
