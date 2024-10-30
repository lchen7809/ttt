import React, { useState } from 'react';
import Board from './components/Board';

const App = () => {
  const [squares, setSquares] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

  const handleSquareClick = (row, col) => {
    const newSquares = squares.map((r, i) => r.slice());
    newSquares[row][col] = 'X';
    setSquares(newSquares);
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <Board squares={squares} onSquareClick={handleSquareClick} />
    </div>
  );
};

export default App;
