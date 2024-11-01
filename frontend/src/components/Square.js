import React from 'react';

const Square = ({ value, onClick, highlighted }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '50px',
        height: '50px',
        margin: '5px',
        fontSize: '24px',
        backgroundColor: highlighted ? '#add8e6' : '#fff', // Light blue for highlighted
      }}
    >
      {value || '-'}
    </button>
  );
};

export default Square;
