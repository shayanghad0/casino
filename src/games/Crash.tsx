import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../store/GameStore';
import History from '../components/History';

export default function Crash() {
  const { state, dispatch, placeBet, addWinnings, formatCurrency, generateMD5 } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isRunning, setIsRunning] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [crashPoint, setCrashPoint] = useState(1.00);
  const [gameHash, setGameHash] = useState('');
  const [cashedOut, setCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = useCallback(() => {
    const seed = Math.random().toString(36).substring(2);
    const hash = generateMD5(seed);
    const r = Math.random();
    let cp: number;
    if (r < 0.01) {
      cp = 1.00;
    } else {
      cp = Math.floor(0.99 / (1 - r) * 100) / 100;
      cp = Math.max(1.01, Math.min(cp, 1000));
    }
    setGameHash(hash);
    setCrashPoint(cp);
    setMultiplier(1.00);
    setCrashed(false);
    setCashedOut(false);
    setIsRunning(false);
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setIsRunning(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [generateMD5]);

  useEffect(() => {
    startRound();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const m = Math.pow(Math.E, elapsed * 0.08);
      const currentMultiplier = Math.floor(m * 100) / 100;
      if (currentMultiplier >= crashPoint) {
        setMultiplier(crashPoint);
        setCrashed(true);
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (hasBet && !cashedOut) {
          addWinnings(-betAmount, 'Crash', 0, gameHash);
        }
        setTimeout(() => {
          setHasBet(false);
          startRound();
        }, 4000);
      } else {
        setMultiplier(currentMultiplier);
      }
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, crashPoint]);

  const handlePlaceBet = () => {
    if (isRunning || crashed) return;
    if (placeBet(betAmount, 'Crash')) {
      setHasBet(true);
    }
  };

  const handleCashOut = () => {
    if (!isRunning || crashed || !hasBet || cashedOut) return;
    setCashedOut(true);
    const winnings = betAmount * multiplier;
    addWinnings(winnings, 'Crash', multiplier, gameHash);
  };

  return (
    <div>
      <h1 className="page-title">📈 Crash</h1>
      <p className="page-subtitle">Cash out before the multiplier crashes! Provably fair.</p>
      <div className="game-container">
        <div className="crash-display">
          <div className={`crash-multiplier ${isRunning ? 'running' : ''} ${crashed ? 'crashed' : ''}`}>
            {crashed ? '💥 CRASHED!' : countdown > 0 ? `Starting in ${countdown}...` : `${multiplier.toFixed(2)}x`}
          </div>
          {crashed && <div style={{ color: 'var(--text-muted)', marginTop: 8 }}>Crashed at: <strong style={{ color: 'var(--accent-red)' }}>{crashPoint.toFixed(2)}x</strong></div>}
          <div className="crash-graph" style={{ marginTop: 20 }}>
            <svg width="100%" height="200" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="crashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e676" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
                </linearGradient>
              </defs>
              {isRunning && (
                <path
                  d={`M 0 200 ${Array.from({ length: 50 }, (_, i) => {
                    const x = (i / 49) * 500;
                    const m = Math.pow(Math.E, (i / 49) * ((multiplier - 1) * 5)) * (200 / (multiplier || 1));
                    return `L ${x} ${200 - Math.min(m, 190)}`;
                  }).join(' ')}`}
                  fill="url(#crashGradient)"
                  stroke="#00e676"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
          <input type="number" className="input" style={{ width: 120 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} min={1} max={state.user.balance} disabled={isRunning || hasBet} />
          {!hasBet ? (
            <button className="btn btn-primary btn-lg" onClick={handlePlaceBet} disabled={isRunning && !crashed}>Place Bet</button>
          ) : (
            <button className="btn btn-danger btn-lg" onClick={handleCashOut} disabled={!isRunning || crashed || cashedOut} style={{ animation: cashedOut ? 'none' : 'pulse-glow 1s infinite' }}>
              {cashedOut ? `Cashed Out @ ${multiplier.toFixed(2)}x` : `Cash Out (${multiplier.toFixed(2)}x)`}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          {[1, 5, 10, 25, 50, 100].map(amt => (
            <button key={amt} className={`bet-amount-btn ${betAmount === amt ? 'selected' : ''}`} onClick={() => setBetAmount(amt)} disabled={isRunning || hasBet}>${amt}</button>
          ))}
        </div>
        {gameHash && <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>🔐 Round Hash: <span style={{ fontFamily: 'monospace' }}>{gameHash}</span></div>}
        {hasBet && <div style={{ textAlign: 'center', marginTop: 8, color: 'var(--accent-gold)', fontWeight: 600 }}>Your bet: {formatCurrency(betAmount)} | Potential win: {formatCurrency(betAmount * multiplier)}</div>}
      </div>
      <History />
    </div>
  );
}
