import React, { useState, useCallback } from 'react';
import { useGame } from '../store/GameStore';

type Card = { suit: string; value: string; numericValue: number };
type Suit = '♥' | '♦' | '♣' | '♠';
const suits: Suit[] = ['♥', '♦', '♣', '♠'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      let numericValue: number;
      if (value === 'A') numericValue = 11;
      else if (['J', 'Q', 'K'].includes(value)) numericValue = 10;
      else numericValue = parseInt(value);
      deck.push({ suit, value, numericValue });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function getHandValue(hand: Card[]): number {
  let value = hand.reduce((sum, card) => sum + card.numericValue, 0);
  let aces = hand.filter(c => c.value === 'A').length;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

export default function Blackjack() {
  const { state, placeBet, addWinnings, formatCurrency } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'over'>('betting');
  const [result, setResult] = useState('');

  const startGame = useCallback(() => {
    if (!placeBet(betAmount, 'Blackjack')) return;
    const newDeck = createDeck();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    setResult('');
    if (getHandValue(pHand) === 21) {
      const winnings = betAmount * 2.5;
      addWinnings(winnings, 'Blackjack', 2.5);
      setResult(`Blackjack! Won ${formatCurrency(winnings)}`);
      setGameState('over');
    }
  }, [betAmount, placeBet, addWinnings, formatCurrency]);

  const hit = () => {
    if (gameState !== 'playing') return;
    const newDeck = [...deck];
    const newHand = [...playerHand, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(newHand);
    if (getHandValue(newHand) > 21) {
      addWinnings(-betAmount, 'Blackjack', 0);
      setResult(`Bust! Lost ${formatCurrency(betAmount)}`);
      setGameState('over');
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;
    setGameState('dealerTurn');
    setTimeout(() => {
      const newDeck = [...deck];
      const dHand = [...dealerHand];
      while (getHandValue(dHand) < 17) {
        dHand.push(newDeck.pop()!);
      }
      setDealerHand(dHand);
      setDeck(newDeck);
      const playerValue = getHandValue(playerHand);
      const dealerValue = getHandValue(dHand);
      if (dealerValue > 21 || playerValue > dealerValue) {
        const winnings = betAmount * 2;
        addWinnings(winnings, 'Blackjack', 2);
        setResult(`Won ${formatCurrency(winnings)}!`);
      } else if (playerValue === dealerValue) {
        addWinnings(betAmount, 'Blackjack', 1);
        setResult('Push! Bet returned.');
      } else {
        addWinnings(-betAmount, 'Blackjack', 0);
        setResult(`Lost ${formatCurrency(betAmount)}`);
      }
      setGameState('over');
    }, 800);
  };

  const cardEmoji = (card: Card, hidden: boolean = false) => {
    if (hidden) return '🂠';
    const suitEmoji: Record<Suit, string> = { '♥': '♥', '♦': '♦', '♣': '♣', '♠': '♠' };
    return `${card.value}${suitEmoji[card.suit as Suit]}`;
  };

  return (
    <div>
      <h1 className="page-title">🃏 Blackjack</h1>
      <p className="page-subtitle">Beat the dealer to 21!</p>
      <div className="game-container">
        {gameState !== 'betting' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Dealer ({gameState === 'over' ? getHandValue(dealerHand) : '?'})</div>
              <div className="blackjack-cards">
                {dealerHand.map((card, i) => (
                  <div key={i} className={`playing-card ${['♥', '♦'].includes(card.suit) ? 'red' : ''}`}>
                    {i === 0 && gameState !== 'over' ? '🂠' : cardEmoji(card)}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>You ({getHandValue(playerHand)})</div>
              <div className="blackjack-cards">
                {playerHand.map((card, i) => (
                  <div key={i} className={`playing-card ${['♥', '♦'].includes(card.suit) ? 'red' : ''}`}>
                    {cardEmoji(card)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {gameState === 'betting' && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="number" className="input" style={{ width: 100 }} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} min={1} />
              <button className="btn btn-primary btn-lg" onClick={startGame}>Deal - {formatCurrency(betAmount)}</button>
            </div>
          )}
          {gameState === 'playing' && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={hit}>Hit</button>
              <button className="btn btn-outline" onClick={stand}>Stand</button>
            </div>
          )}
          {gameState === 'over' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: result.includes('Won') || result.includes('Blackjack') ? 'var(--accent-green)' : result.includes('Push') ? 'var(--accent-gold)' : 'var(--accent-red)' }}>{result}</div>
              <button className="btn btn-primary btn-lg" onClick={startGame}>Play Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
