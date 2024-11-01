import React from 'react';

const Square = ({ value, onClick, isSelected, row, col }) => {
  return (
    <button
      className={`square ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="gridcell"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
    //   aria-label={`Row ${row + 1}, Column ${col + 1}, ${value || 'empty'}`}
      style={{
        backgroundColor: isSelected ? '#d3d3f3' : 'transparent', 
        width: 50,
        height: 50,
      }}
    >
      {value || '-'}
    </button>
  );
};

export default Square;
