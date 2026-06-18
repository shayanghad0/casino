import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../store/GameStore';

const CHICKENS = [
  { id: 0, emoji: '🐔', name: 'Clucky', color: '#ff6b6b', odds: 2.5 },
  { id: 1, emoji: '🐓', name: 'Rooster', color: '#ffd93d', odds: 3 },
  { id: 2, emoji: '🐤', name: 'Chick', color: '#6bcb77', odds: 4 },
  { id: 3, emoji: '🦃', name: 'Turkey', color: '#4d96ff', odds: 5 },
];

export default function ChickenRun() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [selectedChicken, setSelectedChicken] = useState<number>(0);
  const [positions, setPositions] = useState<number[]>([0, 0, 0, 0]);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [raceOver, setRaceOver] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRace = useCallback(() => {
    if (!placeBet(betAmount, 'Chicken Run')) return;
    setPositions([0, 0, 0, 0]);
    setIsRacing(true);
    setWinner(null);
    setRaceOver(false);
    intervalRef.current = setInterval(() => {
      setPositions(prev => {
        const newPositions = prev.map((pos, i) => {
          const speed = Math.random() * (4 + i * 0.5) + 1;
          return Math.min(pos + speed, 100);
        });
        const finished = newPositions.findIndex(p => p >= 100);
        if (finished >= 0) {
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            setWinner(finished);
            setRaceOver(true);
            setIsRacing(false);
            if (finished === selectedChicken) {
              addWinnings(betAmount * CHICKENS[selectedChicken].odds, 'Chicken Run', CHICKENS[selectedChicken].odds);
            } else {
              addWinnings(-betAmount, 'Chicken Run', 0);
            }
          }, 300);
        }
        return newPositions;
      });
    }, 80);
  }, [betAmount, selectedChicken, placeBet, addWinnings]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">🐔 Chicken Run</h1>
      <p className="page-subtitle">Pick your chicken and watch the race!</p>
      <div className="game-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CHICKENS.map((chicken, i) => (
            <div key={chicken.id} className="chicken-run-track" style={{ border: selectedChicken === i ? '2px solid var(--accent-gold)' : undefined, cursor: !isRacing ? 'pointer' : 'default' }} onClick={() => !isRacing && setSelectedChicken(i)}>
              <div className="chicken-run-character" style={{ left: `${positions[i]}%` }}>{chicken.emoji}</div>
              <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 600, color: chicken.color }}>{chicken.name} ({chicken.odds}x)</div>
              <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--text-muted)' }}>{selectedChicken === i ? '✅ Your pick' : ''}</div>
              <div style={{ position: 'absolute', right: 20, top: 0, bottom: 0, width: 2, background: 'repeating-linear-gradient(to bottom, white, white 4px, transparent 4px, transparent 8px)' }} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {!isRacing && !raceOver && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="number" className="input" style={{ width: 100 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} />
              <button className="btn btn-primary btn-lg" onClick={startRace}>Race! - {formatCurrency(betAmount)}</button>
            </div>
          )}
          {isRacing && <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-gold)' }}>🏁 Racing...</div>}
          {raceOver && winner !== null && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: winner === selectedChicken ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {CHICKENS[winner].emoji} {CHICKENS[winner].name} wins! {winner === selectedChicken ? `You won ${formatCurrency(betAmount * CHICKENS[selectedChicken].odds)}!` : `You lost ${formatCurrency(betAmount)}`}
              </div>
              <button className="btn btn-primary btn-lg" onClick={startRace}>Race Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
