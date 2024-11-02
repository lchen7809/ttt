import React, { useEffect, useRef } from 'react';
import Square from './Square';

const Board = ({ squares, onSquareClick, selectedCell, hasInteracted  }) => {
    useEffect(() => {
    const [row, col] = selectedCell;
    const cellContent = squares[row][col] === 'X' ? 'X' : squares[row][col] === 'O' ? 'O' : 'Empty';
    playCellAudio(row, col, cellContent);
    }, [selectedCell, squares]);
        
    const playCellAudio = (row, col, cellContent) => {
        const firstAudioPath = `/sounds/RC/R${row + 1}C${col + 1}.mp3`;
        console.log(firstAudioPath);
        const secondAudioPath = `/sounds/${cellContent}/R${row + 1}C${col + 1}${cellContent}.mp3`;
      
        const firstAudio = new Audio(firstAudioPath);
        const secondAudio = new Audio(secondAudioPath);
      
        firstAudio.addEventListener("ended", () => {
          secondAudio.play().catch((error) => console.error("Second audio play failed:", error));
        });
      
        firstAudio.play().catch((error) => console.error("First audio play failed:", error));
      };

    
      return (
        <div>
          {squares.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((square, colIndex) => (
                <Square
                  key={colIndex}
                  value={square}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  isSelected={selectedCell[0] === rowIndex && selectedCell[1] === colIndex}
                />
              ))}
            </div>
          ))}
        </div>
        
      );
    };
    
export default Board;