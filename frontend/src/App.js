import React, { useState, useEffect } from 'react';
import Board from './components/Board';

const App = () => {
  const [squares, setSquares] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

  const [isXNext, setIsXNext] = useState(true);

  const [winner, setWinner] = useState(null);

  const [gameId, setGameId] = useState('');

  const [message, setMessage] = useState('');

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
      resetBoard(); 
    } catch (err) {
      console.error('Failed to create a new game. Error:', err);
    }
  };

  const handleSquareClick = async (row, col) => {
    
    if (squares[row][col] || winner) { //check for winner
      if (winner) {
        alert(`Game end. Please reset the game.`);
      }
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/games/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, row, col }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        setMessage(errorText); 
        return;
      }
  
      const data = await res.json();
      setSquares(data.board);  
      setIsXNext(data.isXNext); 
      setMessage('');  

      if (data.winner) {
        setWinner(data.winner);
      }
      
    } catch (err) {
      console.error('Failed to make a move:', err);
      setMessage(`Failed to make a move: ${err.message}`);
    }
  };
  

  const resetGame = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/games/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        setMessage(errorText); 
        return;
      }
  
      resetBoard(); 
      setMessage('');  
    } catch (err) {
      console.error('Failed to reset the game:', err);
      setMessage(`Failed to reset the game: ${err.message}`);
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
