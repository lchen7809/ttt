import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import PastGames from './components/PastGame';

const App = () => {
  const [squares, setSquares] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

  const [isXNext, setIsXNext] = useState(true);

  const [winner, setWinner] = useState(null);

  const [gameId, setGameId] = useState('');

  const [message, setMessage] = useState('');

  const [showPastGames, setShowPastGames] = useState(false);
  
  const [selectedCell, setSelectedCell] = useState([0, 0]);

  useEffect(() => {
    createGame();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (winner || showPastGames) return;
      let [row, col] = selectedCell;

      switch (event.key) {
        case 'ArrowUp':
          row = row > 0 ? row - 1 : 2;
          break;
        case 'ArrowDown':
          row = row < 2 ? row + 1 : 0;
          break;
        case 'ArrowLeft':
          col = col > 0 ? col - 1 : 2;
          break;
        case 'ArrowRight':
          col = col < 2 ? col + 1 : 0;
          break;
        case 'Enter':
          handleSquareClick(row, col);
          return;
        default:
          return;
      }
      setSelectedCell([row, col]);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, winner, showPastGames]);

  const createGame = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/games/create', { method: 'POST' });
      const data = await res.json();
      setGameId(data.gameId);
      resetBoard();
    } catch (err) {
      console.error('Failed to create a new game. Error:', err);
    }
  };

  const handleSquareClick = async (row, col) => {
    if (squares[row][col] || winner) {
      if (winner) alert(`Game end. Please reset the game.`);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/games/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, row, col }),
      });
      const data = await res.json();
      setSquares(data.board);
      setIsXNext(data.isXNext);
      setMessage('');
      if (data.winner) setWinner(data.winner);
    } catch (err) {
      console.error('Failed to make a move:', err);
      setMessage(`Failed to make a move: ${err.message}`);
    }
  };

  const resetGame = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/games/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setGameId(data.gameId);
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
    setSelectedCell([0, 0]);
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <p aria-live="polite">
        Welcome to Accessible Tic-Tac-Toe. The game board is a 3 times 3 grid. Use arrow keys to navigate and Enter put an X or O.
      </p>
      {!showPastGames ? (
        <>
          <p>{winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`}</p>
          <Board squares={squares} onSquareClick={handleSquareClick} selectedCell={selectedCell} />
          <button onClick={resetGame} style={{ marginTop: '50px' }}>Reset Game</button>
          <button onClick={() => setShowPastGames(true)}>View Past Games</button>
        </>
      ) : (
        <>
          <PastGames />
          <button onClick={() => setShowPastGames(false)}>Back to Game</button>
        </>
      )}
    </div>
  );
};

export default App;
