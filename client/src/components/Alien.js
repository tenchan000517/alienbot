// src/components/Alien.js
import React from 'react';

const Alien = ({ id, x, y, onClick }) => {
  return (
    <div
      className="alien"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '50px',
        height: '50px',
        backgroundColor: 'green',
        borderRadius: '50%',
        cursor: 'pointer'
      }}
      onClick={() => onClick(id)}
    />
  );
};

export default Alien;