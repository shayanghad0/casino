import React from 'react';
import { useGame } from '../store/GameStore';

export default function History() {
  const { state, formatCurrency } = useGame();

  return (
    <div className="section">
      <div className="section-title">📊 Game History</div>
      <div style={{ overflowX: 'auto' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Player</th>
              <th>Bet</th>
              <th>Multiplier</th>
              <th>Cash Out</th>
              <th>Profit</th>
              <th>MD5</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {state.gameHistory.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                  No games played yet. Start playing!
                </td>
              </tr>
            ) : (
              state.gameHistory.slice(0, 20).map(entry => (
                <tr key={entry.id}>
                  <td><strong>{entry.game}</strong></td>
                  <td>{entry.player}</td>
                  <td>{formatCurrency(entry.bet)}</td>
                  <td>{entry.multiplier.toFixed(2)}x</td>
                  <td>{entry.cashedOut ? '✅' : '❌'}</td>
                  <td className={entry.profit >= 0 ? 'history-profit-positive' : 'history-profit-negative'}>
                    {formatCurrency(entry.profit)}
                  </td>
                  <td className="history-md5" title={entry.md5}>{entry.md5}</td>
                  <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
