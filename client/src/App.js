import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import WalletConnect from './components/WalletConnect';
import ScoreBoard from './components/ScoreBoard';
import { getWallet, setWallet } from './utils/Wallet';
import { fetchLeaderboard } from './utils/api';
import './App.css';

function App() {
  const [wallet, setWalletState] = useState(getWallet());
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const data = await fetchLeaderboard();
    setLeaderboard(data);
  };

  const handleWalletConnect = (address) => {
    setWallet(address);
    setWalletState(address);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const endGame = async (finalScore) => {
    setScore(finalScore);
    setGameState('gameOver');
    await loadLeaderboard();
  };

  const renderContent = () => {
    switch (gameState) {
      case 'menu':
        return (
          <div className="menu">
            <h1>Alien Tap Game</h1>
            {wallet ? (
              <button onClick={startGame}>Start Game</button>
            ) : (
              <WalletConnect onConnect={handleWalletConnect} />
            )}
            <ScoreBoard leaderboard={leaderboard} />
          </div>
        );
      case 'playing':
        return <Game wallet={wallet} onGameEnd={endGame} />;
      case 'gameOver':
        return (
          <div className="game-over">
            <h2>Game Over</h2>
            <p>Your score: {score}</p>
            <button onClick={() => setGameState('menu')}>Back to Menu</button>
            <ScoreBoard leaderboard={leaderboard} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;