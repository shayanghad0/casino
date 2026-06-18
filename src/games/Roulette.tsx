import React, { useState } from 'react';
import { useGame } from '../store/GameStore';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

type BetType = 'number' | 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';

export default function Roulette() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState<BetType>('red');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);

  const spin = () => {
    if (betType === 'number' && selectedNumber === null) return;
    if (!placeBet(betAmount, 'Roulette')) return;
    setIsSpinning(true);
    setResult(null);
    setWon(null);
    const spinInterval = setInterval(() => {
      setResult(Math.floor(Math.random() * 37));
    }, 80);
    setTimeout(() => {
      clearInterval(spinInterval);
      const finalResult = Math.floor(Math.random() * 37);
      setResult(finalResult);
      setIsSpinning(false);
      let isWin = false;
      let multiplier = 0;
      switch (betType) {
        case 'number':
          isWin = finalResult === selectedNumber;
          multiplier = 36;
          break;
        case 'red':
          isWin = RED_NUMBERS.includes(finalResult);
          multiplier = 2;
          break;
        case 'black':
          isWin = BLACK_NUMBERS.includes(finalResult);
          multiplier = 2;
          break;
        case 'even':
          isWin = finalResult !== 0 && finalResult % 2 === 0;
          multiplier = 2;
          break;
        case 'odd':
          isWin = finalResult % 2 === 1;
          multiplier = 2;
          break;
        case 'low':
          isWin = finalResult >= 1 && finalResult <= 18;
          multiplier = 2;
          break;
        case 'high':
          isWin = finalResult >= 19 && finalResult <= 36;
          multiplier = 2;
          break;
      }
      setWon(isWin);
      if (isWin) {
        addWinnings(betAmount * multiplier, 'Roulette', multiplier);
      } else {
        addWinnings(-betAmount, 'Roulette', 0);
      }
    }, 2000);
  };

  const getNumberColor = (num: number): string => {
    if (num === 0) return '#006400';
    return RED_NUMBERS.includes(num) ? '#dc2626' : '#1a1a1a';
  };

  return (
    <div>
      <h1 className="page-title">🎡 Roulette</h1>
      <p className="page-subtitle">European Roulette - Place your bets!</p>
      <div className="game-container game-container-wide">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 200, height: 200, borderRadius: '50%', margin: '0 auto',
            background: `conic-gradient(${Array.from({ length: 37 }, (_, i) => {
              const color = i === 0 ? '#006400' : RED_NUMBERS.includes(i) ? '#dc2626' : '#1a1a1a';
              return `${color} ${(i / 37) * 360}deg ${((i + 1) / 37) * 360}deg`;
            }).join(', ')})`,
            border: '4px solid var(--accent-gold)',
            boxShadow: '0 0 30px rgba(255,215,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            animation: isSpinning ? 'spin-3d 0.1s linear infinite' : 'none',
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 24, color: '#000',
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}>
              {result !== null ? result : '?'}
            </div>
          </div>
          {result !== null && !isSpinning && (
            <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: won ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {won ? `Won ${formatCurrency(betAmount * (betType === 'number' ? 36 : 2))}!` : `Lost ${formatCurrency(betAmount)}`}
              <span style={{ marginLeft: 8, color: getNumberColor(result) === '#dc2626' ? '#dc2626' : getNumberColor(result) === '#006400' ? '#006400' : '#fff' }}>
                ({result} {result === 0 ? 'Green' : RED_NUMBERS.includes(result) ? 'Red' : 'Black'})
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
          {[
            { type: 'red' as BetType, label: '🔴 Red', color: '#dc2626' },
            { type: 'black' as BetType, label: '⚫ Black', color: '#1a1a1a' },
            { type: 'even' as BetType, label: 'Even', color: undefined },
            { type: 'odd' as BetType, label: 'Odd', color: undefined },
            { type: 'low' as BetType, label: '1-18', color: undefined },
            { type: 'high' as BetType, label: '19-36', color: undefined },
          ].map(b => (
            <button
              key={b.type}
              className={`bet-amount-btn ${betType === b.type && selectedNumber === null ? 'selected' : ''}`}
              onClick={() => { setBetType(b.type); setSelectedNumber(null); }}
              style={b.color ? { background: betType === b.type && selectedNumber === null ? undefined : b.color, color: '#fff' } : {}}
            >
              {b.label} (2x)
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          {Array.from({ length: 37 }, (_, i) => (
            <button
              key={i}
              className={`bet-amount-btn ${betType === 'number' && selectedNumber === i ? 'selected' : ''}`}
              onClick={() => { setBetType('number'); setSelectedNumber(i); }}
              style={{
                width: 36, height: 36, padding: 0, fontSize: 11,
                background: i === 0 ? '#006400' : RED_NUMBERS.includes(i) ? '#dc2626' : '#1a1a1a',
                color: '#fff', border: betType === 'number' && selectedNumber === i ? '2px solid var(--accent-gold)' : undefined,
              }}
            >
              {i}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="number" className="input" style={{ width: 100 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} disabled={isSpinning} />
          <button className="btn btn-primary btn-lg" onClick={spin} disabled={isSpinning || (betType === 'number' && selectedNumber === null)}>
            {isSpinning ? 'Spinning...' : `Spin - ${formatCurrency(betAmount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
