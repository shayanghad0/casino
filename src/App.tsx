import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './components/Chat';
import Home from './pages/Home';
import Games from './pages/Games';
import Rules from './pages/Rules';
import Mines from './games/Mines';
import Blackjack from './games/Blackjack';
import Limbo from './games/Limbo';
import Dice from './games/Dice';
import Keno from './games/Keno';
import Tower from './games/Tower';
import Plinko from './games/Plinko';
import Roulette from './games/Roulette';
import ChickenRun from './games/ChickenRun';
import Crash from './games/Crash';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <div className="game-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/game/mines" element={<Mines />} />
              <Route path="/game/blackjack" element={<Blackjack />} />
              <Route path="/game/limbo" element={<Limbo />} />
              <Route path="/game/dice" element={<Dice />} />
              <Route path="/game/keno" element={<Keno />} />
              <Route path="/game/tower" element={<Tower />} />
              <Route path="/game/plinko" element={<Plinko />} />
              <Route path="/game/roulette" element={<Roulette />} />
              <Route path="/game/chicken-run" element={<ChickenRun />} />
              <Route path="/game/crash" element={<Crash />} />
            </Routes>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default App;
