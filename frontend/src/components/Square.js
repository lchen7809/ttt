//individual square components, exported to Board component
import React from 'react';

const Square = ({ value, onClick }) => {
    console.log(value);
    return (
        <button
        className="square"
        onClick={onClick}
        style={{ width: '50px', height: '50px', fontSize: '20px' }}
        >
        {value}
        </button>
    );
};

export default Square;
