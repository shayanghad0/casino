import React, { useState, useCallback } from 'react';
import { useGame } from '../store/GameStore';

export default function Mines() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(5);
  const [grid, setGrid] = useState<(number | null)[]>(Array(25).fill(null));
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [mines, setMines] = useState<number[]>([]);

  const startGame = useCallback(() => {
    if (!placeBet(betAmount, 'Mines')) return;
    const minePositions: number[] = [];
    while (minePositions.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!minePositions.includes(pos)) minePositions.push(pos);
    }
    setMines(minePositions);
    setGrid(Array(25).fill(null));
    setRevealed(Array(25).fill(false));
    setGameActive(true);
    setGameOver(false);
    setCurrentMultiplier(1);
  }, [betAmount, mineCount, placeBet]);

  const revealCell = (index: number) => {
    if (!gameActive || gameOver || revealed[index]) return;
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    if (mines.includes(index)) {
      setGameOver(true);
      setGameActive(false);
      const allRevealed = [...newRevealed];
      mines.forEach(m => allRevealed[m] = true);
      setRevealed(allRevealed);
      addWinnings(-betAmount, 'Mines', 0);
    } else {
      const safeRevealed = newRevealed.filter((r, i) => r && !mines.includes(i)).length;
      const totalSafe = 25 - mineCount;
      const newMultiplier = 1 + (safeRevealed / totalSafe) * (mineCount * 0.5);
      setCurrentMultiplier(Math.floor(newMultiplier * 100) / 100);
    }
  };

  const cashOut = () => {
    if (!gameActive || gameOver) return;
    setGameActive(false);
    setGameOver(true);
    const winnings = betAmount * currentMultiplier;
    addWinnings(winnings, 'Mines', currentMultiplier);
  };

  return (
    <div>
      <h1 className="page-title">💣 Mines</h1>
      <p className="page-subtitle">Reveal safe cells and avoid the mines!</p>
      <div className="game-container">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Mines: {mineCount}</label>
            <input type="range" min={1} max={20} value={mineCount} onChange={e => setMineCount(Number(e.target.value))} disabled={gameActive} className="dice-slider" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Bet Amount</label>
            <input type="number" className="input" value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} disabled={gameActive} style={{ width: 100 }} />
          </div>
        </div>
        <div className="mines-grid">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className={`mine-cell ${revealed[i] ? (mines.includes(i) ? 'revealed-mine' : 'revealed-safe') : ''}`} onClick={() => revealCell(i)}>
              {revealed[i] ? (mines.includes(i) ? '💣' : '💎') : '?'}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {!gameActive && !gameOver && (
            <button className="btn btn-primary btn-lg" onClick={startGame}>Start Game - Bet {formatCurrency(betAmount)}</button>
          )}
          {gameActive && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)', marginBottom: 12 }}>Current: {currentMultiplier.toFixed(2)}x | Value: {formatCurrency(betAmount * currentMultiplier)}</div>
              <button className="btn btn-primary btn-lg" onClick={cashOut}>Cash Out - {formatCurrency(betAmount * currentMultiplier)}</button>
            </div>
          )}
          {gameOver && revealed.some((r, i) => r && mines.includes(i)) && (
            <div style={{ color: 'var(--accent-red)', fontWeight: 700 }}>💥 You hit a mine! Lost {formatCurrency(betAmount)}</div>
          )}
          {gameOver && !revealed.some((r, i) => r && mines.includes(i)) && gameActive === false && currentMultiplier > 1 && (
            <button className="btn btn-primary btn-lg" onClick={startGame}>Play Again</button>
          )}
        </div>
      </div>
    </div>
  );
}
