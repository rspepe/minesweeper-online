import { useState, useEffect } from 'react'
import './App.css'

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
}

function App() {
  const [difficulty, setDifficulty] = useState('easy')
  const [board, setBoard] = useState([])
  const [gameStatus, setGameStatus] = useState('playing')
  const [flagCount, setFlagCount] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const { rows, cols, mines } = DIFFICULTIES[difficulty]

  useEffect(() => {
    initializeGame()
  }, [difficulty])

  useEffect(() => {
    let interval
    if (gameStatus === 'playing' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStatus, startTime])

  const initializeGame = () => {
    const newBoard = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      )

    let minesPlaced = 0
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr
              const nc = c + dc
              if (
                nr >= 0 &&
                nr < rows &&
                nc >= 0 &&
                nc < cols &&
                newBoard[nr][nc].isMine
              ) {
                count++
              }
            }
          }
          newBoard[r][c].neighborMines = count
        }
      }
    }

    setBoard(newBoard)
    setGameStatus('playing')
    setFlagCount(0)
    setStartTime(null)
    setElapsedTime(0)
  }

  const revealCell = (row, col) => {
    if (gameStatus !== 'playing') return
    if (board[row][col].isRevealed || board[row][col].isFlagged) return

    if (!startTime) {
      setStartTime(Date.now())
    }

    const newBoard = [...board.map(r => [...r])]

    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true
      setBoard(newBoard)
      setGameStatus('lost')
      revealAllMines(newBoard)
      return
    }

    const reveal = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return
      if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return

      newBoard[r][c].isRevealed = true

      if (newBoard[r][c].neighborMines === 0 && !newBoard[r][c].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc)
          }
        }
      }
    }

    reveal(row, col)
    setBoard(newBoard)

    checkWin(newBoard)
  }

  const toggleFlag = (e, row, col) => {
    e.preventDefault()
    if (gameStatus !== 'playing') return
    if (board[row][col].isRevealed) return

    if (!startTime) {
      setStartTime(Date.now())
    }

    const newBoard = [...board.map(r => [...r])]
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setBoard(newBoard)
    setFlagCount(prevCount =>
      newBoard[row][col].isFlagged ? prevCount + 1 : prevCount - 1
    )

    checkWin(newBoard)
  }

  const checkWin = newBoard => {
    const allNonMinesRevealed = newBoard.every((row, r) =>
      row.every(
        (cell, c) => cell.isMine || cell.isRevealed
      )
    )

    if (allNonMinesRevealed) {
      setGameStatus('won')
      newBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.isMine && !cell.isFlagged) {
            newBoard[r][c].isFlagged = true
          }
        })
      })
      setBoard([...newBoard])
    }
  }

  const revealAllMines = newBoard => {
    newBoard.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) {
          cell.isRevealed = true
        }
      })
    })
    setBoard([...newBoard])
  }

  const getCellContent = cell => {
    if (cell.isFlagged) return '🚩'
    if (!cell.isRevealed) return ''
    if (cell.isMine) return '💣'
    if (cell.neighborMines === 0) return ''
    return cell.neighborMines
  }

  const getCellClass = cell => {
    let className = 'cell'
    if (cell.isRevealed) {
      className += ' revealed'
      if (cell.isMine) {
        className += ' mine'
      } else if (cell.neighborMines > 0) {
        className += ` number-${cell.neighborMines}`
      }
    }
    return className
  }

  return (
    <div className="app">
      <h1>💣 マインスイーパー</h1>

      <div className="controls">
        <div className="difficulty-selector">
          <button
            className={difficulty === 'easy' ? 'active' : ''}
            onClick={() => setDifficulty('easy')}
          >
            初級 (9x9)
          </button>
          <button
            className={difficulty === 'medium' ? 'active' : ''}
            onClick={() => setDifficulty('medium')}
          >
            中級 (16x16)
          </button>
          <button
            className={difficulty === 'hard' ? 'active' : ''}
            onClick={() => setDifficulty('hard')}
          >
            上級 (16x30)
          </button>
        </div>

        <div className="info-panel">
          <div className="info-item">
            <span className="label">💣 地雷:</span>
            <span className="value">{mines - flagCount}</span>
          </div>
          <div className="info-item">
            <span className="label">⏱️ 時間:</span>
            <span className="value">{elapsedTime}秒</span>
          </div>
          <div className="info-item">
            <span className="status-emoji">
              {gameStatus === 'won' ? '😎' : gameStatus === 'lost' ? '😵' : '🙂'}
            </span>
          </div>
        </div>

        <button className="reset-button" onClick={initializeGame}>
          新しいゲーム
        </button>
      </div>

      {gameStatus === 'won' && (
        <div className="game-message won">
          🎉 おめでとうございます！勝ちました！
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="game-message lost">
          💥 ゲームオーバー！もう一度挑戦してみましょう！
        </div>
      )}

      <div className="board-container">
        <div
          className="board"
          style={{
            gridTemplateColumns: `repeat(${cols}, 30px)`,
            gridTemplateRows: `repeat(${rows}, 30px)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={getCellClass(cell)}
                onClick={() => revealCell(r, c)}
                onContextMenu={e => toggleFlag(e, r, c)}
              >
                {getCellContent(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="instructions">
        <p>左クリック: セルを開く | 右クリック: 旗を立てる/外す</p>
      </div>
    </div>
  )
}

export default App
