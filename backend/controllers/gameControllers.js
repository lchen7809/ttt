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
  
    //sql line to insert into games table
    const sql = `
      INSERT INTO games (id, board, isXNext, winner, winningSquares)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.run(sql, [gameId, initialBoard, isXNext, winner, winningSquares], (err) => {
      if (err) {
        console.error('Failed to create game:', err.message);
        return res.status(500).send('Failed to create game');
      }
  
      res.json({ gameId });
    });
  };
  

exports.makeMove = (req, res) => {
  const { gameId, row, col } = req.body;
  const game = games[gameId];

  if (!game || game.winner) {
    return res.send('Error: Game not valid or game already ended' );
  }

  if (game.board[row][col]) {
    return res.send('Error: Box already occupied');
  }

  game.board[row][col] = game.isXNext ? 'X' : 'O';
  game.isXNext = !game.isXNext;

  const result = checkWinner(game.board);
  if (result) {
    game.winner = result.winner;
    game.winningSquares = result.line;
  }

  res.json({
    board: game.board,
    isXNext: game.isXNext,
    winner: game.winner,
    winningSquares: game.winningSquares
  });
};

exports.getGameState = (req, res) => {
  const { gameId } = req.params;
  const game = games[gameId];

  if (!game) {
    return res.send('Error: Game not found');
  }

  res.json(game);
};

exports.resetGame = (req, res) => {
  const { gameId } = req.body;
  if (!games[gameId]) {
    return res.send('Error: Game not found');
  }

  games[gameId] = {
    board: Array(3).fill(null).map(() => Array(3).fill(null)),
    isXNext: true,
    winner: null,
    winningSquares: [],
  };

  res.json({ message: 'Game reset successfully', game: games[gameId] });
};
