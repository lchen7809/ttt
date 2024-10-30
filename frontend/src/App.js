import React, { useState, useEffect } from 'react';
import Board from './components/Board';

const App = () => {
  const [squares, setSquares] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

  const [isXNext, setIsXNext] = useState(true);

  const [winner, setWinner] = useState(null);

  const [gameId, setGameId] = useState('');

  useEffect(() => {
    createGame();
  }, []);

  const createGame = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/games/create', {
        method: 'POST',
      });
      const data = await res.json();
      setGameId(data.gameId);
      resetBoard(); // Clear board for a new game
    } catch (err) {
      console.error('Failed to create a new game. Error:', err);
    }
  };

  const handleSquareClick = async (row, col) => {
    if (squares[row][col] || winner) {
      if (winner) {
        alert(`Game has ended. Please reset the game.`);
      }
      return;
    }
<<<<<<< HEAD
=======
    
    const newSquares = squares.map((r, i) => r.slice());
    newSquares[row][col] = isXNext ? 'X' : 'O'; //take turns X or O
    setSquares(newSquares);
    // setIsXNext(!isXNext);
>>>>>>> f56c045837062c164b2407cd09404998f6e3be64

    try {
      const res = await fetch('http://localhost:5000/api/games/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, row, col }),
      });
      const data = await res.json();

      setSquares(data.board);
      setIsXNext(data.isXNext);
      if (data.winner) {
        setWinner(data.winner);
      }
    } catch (err) {
      console.error('Failed to make a move. Error:', err);
    }
  };


  const resetGame = async () => {
    try {
      await fetch('http://localhost:5000/api/games/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
      resetBoard();
    } catch (err) {
      console.error('Failed to reset the game. Error:', err);
    }
  };

  const resetBoard = () => {
    setSquares(Array(3).fill(null).map(() => Array(3).fill(null)));
    setIsXNext(true);
    setWinner(null);
  };
  
  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      Winner: ${winner}
      <Board squares={squares} onSquareClick={handleSquareClick} />
      <div>
      <button onClick={resetGame} style={{ marginTop: '50px' }}>Reset Game</button>
      </div>
    </div>
  );
};

export default App;