import React, { useState, useCallback } from 'react';
import { useGame } from '../store/GameStore';

const ROWS = 10;
const COLS = 3;

export default function Tower() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [mines, setMines] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [revealedMine, setRevealedMine] = useState<number | null>(null);

  const multipliers = {
    easy: [1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 4, 5, 6.5, 9],
    medium: [1.5, 2.2, 3.3, 5, 7.5, 11, 17, 25, 38, 60],
    hard: [2.5, 6, 15, 38, 95, 240, 600, 1500, 3800, 10000],
  };

  const startGame = useCallback(() => {
    if (!placeBet(betAmount, 'Tower')) return;
    const minePositions: number[] = [];
    for (let row = 0; row < ROWS; row++) {
      const mineCol = Math.floor(Math.random() * COLS);
      minePositions.push(row * COLS + mineCol);
    }
    setMines(minePositions);
    setSelectedCells([]);
    setCurrentRow(0);
    setGameActive(true);
    setGameOver(false);
    setRevealedMine(null);
  }, [betAmount, placeBet]);

  const selectCell = (cellIndex: number) => {
    if (!gameActive || gameOver) return;
    const row = Math.floor(cellIndex / COLS);
    if (row !== currentRow) return;
    if (mines.includes(cellIndex)) {
      setRevealedMine(cellIndex);
      setGameOver(true);
      setGameActive(false);
      addWinnings(-betAmount, 'Tower', 0);
    } else {
      setSelectedCells([...selectedCells, cellIndex]);
      setCurrentRow(row + 1);
      if (row + 1 >= ROWS) {
        const multiplier = multipliers[difficulty][ROWS - 1];
        addWinnings(betAmount * multiplier, 'Tower', multiplier);
        setGameActive(false);
        setGameOver(true);
      }
    }
  };

  const cashOut = () => {
    if (!gameActive || gameOver || currentRow === 0) return;
    const multiplier = multipliers[difficulty][currentRow - 1];
    addWinnings(betAmount * multiplier, 'Tower', multiplier);
    setGameActive(false);
    setGameOver(true);
  };

  const currentMultiplier = currentRow > 0 ? multipliers[difficulty][currentRow - 1] : 1;

  return (
    <div>
      <h1 className="page-title">🏗️ Tower</h1>
      <p className="page-subtitle">Climb the tower. Choose wisely!</p>
      <div className="game-container">
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Difficulty</label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button key={d} className={`bet-amount-btn ${difficulty === d ? 'selected' : ''}`} onClick={() => setDifficulty(d)} disabled={gameActive}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="tower-grid" style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const row = Math.floor(i / COLS);
            const isSelected = selectedCells.includes(i);
            const isMine = revealedMine === i || (gameOver && mines.includes(i) && selectedCells.length === 0);
            const isReachable = row === currentRow && gameActive;
            return (
              <div key={i} className={`tower-cell ${isSelected ? 'selected' : ''} ${isMine ? 'mine' : ''}`} onClick={() => selectCell(i)} style={{ cursor: isReachable ? 'pointer' : 'default', opacity: row < currentRow ? 1 : row === currentRow ? 1 : 0.4, gridRow: ROWS - row }}>
                {isSelected ? '✅' : isMine ? '💣' : row < currentRow ? '⬜' : '?'}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {!gameActive && !gameOver && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="number" className="input" style={{ width: 100 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} />
              <button className="btn btn-primary btn-lg" onClick={startGame}>Start - {formatCurrency(betAmount)}</button>
            </div>
          )}
          {gameActive && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-green)', marginBottom: 12 }}>
                Row {currentRow + 1}/{ROWS} | {currentMultiplier}x | {formatCurrency(betAmount * currentMultiplier)}
              </div>
              <button className="btn btn-primary" onClick={cashOut}>Cash Out - {formatCurrency(betAmount * currentMultiplier)}</button>
            </div>
          )}
          {gameOver && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: revealedMine !== null ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {revealedMine !== null ? `💥 Mine! Lost ${formatCurrency(betAmount)}` : `🎉 Completed! Won ${formatCurrency(betAmount * currentMultiplier)}`}
              </div>
              <button className="btn btn-primary btn-lg" onClick={startGame}>Play Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
