import React, { useState } from 'react';
import { useGame } from '../store/GameStore';

export default function Dice() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [target, setTarget] = useState(50);
  const [direction, setDirection] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const roll = () => {
    if (!placeBet(betAmount, 'Dice')) return;
    setIsRolling(true);
    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * 10001) / 100;
      setResult(rollResult);
      const isWin = direction === 'over' ? rollResult > target : rollResult < target;
      if (isWin) {
        const winChance = direction === 'over' ? (100 - target) / 100 : target / 100;
        const multiplier = Math.floor((0.99 / winChance) * 100) / 100;
        const winnings = betAmount * multiplier;
        addWinnings(winnings, 'Dice', multiplier);
        setWon(true);
      } else {
        addWinnings(-betAmount, 'Dice', 0);
        setWon(false);
      }
      setIsRolling(false);
    }, 600);
  };

  const winChance = direction === 'over' ? (100 - target) : target;
  const multiplier = winChance > 0 ? Math.floor((0.99 / (winChance / 100)) * 100) / 100 : 99;

  return (
    <div>
      <h1 className="page-title">🎲 Dice</h1>
      <p className="page-subtitle">Roll {direction} {target.toFixed(2)}</p>
      <div className="game-container">
        <div className="dice-container">
          <div className="dice-result" style={{ background: result !== null ? (won ? 'rgba(0,230,118,0.15)' : 'rgba(255,71,87,0.15)') : undefined }}>
            {isRolling ? '🎲' : result !== null ? result.toFixed(2) : '🎲'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`btn ${direction === 'over' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setDirection('over')}>Over</button>
            <button className={`btn ${direction === 'under' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setDirection('under')}>Under</button>
          </div>
          <div style={{ width: '100%', maxWidth: 300 }}>
            <input type="range" min={1} max={99} value={target} onChange={e => setTarget(Number(e.target.value))} className="dice-slider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>1</span><span>Target: {target.toFixed(2)}</span><span>99</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="number" className="input" style={{ width: 100, textAlign: 'center' }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} />
            <button className="btn btn-primary btn-lg" onClick={roll} disabled={isRolling}>Roll - {formatCurrency(betAmount)}</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            Win chance: {winChance}% | Payout: {multiplier}x
            {result !== null && (
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700, color: won ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {won ? `Won ${formatCurrency(betAmount * multiplier)}!` : `Lost ${formatCurrency(betAmount)}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
