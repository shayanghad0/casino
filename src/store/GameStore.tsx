import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'user' | 'system' | 'win' | 'bet';
}

export interface GameHistoryEntry {
  id: string;
  game: string;
  player: string;
  bet: number;
  multiplier: number;
  cashedOut: boolean;
  profit: number;
  md5: string;
  timestamp: string;
}

export interface CrashPlayer {
  userId: string;
  username: string;
  bet: number;
  cashedOut: boolean;
  cashOutMultiplier: number;
  profit: number;
}

export interface UserData {
  id: string;
  username: string;
  balance: number;
  totalWagered: number;
  totalWon: number;
  joinedAt: string;
}

interface GameState {
  user: UserData;
  chatMessages: ChatMessage[];
  gameHistory: GameHistoryEntry[];
  crashGameState: {
    currentMultiplier: number;
    isRunning: boolean;
    crashPoint: number;
    hash: string;
    seed: string;
    players: CrashPlayer[];
    roundId: number;
    countdown: number;
  };
  onlinePlayers: number;
}

type GameAction =
  | { type: 'UPDATE_BALANCE'; amount: number }
  | { type: 'ADD_CHAT_MESSAGE'; message: ChatMessage }
  | { type: 'ADD_GAME_HISTORY'; entry: GameHistoryEntry }
  | { type: 'SET_CRASH_STATE'; state: Partial<GameState['crashGameState']> }
  | { type: 'ADD_CRASH_PLAYER'; player: CrashPlayer }
  | { type: 'UPDATE_CRASH_PLAYER'; userId: string; updates: Partial<CrashPlayer> }
  | { type: 'RESET_CRASH_PLAYERS' }
  | { type: 'SET_ONLINE_PLAYERS'; count: number }
  | { type: 'LOAD_STATE'; state: Partial<GameState> };

const initialState: GameState = {
  user: {
    id: 'user-001',
    username: 'Player1',
    balance: 1000.00,
    totalWagered: 0,
    totalWon: 0,
    joinedAt: new Date().toISOString(),
  },
  chatMessages: [
    {
      id: '1',
      userId: 'system',
      username: 'System',
      message: 'Welcome to Casino! Good luck! 🍀',
      timestamp: new Date().toISOString(),
      type: 'system',
    },
  ],
  gameHistory: [],
  crashGameState: {
    currentMultiplier: 1.00,
    isRunning: false,
    crashPoint: 1.00,
    hash: '',
    seed: '',
    players: [],
    roundId: 0,
    countdown: 5,
  },
  onlinePlayers: 1247,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: {
          ...state.user,
          balance: state.user.balance + action.amount,
          totalWagered: action.amount < 0 ? state.user.totalWagered + Math.abs(action.amount) : state.user.totalWagered,
          totalWon: action.amount > 0 ? state.user.totalWon + action.amount : state.user.totalWon,
        },
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages.slice(-99), action.message],
      };
    case 'ADD_GAME_HISTORY':
      return {
        ...state,
        gameHistory: [action.entry, ...state.gameHistory.slice(0, 199)],
      };
    case 'SET_CRASH_STATE':
      return {
        ...state,
        crashGameState: { ...state.crashGameState, ...action.state },
      };
    case 'ADD_CRASH_PLAYER':
      return {
        ...state,
        crashGameState: {
          ...state.crashGameState,
          players: [...state.crashGameState.players, action.player],
        },
      };
    case 'UPDATE_CRASH_PLAYER':
      return {
        ...state,
        crashGameState: {
          ...state.crashGameState,
          players: state.crashGameState.players.map(p =>
            p.userId === action.userId ? { ...p, ...action.updates } : p
          ),
        },
      };
    case 'RESET_CRASH_PLAYERS':
      return {
        ...state,
        crashGameState: {
          ...state.crashGameState,
          players: [],
        },
      };
    case 'SET_ONLINE_PLAYERS':
      return {
        ...state,
        onlinePlayers: action.count,
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.state,
        user: action.state.user || state.user,
      };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  placeBet: (amount: number, game: string) => boolean;
  addWinnings: (amount: number, game: string, multiplier: number, md5?: string) => void;
  sendChatMessage: (message: string) => void;
  formatCurrency: (amount: number) => string;
  generateMD5: (input: string) => string;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('casino-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: parsed });
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('casino-state', JSON.stringify({
        user: state.user,
        gameHistory: state.gameHistory.slice(0, 50),
      }));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state.user, state.gameHistory]);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const generateMD5 = useCallback((input: string): string => {
    let hash = 0;
    const str = input + Date.now();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hexHash = Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
    return hexHash;
  }, []);

  const placeBet = useCallback((amount: number, game: string): boolean => {
    if (amount <= 0 || amount > state.user.balance) return false;
    dispatch({ type: 'UPDATE_BALANCE', amount: -amount });
    const betMsg: ChatMessage = {
      id: uuidv4(),
      userId: state.user.id,
      username: state.user.username,
      message: `placed a bet of ${formatCurrency(amount)} on ${game}`,
      timestamp: new Date().toISOString(),
      type: 'bet',
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: betMsg });
    return true;
  }, [state.user.balance, state.user.id, state.user.username, formatCurrency]);

  const addWinnings = useCallback((amount: number, game: string, multiplier: number, md5?: string) => {
    dispatch({ type: 'UPDATE_BALANCE', amount });
    const historyEntry: GameHistoryEntry = {
      id: uuidv4(),
      game,
      player: state.user.username,
      bet: amount / multiplier,
      multiplier,
      cashedOut: amount > 0,
      profit: amount,
      md5: md5 || '',
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GAME_HISTORY', entry: historyEntry });
    if (amount > 0) {
      const winMsg: ChatMessage = {
        id: uuidv4(),
        userId: state.user.id,
        username: state.user.username,
        message: `won ${formatCurrency(amount)} on ${game}! (${multiplier.toFixed(2)}x) 🎉`,
        timestamp: new Date().toISOString(),
        type: 'win',
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: winMsg });
    }
  }, [state.user.username, state.user.id, formatCurrency]);

  const sendChatMessage = useCallback((message: string) => {
    if (!message.trim()) return;
    const chatMsg: ChatMessage = {
      id: uuidv4(),
      userId: state.user.id,
      username: state.user.username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'user',
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: chatMsg });
  }, [state.user.id, state.user.username]);

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      placeBet,
      addWinnings,
      sendChatMessage,
      formatCurrency,
      generateMD5,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
