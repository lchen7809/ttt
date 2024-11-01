import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import PastGames from './components/PastGame';

const App = () => {
  const [squares, setSquares] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameId, setGameId] = useState('');
  const [showPastGames, setShowPastGames] = useState(false);
  const [selectedCell, setSelectedCell] = useState([0, 0]);
  const [endGameMessage, setEndGameMessage] = useState('');
  const [introMessage, setIntroMessage] = useState('Welcome to Accessible Tic-Tac-Toe. Use arrow keys to navigate and Enter to mark your move. Player X goes first.');
  const [hasInteracted, setHasInteracted] = useState(false);

  const isGameEnded = winner || endGameMessage.includes("draw");

  useEffect(() => {
    setIntroMessage("Welcome to Accessible Tic-Tac-Toe. Use arrow keys to navigate and Enter to mark your move. Player X goes first.");
    createGame();
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => setHasInteracted(true);
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showPastGames || isGameEnded) return;

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
  }, [selectedCell, isGameEnded, showPastGames]);

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
    if (squares[row][col] || isGameEnded) return;
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
        triggerEndGameAnnouncement(`Player ${data.winner} wins! Press "G" to start a new game or "P" to view past games.`);
      } else if (data.board.every(row => row.every(cell => cell !== null))) {
        setWinner(null);
        triggerEndGameAnnouncement(`It's a draw! Press "G" to start a new game or "P" to view past games.`);
      }
    } catch (err) {
      console.error('Failed to make a move:', err);
    }
  };

  const triggerEndGameAnnouncement = (announcement) => {
    setEndGameMessage(announcement);
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
    } catch (err) {
      console.error('Failed to reset the game:', err);
    }
  };

  const resetBoard = () => {
    setSquares(Array(3).fill(null).map(() => Array(3).fill(null)));
    setIsXNext(true);
    setWinner(null);
    setSelectedCell([0, 0]);
    setEndGameMessage('');
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <p aria-live="polite" role="status">{introMessage}</p>
      {!showPastGames ? (
        <>
          <p>{winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`}</p>
          <Board squares={squares} onSquareClick={handleSquareClick} selectedCell={selectedCell} hasInteracted={hasInteracted} />
          <button onClick={resetGame} style={{ marginTop: '20px' }}>Reset Game</button>
          <button onClick={() => setShowPastGames(true)}>View Past Games</button>
        </>
      ) : (
        <>
          <PastGames />
          <button onClick={() => setShowPastGames(false)}>Back to Game</button>
        </>
      )}
      
      {endGameMessage && (
        <div aria-live="assertive" role="status" style={{ marginTop: '20px' }}>
          <p>{endGameMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;
