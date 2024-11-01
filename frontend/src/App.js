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
  const [endGameMessage, setEndGameMessage] = useState('');
  const [introMessage, setIntroMessage] = useState('');
  const [announceEndGame, setAnnounceEndGame] = useState(false);

  const isGameEnded = winner || endGameMessage.includes("draw");

  useEffect(() => {
    setIntroMessage("Welcome to Accessible Tic-Tac-Toe. Use arrow keys to navigate and Enter to mark your move. Player X goes first.");
    createGame();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showPastGames) return;

      if (isGameEnded) {
        if (event.key === 'G' || event.key === 'g') {
          resetGame();
        } else if (event.key === 'P' || event.key === 'p') {
          setShowPastGames(true);
        }
        return;
      }

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
      setMessage('');
      
      if (data.winner) {
        setWinner(data.winner);
        triggerEndGameAnnouncement(`Player ${data.winner} wins! Press "G" to start a new game or "P" to view past games.`);
      } else if (data.board.every(row => row.every(cell => cell !== null))) {
        setWinner(null); 
        triggerEndGameAnnouncement(`It's a draw! Press "G" to start a new game or "P" to view past games.`);
      }

    } catch (err) {
      console.error('Failed to make a move:', err);
      setMessage(`Failed to make a move: ${err.message}`);
    }
  };

  const triggerEndGameAnnouncement = (announcement) => {
    setAnnounceEndGame(false);
    setTimeout(() => {
      setEndGameMessage(announcement);
      setAnnounceEndGame(true);
    }, 50); 
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
    setEndGameMessage('');
    setAnnounceEndGame(false);
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      {introMessage && (
        <p aria-live="polite" role="status">{introMessage}</p>
      )}
      {!showPastGames ? (
        <>
          <p>{winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`}</p>
          <Board squares={squares} onSquareClick={handleSquareClick} selectedCell={selectedCell} />
          <button onClick={resetGame} style={{ marginTop: '20px' }}>Reset Game</button>
          <button onClick={() => setShowPastGames(true)}>View Past Games</button>
        </>
      ) : (
        <>
          <PastGames />
          <button onClick={() => setShowPastGames(false)}>Back to Game</button>
        </>
      )}
      
      {announceEndGame && (
        <div aria-live="assertive" role="status" style={{ marginTop: '20px' }}>
          <p>{endGameMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;
