import React, { useState, useEffect, useRef } from 'react';
import './PastGame.css';

const PastGames = () => {
  const [pastGames, setPastGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [highlightedGameIndex, setHighlightedGameIndex] = useState(null);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');
  const gameRefs = useRef([]);

  useEffect(() => {
    fetchPastGames();
  }, []);

  const fetchPastGames = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/games/past-games');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPastGames(data);
    } catch (err) {
      console.error('Failed to fetch past games:', err);
    }
  };

  const handleGameClick = (game, index) => {
    setSelectedGame(game);
    setSelectedGameIndex(index + 1);
    setHighlightedGameIndex(null); 
    gameRefs.current[index]?.focus(); 
  
    const announcement = `Game ${index + 1}. Winner is ${game.winner || 'no winner'}. Board: ${renderBoardForScreenReader(game.board)}`;
    setScreenReaderAnnouncement(announcement);
  };
  
  const handleKeyDown = (event, index) => {
    let newIndex = index;

    if (event.key === 'ArrowDown') {
      newIndex = (index + 1) % pastGames.length;
    } else if (event.key === 'ArrowUp') {
      newIndex = (index - 1 + pastGames.length) % pastGames.length;
    } else if (event.key === 'Enter') {
      handleGameClick(pastGames[index], index);
      return;
    }

    setHighlightedGameIndex(newIndex);
    gameRefs.current[newIndex]?.focus();
  };

  const renderBoard = (board) => {
    try {
      const parsedBoard = Array.isArray(board) ? board : JSON.parse(board);
      return parsedBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row" aria-hidden="true">
          {row.map((cell, colIndex) => (
            <span key={colIndex} className="cell" aria-hidden="true">
              {cell || '-'}
            </span>
          ))}
        </div>
      ));
    } catch (error) {
      console.error("Failed to parse board:", error.message);
      return <div>Error loading board</div>;
    }
  };

  const renderBoardForScreenReader = (board) => {
    try {
      const parsedBoard = Array.isArray(board) ? board : JSON.parse(board);
      return parsedBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => `Row ${rowIndex + 1} Column ${colIndex + 1} is ${cell || 'empty'}`)
          .join(' ')
      ).join('. ');
    } catch (error) {
      console.error('Failed to parse board:', error.message);
      return 'Error reading board';
    }
  };
  
  

  return (
    <div className="past-games-container">
      <h2 className="past-games-header" aria-live="polite" role="heading" aria-level="2">
        Past Games
      </h2>

      <ul className="past-games-list" role="list" aria-label="Past games list">
        {pastGames.map((game, index) => (
          <li
            key={game.id}
            ref={(el) => (gameRefs.current[index] = el)}
            onClick={() => handleGameClick(game, index)}
            tabIndex={0}
            role="button"
            aria-label={`Game ${index + 1}, press Enter to view details.`}
            className={`past-game-item ${index + 1 === selectedGameIndex ? 'selected' : ''} ${
              index === highlightedGameIndex ? 'highlighted' : ''
            }`}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            Game {index + 1} - Winner: {game.winner}
          </li>
        ))}
      </ul>

      {selectedGame && (
        <div aria-live="polite" role="region" className="past-game-details">
          <h3 role="heading" aria-level="3">Game {selectedGameIndex} Details</h3>
          <div>Game ID: {selectedGameIndex}</div>
          <div>Winner: {selectedGame.winner || 'No winner'}</div>
          <div>Board:</div>
          <div role="grid" aria-label={`Game ${selectedGameIndex} board`} className="board">
            {renderBoard(selectedGame.board)}
          </div>
        </div>
      )}

      <div className="sr-only" aria-live="assertive" role="alert">
        {screenReaderAnnouncement}
      </div>
    </div>
  );
};

export default PastGames;