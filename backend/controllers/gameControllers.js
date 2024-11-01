// let games = {};
const db = require('../db');


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
      return { winner: board[a[0]][a[1]], line };
    }
  }

  return null;
};

exports.createGame = (req, res) => {
    const gameId = `game_${Date.now()}`; //unique game id with time now 
    const initialBoard = JSON.stringify(Array(3).fill(null).map(() => Array(3).fill(null))); 
    const isXNext = 1; 
    const winner = null;
    const winningSquares = JSON.stringify([]);
  
    const sql = `
      INSERT INTO games (id, board, isXNext, winner, winningSquares)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.run(sql, [gameId, initialBoard, isXNext, winner, winningSquares], (err) => {
      if (err) {
        console.error('Error: Failed to create game:', err.message);
        return res.send('Error: Failed to create game');
      }
  
      res.json({ gameId });
    });
  };
  
  exports.makeMove = (req, res) => {
    const { gameId, row, col } = req.body;
  
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return res.send('Invalid move: Out of bounds');
    }
  
    db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, rowData) => {
      if (err) {
        console.error('Error: Failed to retrieve game:', err.message);
        return res.send('Error: Failed to retrieve game');
      }
  
      if (!rowData) {
        return res.send('Game not found');
      }
  
      let board;
      try {
        board = JSON.parse(rowData.board); 
      } catch (error) {
        console.error('Error: Failed to parse board:', error.message);
        return res.send('Error: Failed to parse board');
      }
  
      if (!Array.isArray(board) || board.length !== 3 || !board.every(row => Array.isArray(row) && row.length === 3)) {
        console.error('Error: Invalid board format');
        return res.send('Error: Invalid board format');
      }
  
      let isXNext = rowData.isXNext;
      let winner = rowData.winner;
  
      if (board[row][col] || winner) {
        return res.send('Error: Cell already occupied or game already ended');
      }
  
      board[row][col] = isXNext ? 'X' : 'O';
      isXNext = isXNext ? 0 : 1;
  
      const result = checkWinner(board);
      if (result) {
        winner = result.winner;
      }
  
      const sql = `
        UPDATE games
        SET board = ?, isXNext = ?, winner = ?, winningSquares = ?
        WHERE id = ?
      `;
  
      db.run(sql, [JSON.stringify(board), isXNext, winner, JSON.stringify(result ? result.line : []), gameId], (err) => {
        if (err) {
          console.error('Error: Failed to update game:', err.message);
          return res.send('Error: Failed to update game');
        }
  
        res.json({
          board,
          isXNext,
          winner,
          winningSquares: result ? result.line : []
        });
      });
    });
  };
  
  
  exports.getGameState = (req, res) => {
    const { gameId } = req.params;
  
    const sql = `SELECT * FROM games WHERE id = ?`;
    db.get(sql, [gameId], (err, row) => {
      if (err) {
        console.error('Error retrieving game:', err.message);
        return res.send('Error retrieving game');
      }
  
      if (!row) {
        return res.send('Game not found');
      }
  
      try {
        row.board = JSON.parse(row.board);
        row.winningSquares = JSON.parse(row.winningSquares);
      } catch (parseError) {
        console.error('Error parsing game data:', parseError.message);
        return res.send('Error parsing game data');
      }
  
      res.json(row);
    });
  };
  

exports.resetGame = (req, res) => {
    const { gameId } = req.body;
  
    db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, row) => {
      if (err) {
        console.error('Error: Failed to retrieve game:', err.message);
        return res.send('Error: Failed to retrieve game');
      }
  
      if (!row) {
        return res.send('Game is not found');
      }
  
      const newBoard = JSON.stringify(Array(3).fill(null).map(() => Array(3).fill(null)));
      const isXNext = 1;
      const winner = null;
      const winningSquares = JSON.stringify([]);
  
      const sql = `
        UPDATE games
        SET board = ?, isXNext = ?, winner = ?, winningSquares = ?
        WHERE id = ?
      `;
  
      db.run(sql, [newBoard, isXNext, winner, winningSquares, gameId], (err) => {
        if (err) {
          console.error('Error: Failed to reset game:', err.message);
          return res.send('Error: Failed to reset game');
        }
  
        res.json({ message: 'Game reset successfully', gameId });
      });
    });
  };

  exports.getPastGames = (req, res) => {
    const sql = `SELECT id, board, winner FROM games WHERE winner IS NOT NULL`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error: Failed to fetch past games:', err.message);
        return res.send('Error: Failed to fetch past games');
      }
  
      if (!rows || rows.length === 0) {
        return res.send('Error: No past games found');
      }
  
      res.json(rows);
    });
  };
  
