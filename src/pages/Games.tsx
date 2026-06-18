import React from 'react';
import { Link } from 'react-router-dom';

const allGames = [
  { path: '/game/crash', name: 'Crash', icon: '📈', desc: 'Cash out before the multiplier crashes! Provably fair with MD5 verification.', category: 'Multiplier' },
  { path: '/game/mines', name: 'Mines', icon: '💣', desc: 'Reveal safe cells and avoid hidden mines.', category: 'Strategy' },
  { path: '/game/blackjack', name: 'Blackjack', icon: '🃏', desc: 'Classic 21 card game against the dealer.', category: 'Cards' },
  { path: '/game/limbo', name: 'Limbo', icon: '🎯', desc: 'Set target multiplier and wait for the result.', category: 'Multiplier' },
  { path: '/game/dice', name: 'Dice', icon: '🎲', desc: 'Roll dice and predict over/under target.', category: 'Dice' },
  { path: '/game/keno', name: 'Keno', icon: '🔢', desc: 'Pick up to 10 numbers and match them.', category: 'Lottery' },
  { path: '/game/tower', name: 'Tower', icon: '🏗️', desc: 'Climb the tower choosing safe paths.', category: 'Strategy' },
  { path: '/game/plinko', name: 'Plinko', icon: '🟡', desc: 'Drop ball through pegs for multiplier prizes.', category: 'Arcade' },
  { path: '/game/roulette', name: 'Roulette', icon: '🎡', desc: 'European roulette with full betting options.', category: 'Table' },
  { path: '/game/chicken-run', name: 'Chicken Run', icon: '🐔', desc: 'Watch the chicken race for multipliers!', category: 'Racing' },
];

export default function Games() {
  return (
    <div>
      <h1 className="page-title">🎮 All Games</h1>
      <p className="page-subtitle">Choose from 10 exciting games. All games use provably fair technology.</p>
      <div className="games-grid">
        {allGames.map(game => (
          <Link to={game.path} key={game.path} className="game-card card-3d">
            <div className="card-3d-inner">
              <div className="game-card-image">{game.icon}</div>
              <div className="game-card-info">
                <div>
                  <span className="game-card-name">{game.name}</span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{game.category}</div>
                </div>
              </div>
              <div style={{ padding: '0 16px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>
                {game.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
