import React from 'react';

export default function Rules() {
  return (
    <div>
      <h1 className="page-title">📜 How to Play & Rules</h1>
      <p className="page-subtitle">Learn how each game works and maximize your winning potential.</p>

      <div className="rules-card">
        <h3>📈 Crash</h3>
        <p>Place your bet before the round starts. The multiplier increases from 1x upward. Cash out before it crashes to win your bet multiplied by the current multiplier. If you don't cash out before the crash, you lose your bet.</p>
        <p><strong>Provably Fair:</strong> Each round's crash point is determined by an MD5 hash shown before the round begins. You can verify the result after the round ends.</p>
        <ul><li>Min bet: $1.00</li><li>Max bet: $100.00</li><li>Cash out anytime before crash</li></ul>
      </div>
      <div className="rules-card">
        <h3>💣 Mines</h3>
        <p>Choose the number of mines (1-24) on a 5x5 grid. Click cells to reveal them. Each safe cell increases your multiplier. Hit a mine and lose everything. Cash out anytime to secure your winnings.</p>
        <ul><li>Grid: 5x5 (25 cells)</li><li>Mines: 1-24 configurable</li><li>Cash out after any safe reveal</li></ul>
      </div>
      <div className="rules-card">
        <h3>🃏 Blackjack</h3>
        <p>Classic casino blackjack. Get closer to 21 than the dealer without going over. Aces count as 1 or 11. Face cards count as 10. Blackjack (Ace + 10/Face) pays 3:2.</p>
        <ul><li>Dealer stands on 17</li><li>Blackjack pays 3:2</li><li>Insurance available on dealer Ace</li></ul>
      </div>
      <div className="rules-card">
        <h3>🎯 Limbo</h3>
        <p>Set a target multiplier and place your bet. If the random multiplier exceeds your target, you win! Higher targets have lower probability but bigger payouts.</p>
        <ul><li>Target range: 1.01x - 1,000,000x</li><li>Payout = Bet × Target (if hit)</li></ul>
      </div>
      <div className="rules-card">
        <h3>🎲 Dice</h3>
        <p>Choose "Over" or "Under" a target number (0-100). Roll the dice. If the result matches your prediction, you win based on the odds.</p>
        <ul><li>Range: 0.00 - 100.00</li><li>Adjustable win chance: 1% - 98%</li><li>House edge: 1%</li></ul>
      </div>
      <div className="rules-card">
        <h3>🔢 Keno</h3>
        <p>Select 1-10 numbers from a 1-40 grid. The game draws 10 random numbers. Payout depends on how many of your numbers match the drawn numbers.</p>
        <ul><li>Pick 1-10 numbers</li><li>10 numbers drawn</li><li>Higher matches = bigger multiplier</li></ul>
      </div>
      <div className="rules-card">
        <h3>🏗️ Tower</h3>
        <p>Climb a tower by selecting one cell per row. Each row has one mine hidden among 3 cells. Choose the safe cell to advance and increase your multiplier. Hit a mine and lose.</p>
        <ul><li>Up to 10 rows</li><li>1 mine per row (3 cells)</li><li>Difficulty: Easy to Hard</li></ul>
      </div>
      <div className="rules-card">
        <h3>🟡 Plinko</h3>
        <p>Drop a ball from the top of a peg board. The ball bounces randomly through the pegs and lands in a multiplier slot at the bottom. Choose your risk level for different multiplier distributions.</p>
        <ul><li>Risk: Low, Medium, High</li><li>Rows: 8-16</li><li>Multipliers vary by slot position</li></ul>
      </div>
      <div className="rules-card">
        <h3>🎡 Roulette</h3>
        <p>European roulette with numbers 0-36. Place bets on numbers, colors, ranges, or specific patterns. The wheel spins and the ball determines the winner.</p>
        <ul><li>Single number: 35:1</li><li>Red/Black: 1:1</li><li>Odd/Even: 1:1</li><li>House edge: 2.7%</li></ul>
      </div>
      <div className="rules-card">
        <h3>🐔 Chicken Run</h3>
        <p>Bet on which chicken will win the race! Chickens race across the screen with random speeds. The first to reach the finish line wins. Multipliers are shown before betting.</p>
        <ul><li>4 chickens per race</li><li>Fixed odds per chicken</li><li>Watch the race live</li></ul>
      </div>
    </div>
  );
}
