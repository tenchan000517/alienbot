// src/components/ScoreBoard.js
import React from 'react';

const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board">
      <h2>Score: {score}</h2>
    </div>
  );
};

export default ScoreBoard;