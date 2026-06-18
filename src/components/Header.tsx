import React from 'react';
import { useGame } from '../store/GameStore';

export default function Header() {
  const { state, formatCurrency } = useGame();

  return (
    <header className="header">
      <div className="header-left">
        <div className="online-counter">
          <span className="online-dot" />
          <span>{state.onlinePlayers.toLocaleString()} players online</span>
        </div>
      </div>
      <div className="header-right">
        <div className="balance-display">
          <span>💰</span>
          <span className="balance-amount">{formatCurrency(state.user.balance)}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          👤 {state.user.username}
        </div>
      </div>
    </header>
  );
}
