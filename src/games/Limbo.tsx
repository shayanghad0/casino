import React, { useState } from 'react';
import { useGame } from '../store/GameStore';

export default function Limbo() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [result, setResult] = useState<number | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    if (!placeBet(betAmount, 'Limbo')) return;
    setIsPlaying(true);
    setTimeout(() => {
      const r = Math.random();
      const maxMultiplier = 0.99 / (1 - r);
      const finalMultiplier = Math.floor(maxMultiplier * 100) / 100;
      setResult(finalMultiplier);
      if (finalMultiplier >= targetMultiplier) {
        const winnings = betAmount * targetMultiplier;
        addWinnings(winnings, 'Limbo', targetMultiplier);
        setWon(true);
      } else {
        addWinnings(-betAmount, 'Limbo', 0);
        setWon(false);
      }
      setIsPlaying(false);
    }, 800);
  };

  return (
    <div>
      <h1 className="page-title">🎯 Limbo</h1>
      <p className="page-subtitle">Set a target multiplier and wait for the result!</p>
      <div className="game-container">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'var(--font-display)', color: result ? (won ? 'var(--accent-green)' : 'var(--accent-red)') : 'var(--text-primary)' }}>
            {isPlaying ? '...' : result ? `${result.toFixed(2)}x` : '🎯'}
          </div>
          {result && (
            <div style={{ fontSize: 18, marginTop: 8, color: won ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
              {won ? `Won ${formatCurrency(betAmount * targetMultiplier)}!` : `Lost ${formatCurrency(betAmount)}`}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column', maxWidth: 300, margin: '0 auto' }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Target Multiplier: {targetMultiplier}x</label>
            <input type="range" min={1.01} max={100} step={0.01} value={targetMultiplier} onChange={e => setTargetMultiplier(Number(e.target.value))} className="dice-slider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>1.01x</span><span>100x</span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <input type="number" className="input" style={{ width: '100%', textAlign: 'center', fontSize: 20, fontWeight: 700 }} value={targetMultiplier} onChange={e => setTargetMultiplier(Number(e.target.value))} step={0.01} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Bet Amount</label>
            <input type="number" className="input" value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} style={{ textAlign: 'center' }} />
          </div>
          <button className="btn btn-primary btn-lg" onClick={play} disabled={isPlaying}>
            {isPlaying ? 'Rolling...' : `Bet ${formatCurrency(betAmount)}`}
          </button>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            Win chance: ~{(99 / targetMultiplier).toFixed(2)}% | Payout: {targetMultiplier}x
          </div>
        </div>
      </div>
    </div>
  );
}
