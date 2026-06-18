import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../store/GameStore';
import History from '../components/History';
import GameCard from '../components/GameCard';

const featuredGames = [
  { path: '/game/crash', name: 'Crash', icon: '📈', badge: 'HOT', badgeClass: 'hot' },
  { path: '/game/mines', name: 'Mines', icon: '💣', badge: 'NEW' },
  { path: '/game/blackjack', name: 'Blackjack', icon: '🃏' },
  { path: '/game/roulette', name: 'Roulette', icon: '🎡' },
];

const allGames = [
  { path: '/game/crash', name: 'Crash', icon: '📈', desc: 'Cash out before it crashes!' },
  { path: '/game/mines', name: 'Mines', icon: '💣', desc: 'Avoid the mines, collect gems' },
  { path: '/game/blackjack', name: 'Blackjack', icon: '🃏', desc: 'Beat the dealer to 21' },
  { path: '/game/limbo', name: 'Limbo', icon: '🎯', desc: 'Target multiplier game' },
  { path: '/game/dice', name: 'Dice', icon: '🎲', desc: 'Roll over or under target' },
  { path: '/game/keno', name: 'Keno', icon: '🔢', desc: 'Pick numbers and match' },
  { path: '/game/tower', name: 'Tower', icon: '🏗️', desc: 'Climb the tower safely' },
  { path: '/game/plinko', name: 'Plinko', icon: '🟡', desc: 'Drop ball for multipliers' },
  { path: '/game/roulette', name: 'Roulette', icon: '🎡', desc: 'Classic wheel spin' },
  { path: '/game/chicken-run', name: 'Chicken Run', icon: '🐔', desc: 'Race the chicken!' },
];

export default function Home() {
  const { state, formatCurrency } = useGame();

  return (
    <div>
      <h1 className="page-title">🎰 Welcome to Casino</h1>
      <p className="page-subtitle">
        Balance: <strong style={{ color: 'var(--accent-green)' }}>{formatCurrency(state.user.balance)}</strong> | 
        Total Wagered: {formatCurrency(state.user.totalWagered)} | 
        Total Won: <span style={{ color: 'var(--accent-green)' }}>{formatCurrency(state.user.totalWon)}</span>
      </p>

      <div className="section">
        <div className="section-title">🔥 Featured Games</div>
        <div className="games-grid">
          {featuredGames.map(game => (
            <GameCard key={game.path} {...game} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">🎮 All Games</div>
        <div className="games-grid">
          {allGames.map(game => (
            <Link to={game.path} key={game.path} className="game-card">
              <div className="game-card-image">{game.icon}</div>
              <div className="game-card-info">
                <span className="game-card-name">{game.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{game.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">
          📜 <Link to="/rules" style={{ color: 'var(--accent-blue)', fontSize: 13 }}>View All Rules →</Link>
        </div>
      </div>

      <History />
    </div>
  );
}
