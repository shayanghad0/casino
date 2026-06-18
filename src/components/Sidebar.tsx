import React from 'react';
import { NavLink } from 'react-router-dom';

const games = [
  { path: '/game/crash', name: 'Crash', icon: '📈' },
  { path: '/game/mines', name: 'Mines', icon: '💣' },
  { path: '/game/blackjack', name: 'Blackjack', icon: '🃏' },
  { path: '/game/limbo', name: 'Limbo', icon: '🎯' },
  { path: '/game/dice', name: 'Dice', icon: '🎲' },
  { path: '/game/keno', name: 'Keno', icon: '🔢' },
  { path: '/game/tower', name: 'Tower', icon: '🏗️' },
  { path: '/game/plinko', name: 'Plinko', icon: '🟡' },
  { path: '/game/roulette', name: 'Roulette', icon: '🎡' },
  { path: '/game/chicken-run', name: 'Chicken Run', icon: '🐔' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🎰 CASINO</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          <span className="sidebar-icon">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/games" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-icon">🎮</span>
          <span>All Games</span>
        </NavLink>
        <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 0' }} />
        {games.map(game => (
          <NavLink key={game.path} to={game.path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="sidebar-icon">{game.icon}</span>
            <span>{game.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/rules" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="sidebar-icon">📜</span>
          <span>Rules & How to Play</span>
        </NavLink>
      </div>
    </aside>
  );
}
