// src/components/Game.js
import React, { useState, useEffect, useRef } from 'react';
import Alien from './Alien';
import ScoreBoard from './ScoreBoard';
import { updateScore } from '../utils/api';

const Game = ({ wallet }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [aliens, setAliens] = useState([]);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    if (gameOver) {
      updateScore(wallet, score);
    }
  }, [gameOver, wallet, score]);

  useEffect(() => {
    const createAlien = () => {
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const newAlien = {
        id: Date.now(),
        x: Math.random() * (gameArea.width - 50),
        y: Math.random() * (gameArea.height - 50),
      };
      setAliens(prevAliens => [...prevAliens, newAlien]);
    };

    const interval = setInterval(createAlien, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAlienClick = (id) => {
    setScore(prevScore => prevScore + 1);
    setAliens(prevAliens => prevAliens.filter(alien => alien.id !== id));
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  return (
    <div className="game-container">
      <ScoreBoard score={score} />
      <div ref={gameAreaRef} className="game-area">
        {aliens.map(alien => (
          <Alien
            key={alien.id}
            id={alien.id}
            x={alien.x}
            y={alien.y}
            onClick={handleAlienClick}
          />
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Your score: {score}</p>
        </div>
      )}
      <button onClick={handleGameOver} className="end-game-btn">End Game</button>
    </div>
  );
};

export default Game;