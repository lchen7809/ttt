import React, { useState } from 'react';
import Board from './components/Board';

const App = () => {
  const [squares, setSquares] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

  const [isXNext, setIsXNext] = useState(true);

  const [winner, setWinner] = useState(null);

  const handleSquareClick = (row, col) => {
    if (squares[row][col] || winner) { //prevent further clicking
      if (winner) {
        alert(`Game end! Please reset the game`);
      }
      return;
    }
    
    const newSquares = squares.map((r, i) => r.slice());
    newSquares[row][col] = isXNext ? 'X' : 'O'; //take turns X or O
    setSquares(newSquares);
    // setIsXNext(!isXNext);

    const result = checkWinner(newSquares);
    if (result) {
      setWinner(result);
    } else { //if no winner, continue
      setIsXNext(!isXNext);
      }
  };


  //testin checkWinner in frontend
  const checkWinner = (board) => {

    const lines = [
      
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],

    ];


    for (let line of lines) {
      const [a, b, c] = line;
      if (
        board[a[0]][a[1]] &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]]; 
      }
    }

    return null; 
  };

  //reset game function
  const resetGame = () => {
    setSquares(Array(3).fill(null).map(() => Array(3).fill(null)));
    setIsXNext(true);
    setWinner(null);
  };

  
  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      ${winner}
      <Board squares={squares} onSquareClick={handleSquareClick} />
      <div>
      <button onClick={resetGame} style={{ marginTop: '50px' }}>Reset Game</button>
      </div>
    </div>
  );
};

export default App;
