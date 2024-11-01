import React from 'react';
import Square from './Square';

const Board = ({ squares, onSquareClick, selectedCell }) => {
  return (
    <div role="grid" aria-label="Tic-Tac-Toe Board">
      {squares.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row" role="row">
          {row.map((square, colIndex) => (
            <Square
              key={colIndex}
              value={square}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              isSelected={selectedCell[0] === rowIndex && selectedCell[1] === colIndex}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
