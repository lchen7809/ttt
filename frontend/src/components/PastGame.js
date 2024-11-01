import React, { useState, useEffect } from 'react';

const PastGames = () => {
  const [pastGames, setPastGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    fetchPastGames();
  }, []);

  const fetchPastGames = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/games/past-games');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      const data = await res.json();
      setPastGames(data);
      setMessage('');
    } catch (err) {
      console.error('Error: Failed to fetch past games:', err);
      setMessage(`Error: Failed to fetch past games: ${err.message}`);
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game); 
  };

  const renderBoard = (board) => {
    try {
      const parsedBoard = Array.isArray(board) ? board : JSON.parse(board);
      return parsedBoard.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, colIndex) => (
            <span key={colIndex} style={{ margin: '0 10px' }}>{cell || '-'}</span>
          ))}
        </div>
      ));
    } catch (error) {
      console.error("Failed to parse board:", error.message);
      return <div>Error loading board</div>;
    }
  };

  return (
    <div>
      <h2>Past Games</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      
      <ul>
        {pastGames.map((game) => (
          <li key={game.id} onClick={() => handleGameClick(game)}>
            Game ID: {game.id} - Winner: {game.winner}
          </li>
        ))}
      </ul>

      {selectedGame && (
        <div>
          <h3>Game Details</h3>
          <div>Game ID: {selectedGame.id}</div>
          <div>Winner: {selectedGame.winner}</div>
          <div>Board:</div>
          {renderBoard(selectedGame.board)}
        </div>
      )}
    </div>
  );
};

export default PastGames;
