//board component to be exported 
import React from 'react';
import Square from './Square';

const Board = ({ squares, onSquareClick }) => {
    console.log("squares:", squares);
    return (
        <div>
        {squares.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
            {row.map((square, colIndex) => (
                <Square
                key={colIndex}
                value={square}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                />
            ))}
            </div>
        ))}
        </div>
    );
};

export default Board;
