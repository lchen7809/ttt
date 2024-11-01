import React from 'react';
import Square from './Square';

const Board = ({ squares, onSquareClick, selectedCell }) => {
  return (
    <div>
      {squares.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((square, colIndex) => (
            <Square
              key={colIndex}
              value={square}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              highlighted={selectedCell[0] === rowIndex && selectedCell[1] === colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
