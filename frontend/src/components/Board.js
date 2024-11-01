import React, { useEffect, useRef } from 'react';
import Square from './Square';

const Board = ({ squares, onSquareClick, selectedCell, hasInteracted  }) => {
    const cellAudioFiles = useRef({
        0: {
            0: { 
                X: new Audio('/sounds/X/R1C1X.mp3'),
                O: new Audio('/sounds/O/R1C1O.mp3'),
                Empty: new Audio('/sounds/Empty/R1C1Empty.mp3')
            },
            1: {
                X: new Audio('/sounds/X/R1C2X.mp3'),
                O: new Audio('/sounds/O/R1C2O.mp3'),
                Empty: new Audio('/sounds/Empty/R1C2Empty.mp3')
            },
            2: {
                X: new Audio('/sounds/X/R1C3X.mp3'),
                O: new Audio('/sounds/O/R1C3O.mp3'),
                Empty: new Audio('/sounds/Empty/R1C3Empty.mp3')
            },
        },
        1: {
            0: {
                X: new Audio('/sounds/X/R2C1X.mp3'),
                O: new Audio('/sounds/O/R2C1O.mp3'),
                Empty: new Audio('/sounds/Empty/R2C1Empty.mp3')
            },
            1: {
                X: new Audio('/sounds/X/R2C2X.mp3'),
                O: new Audio('/sounds/O/R2C2O.mp3'),
                Empty: new Audio('/sounds/Empty/R2C2Empty.mp3')
            },
            2: {
                X: new Audio('/sounds/X/R2C3X.mp3'),
                O: new Audio('/sounds/O/R2C3O.mp3'),
                Empty: new Audio('/sounds/Empty/R2C3Empty.mp3')
            },
        },
        2: {
            0: {
                X: new Audio('/sounds/X/R3C1X.mp3'),
                O: new Audio('/sounds/O/R3C1O.mp3'),
                Empty: new Audio('/sounds/Empty/R3C1Empty.mp3')
            },
            1: {
                X: new Audio('/sounds/X/R3C2X.mp3'),
                O: new Audio('/sounds/O/R3C2O.mp3'),
                Empty: new Audio('/sounds/Empty/R3C2Empty.mp3')
            },
            2: {
                X: new Audio('/sounds/X/R3C3X.mp3'),
                O: new Audio('/sounds/O/R3C3O.mp3'),
                Empty: new Audio('/sounds/Empty/R3C3Empty.mp3')
            },
        },
    });
    useEffect(() => {
    const [row, col] = selectedCell;
    const cellContent = squares[row][col] === 'X' ? 'X' : squares[row][col] === 'O' ? 'O' : 'Empty';
    playCellAudio(row, col, cellContent);
    }, [selectedCell, squares]);
        
    const playCellAudio = (row, col, cellContent) => {
    console.log(`Attempting to play audio for row ${row}, col ${col}, content: ${cellContent}`);
    const audioFilePath = `/sounds/${cellContent}/R${row + 1}C${col + 1}${cellContent}.mp3`;
    const audio = new Audio(audioFilePath);
    audio.play()
        .then(() => console.log(`Audio played successfully for ${audioFilePath}`))
        .catch(err => console.error(`Failed to play audio for ${audioFilePath}:`, err));
    };
    

      const testAudio = () => {
        const audio = new Audio('/sounds/Empty/R1C1Empty.mp3');
        audio.play().then(() => console.log("Audio played successfully")).catch((err) => console.error("Audio play failed:", err));
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
           <button onClick={testAudio}>Test Audio</button>
        </div>
        
      );
    };
    
export default Board;