import React, { useState, useCallback } from 'react';
import { useGame } from '../store/GameStore';

const PAYOUT_TABLE: Record<number, number[]> = {
  1: [0, 3.5],
  2: [0, 0, 7],
  3: [0, 0, 2.5, 10],
  4: [0, 0, 1.5, 4, 15],
  5: [0, 0, 0, 2, 5, 20],
  6: [0, 0, 0, 1, 3, 7, 30],
  7: [0, 0, 0, 1, 2, 5, 10, 45],
  8: [0, 0, 0, 0, 2, 3, 6, 15, 60],
  9: [0, 0, 0, 0, 1, 2, 4, 8, 20, 80],
  10: [0, 0, 0, 0, 0, 1, 3, 5, 10, 25, 100],
};

export default function Keno() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'selecting' | 'revealing' | 'over'>('selecting');
  const [hitCount, setHitCount] = useState(0);

  const toggleNumber = (num: number) => {
    if (gamePhase !== 'selecting') return;
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const play = () => {
    if (selectedNumbers.length < 1 || !placeBet(betAmount, 'Keno')) return;
    const allNumbers = Array.from({ length: 40 }, (_, i) => i + 1);
    const available = allNumbers.filter(n => !selectedNumbers.includes(n));
    const shuffled = available.sort(() => Math.random() - 0.5);
    const drawn = [...selectedNumbers.sort(() => Math.random() - 0.5).slice(0, Math.min(selectedNumbers.length, 10))];
    while (drawn.length < 10) {
      const n = shuffled.pop()!;
      if (!drawn.includes(n)) drawn.push(n);
    }
    setDrawnNumbers(drawn.sort((a, b) => a - b));
    setGamePhase('revealing');
    const hits = selectedNumbers.filter(n => drawn.includes(n)).length;
    setHitCount(hits);
    setTimeout(() => {
      setGamePhase('over');
      const payoutMultiplier = PAYOUT_TABLE[selectedNumbers.length]?.[hits] || 0;
      if (payoutMultiplier > 0) {
        addWinnings(betAmount * payoutMultiplier, 'Keno', payoutMultiplier);
      } else {
        addWinnings(-betAmount, 'Keno', 0);
      }
    }, 1500);
  };

  const reset = () => {
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setGamePhase('selecting');
    setHitCount(0);
  };

  return (
    <div>
      <h1 className="page-title">🔢 Keno</h1>
      <p className="page-subtitle">Pick up to 10 numbers. Match to win!</p>
      <div className="game-container">
        <div className="keno-grid">
          {Array.from({ length: 40 }, (_, i) => i + 1).map(num => {
            const isSelected = selectedNumbers.includes(num);
            const isDrawn = drawnNumbers.includes(num);
            const isHit = isSelected && isDrawn;
            return (
              <div key={num} className={`keno-cell ${isSelected ? 'selected' : ''} ${isHit ? 'hit' : ''} ${gamePhase === 'over' && isDrawn && !isSelected ? 'miss' : ''}`} onClick={() => toggleNumber(num)}>
                {num}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {gamePhase === 'selecting' && (
            <div>
              <div style={{ marginBottom: 12, fontSize: 14, color: 'var(--text-secondary)' }}>Selected: {selectedNumbers.length}/10 numbers</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="number" className="input" style={{ width: 100 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} />
                <button className="btn btn-primary btn-lg" onClick={play} disabled={selectedNumbers.length === 0}>Play - {formatCurrency(betAmount)}</button>
              </div>
            </div>
          )}
          {gamePhase === 'revealing' && <div style={{ fontSize: 18, fontWeight: 700 }}>Drawing numbers...</div>}
          {gamePhase === 'over' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: hitCount > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {hitCount} hits! {hitCount > 0 ? `Won ${formatCurrency(betAmount * (PAYOUT_TABLE[selectedNumbers.length]?.[hitCount] || 0))}` : `Lost ${formatCurrency(betAmount)}`}
              </div>
              <button className="btn btn-primary btn-lg" onClick={reset}>Play Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
