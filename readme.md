# 🎰 Casino – Online Casino Platform

A modern, fully-featured online casino built with **Vite + React + TypeScript**.  
Features 10 exciting games, live chat, game history, and a sleek 3D stake‑style design.  
All games are provably fair with MD5 verification for the Crash game.

---

## 🎮 Games

| Game          | Description                               | Type       |
|---------------|-------------------------------------------|------------|
| 📈 Crash      | Cash out before the multiplier crashes!  | Multiplier |
| 💣 Mines      | Avoid the mines, collect gems            | Strategy   |
| 🃏 Blackjack  | Beat the dealer to 21                    | Cards      |
| 🎯 Limbo      | Set a target multiplier and wait         | Multiplier |
| 🎲 Dice       | Roll over/under a target number          | Dice       |
| 🔢 Keno       | Pick numbers and match                   | Lottery    |
| 🏗️ Tower      | Climb the tower choosing safe paths      | Strategy   |
| 🟡 Plinko     | Drop ball for multiplier prizes          | Arcade     |
| 🎡 Roulette   | European roulette with full betting       | Table      |
| 🐔 Chicken Run| Bet on the fastest chicken!              | Racing     |

---

## ✨ Features

- 💰 **Wallet & Balance** – Start with $1,000, place bets, win real rewards.
- 💬 **Live Chat** – Chat with other players, see bet/win announcements.
- 📊 **Game History** – Full table with bet, multiplier, profit, and MD5 hash.
- 🔐 **Provably Fair** – Crash game uses MD5 hash for verification.
- 🎨 **Modern 3D Design** – Dark theme, neon accents, glassmorphism, and smooth animations.
- 📱 **Responsive** – Works on desktop, tablet, and mobile.
- 🧠 **LocalStorage** – Balance and history persist across sessions.
- 🚀 **Fast** – Built with Vite, instant HMR during development.

---

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/) – Build tool
- [React 18](https://reactjs.org/) – UI library
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [React Router](https://reactrouter.com/) – Client-side routing
- [UUID](https://github.com/uuidjs/uuid) – Unique ID generation
- CSS3 (custom properties, animations, 3D transforms)

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shayanghad0/casino
   cd casino
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

---

## 📂 Project Structure

```
casino/
├── public/
├── src/
│   ├── components/    # Reusable UI components
│   ├── games/         # Individual game components
│   ├── pages/         # Home, Games, Rules pages
│   ├── store/         # Context API state management
│   └── data/          # JSON user data
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🏗️ Build for Production

```bash
npm run build
```
The output will be in the `dist/` folder.

---

## 🌐 Deploy to GitHub Pages

1. **Update `vite.config.ts`**  
   Set the `base` to your repository name:
   ```ts
   base: '/casino/',
   ```

2. **Switch to HashRouter** (required for static hosting)  
   In `src/main.tsx`:
   ```tsx
   import { HashRouter } from 'react-router-dom';
   // Replace <BrowserRouter> with <HashRouter>
   ```

3. **Install `gh-pages`** (if not already)
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/shayanghad0/casino/issues).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## ⚠️ Disclaimer

This is a **demonstration project** and does not involve real money gambling.  
Please gamble responsibly if you decide to implement real transactions.

---

Made with ❤️ and a lot of fun!