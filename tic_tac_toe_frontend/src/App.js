import React, { useState, useEffect } from 'react';
import './App.css';

// Color variables for inline styles and components
const COLORS = {
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#FFC107',
};

/**
 * Square (individual cell) of tic tac toe board.
 * @param {object} props
 */
function Square({ value, onClick, isWinner }) {
  return (
    <button
      className={`ttt-square${isWinner ? ' ttt-square--winner' : ''}`}
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty Square"}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Tic tac toe game board.
 * @param {object} props
 */
function Board({ squares, onSquareClick, winLine }) {
  function renderSquare(i) {
    const isWinner = winLine && winLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        isWinner={isWinner}
      />
    );
  }

  // 3x3 grid
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row} role="row">
          {[0, 1, 2].map(col =>
            renderSquare(row * 3 + col)
          )}
        </div>
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Display player turn, styled with accent color for current player.
 * @param {object} props
 */
function PlayerIndicators({ current, gameOver }) {
  return (
    <div className="ttt-player-indicators">
      <span
        className="ttt-player"
        style={{
          color: !gameOver && current === 'X' ? COLORS.accent : COLORS.secondary,
          fontWeight: current === 'X' ? 700 : 400,
        }}
        aria-label={`Player X${current === 'X' && !gameOver ? ' (Current turn)' : ''}`}
      >
        X
      </span>
      <span className="ttt-player-sep">vs</span>
      <span
        className="ttt-player"
        style={{
          color: !gameOver && current === 'O' ? COLORS.accent : COLORS.secondary,
          fontWeight: current === 'O' ? 700 : 400,
        }}
        aria-label={`Player O${current === 'O' && !gameOver ? ' (Current turn)' : ''}`}
      >
        O
      </span>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Show result message (win/draw, highlights winner with accent color).
 * @param {object} props
 */
function ResultDisplay({ winner, draw }) {
  let message = '';
  if (winner) {
    message = (
      <span>
        Winner: <span style={{ color: COLORS.accent, fontWeight: 700 }}>{winner}</span>
      </span>
    );
  } else if (draw) {
    message = <span>Draw! 🤝</span>;
  }
  return (
    <div className="ttt-result-display" aria-live="assertive" aria-atomic="true">
      {message}
    </div>
  );
}

// Utility function to calculate the winner and winning line in tic tac toe
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],  // rows
    [0,3,6],[1,4,7],[2,5,8],  // columns
    [0,4,8],[2,4,6]           // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Main App component for Tic Tac Toe.
 */
function App() {
  // Track board, X/O turn, winner/draw state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    // Check for winner or draw after every move
    const info = calculateWinner(squares);
    setWinnerInfo(info);
    if (!info && squares.every(s => s)) {
      setDraw(true);
    } else {
      setDraw(false);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (squares[i] || winnerInfo || draw) return; // No move if filled or game over
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo(null);
    setDraw(false);
  }

  const isGameOver = !!winnerInfo || draw;
  const currentPlayer = xIsNext ? 'X' : 'O';

  return (
    <div className="ttt-app">
      <main className="ttt-container">
        <header className="ttt-header">
          <h1 className="ttt-logo" style={{ color: COLORS.primary }}>
            TIC TAC TOE
          </h1>
          <PlayerIndicators
            current={currentPlayer}
            gameOver={isGameOver}
          />
        </header>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winLine={winnerInfo ? winnerInfo.line : null}
        />
        <ResultDisplay winner={winnerInfo ? winnerInfo.winner : null} draw={draw} />
        <button className="ttt-reset-btn" onClick={handleRestart}>
          Restart Game
        </button>
      </main>
      <footer className="ttt-footer">
        <span>
          {/* Minimal footer, can add attribution or leave blank */}
        </span>
      </footer>
    </div>
  );
}

export default App;
