import React, { useState, useCallback } from 'react';
import { useGame } from '../store/GameStore';

const ROWS = 12;
const MULTIPLIERS = {
  low: [5, 2, 1.5, 1.1, 0.5, 0.3, 0.5, 1.1, 1.5, 2, 5],
  medium: [15, 5, 2, 1, 0.3, 0.2, 0.3, 1, 2, 5, 15],
  high: [50, 10, 3, 0.5, 0.2, 0.1, 0.2, 0.5, 3, 10, 50],
};

export default function Plinko() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);
  const [landedSlot, setLandedSlot] = useState<number | null>(null);
  const [isDropping, setIsDropping] = useState(false);

  const dropBall = useCallback(() => {
    if (!placeBet(betAmount, 'Plinko')) return;
    setIsDropping(true);
    setLandedSlot(null);
    setBallPosition({ x: 50, y: 5 });
    let currentSlot = Math.floor(Math.random() * 2);
    const slots = ROWS + 1;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      currentSlot += Math.random() > 0.5 ? 1 : -1;
      currentSlot = Math.max(0, Math.min(slots - 1, currentSlot));
      const progress = step / ROWS;
      const x = ((currentSlot + 0.5) / slots) * 100;
      const y = progress * 85 + 5;
      setBallPosition({ x, y });
      if (step >= ROWS) {
        clearInterval(interval);
        setLandedSlot(currentSlot);
        setIsDropping(false);
        const multiplier = MULTIPLIERS[risk][currentSlot];
        addWinnings(betAmount * multiplier, 'Plinko', multiplier);
      }
    }, 150);
  }, [betAmount, risk, placeBet, addWinnings]);

  const slots = ROWS + 1;

  return (
    <div>
      <h1 className="page-title">🟡 Plinko</h1>
      <p className="page-subtitle">Drop the ball and watch it bounce!</p>
      <div className="game-container">
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          {(['low', 'medium', 'high'] as const).map(r => (
            <button key={r} className={`bet-amount-btn ${risk === r ? 'selected' : ''}`} onClick={() => setRisk(r)} disabled={isDropping}>
              {r.charAt(0).toUpperCase() + r.slice(1)} Risk
            </button>
          ))}
        </div>
        <div className="plinko-board" style={{ height: 400, position: 'relative' }}>
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row}>
              {Array.from({ length: row + 3 }, (_, col) => (
                <div key={col} className="plinko-peg" style={{ left: `${((col + 0.5) / (row + 3)) * 100}%`, top: `${((row + 1) / (ROWS + 1)) * 85 + 5}%` }} />
              ))}
            </div>
          ))}
          {ballPosition && <div className="plinko-ball" style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%`, transform: 'translate(-50%, -50%)' }} />}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex' }}>
            {MULTIPLIERS[risk].map((mult, i) => (
              <div key={i} className="plinko-slot" style={{
                left: `${(i / (slots - 1)) * 100}%`,
                background: landedSlot === i ? 'var(--accent-green)' : 'var(--bg-card)',
                color: landedSlot === i ? '#000' : mult >= 10 ? 'var(--accent-gold)' : mult >= 2 ? 'var(--accent-green)' : 'var(--text-secondary)',
                fontWeight: landedSlot === i ? 700 : 500,
                transform: 'translateX(-50%)',
              }}>{mult}x</div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="number" className="input" style={{ width: 100 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} disabled={isDropping} />
            <button className="btn btn-primary btn-lg" onClick={dropBall} disabled={isDropping}>
              {isDropping ? 'Dropping...' : `Drop - ${formatCurrency(betAmount)}`}
            </button>
          </div>
          {landedSlot !== null && (
            <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: MULTIPLIERS[risk][landedSlot] >= 1 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              Landed on {MULTIPLIERS[risk][landedSlot]}x! {MULTIPLIERS[risk][landedSlot] >= 1 ? `Won ${formatCurrency(betAmount * MULTIPLIERS[risk][landedSlot])}` : `Lost ${formatCurrency(betAmount)}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
