import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, RotateCcw, Sparkles, Trophy, Plus, Smartphone, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoodItem {
  id: string;
  name: string;
  multiplier: number;
  iconImg: string;
  category: 'fruit' | 'feast' | 'mix';
  color: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { id: 'burger', name: 'Burger', multiplier: 15, iconImg: '/games/greedy-markhor/drawable/food_burger.png', category: 'feast', color: '#FF7043' },
  { id: 'pizza', name: 'Pizza', multiplier: 25, iconImg: '/games/greedy-markhor/drawable/food_pizza.png', category: 'feast', color: '#FFA726' },
  { id: 'chicken', name: 'Chicken', multiplier: 45, iconImg: '/games/greedy-markhor/drawable/food_chicken.png', category: 'feast', color: '#EF5350' },
  { id: 'fish', name: 'Fish', multiplier: 10, iconImg: '/games/greedy-markhor/drawable/food_fish.png', category: 'feast', color: '#42A5F5' },
  { id: 'lemon', name: 'Lemon', multiplier: 5, iconImg: '/games/greedy-markhor/drawable/food_lemon.png', category: 'fruit', color: '#FFEE58' },
  { id: 'apple', name: 'Apple', multiplier: 5, iconImg: '/games/greedy-markhor/drawable/food_apple.png', category: 'fruit', color: '#66BB6A' },
  { id: 'mango', name: 'Mango', multiplier: 5, iconImg: '/games/greedy-markhor/drawable/food_mango.png', category: 'fruit', color: '#FFA000' },
  { id: 'strawberry', name: 'Strawberry', multiplier: 5, iconImg: '/games/greedy-markhor/drawable/food_strawberry.png', category: 'fruit', color: '#EC407A' },
];

const CHIP_VALUES = [100, 1000, 5000, 10000, 50000, 100000, 500000];

interface Props {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const GreedyMarkhorWebDemo: React.FC<Props> = ({ onClose, isEmbedded = false }) => {
  // Game State
  const [balance, setBalance] = useState<number>(500000);
  const [phase, setPhase] = useState<'BETTING' | 'SPINNING' | 'SHOWING'>('BETTING');
  const [timer, setTimer] = useState<number>(30);
  const [selectedChip, setSelectedChip] = useState<number>(10000);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number>(0);
  const [winningItem, setWinningItem] = useState<FoodItem | null>(null);
  const [userWonAmount, setUserWonAmount] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(416201);
  const [recentHistory, setRecentHistory] = useState<string[]>(['burger', 'chicken', 'apple', 'lemon', 'fish']);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'sheet' | 'full'>('sheet');

  // Bets State: foodId -> amount
  const [bets, setBets] = useState<Record<string, number>>({});
  const [categoryBets, setCategoryBets] = useState<Record<string, number>>({});
  const [totalTodayWager, setTotalTodayWager] = useState<number>(0);

  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/games/greedy-markhor/raw/chip_place.wav');
    audioRef.current.volume = 0.6;
  }, []);

  const playChipSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Main 38-second game loop ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase Transitions
        if (phase === 'BETTING') {
          // Transition to SPINNING (4s)
          setPhase('SPINNING');
          const drawn = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
          setWinningItem(drawn);
          return 4;
        } else if (phase === 'SPINNING') {
          // Transition to SHOWING (4s)
          setPhase('SHOWING');
          resolveRound();
          return 4;
        } else {
          // Transition back to BETTING (30s)
          setPhase('BETTING');
          setBets({});
          setCategoryBets({});
          setUserWonAmount(0);
          setWinningItem(null);
          setRoundNumber((r) => r + 1);
          return 30;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, bets, categoryBets, winningItem]);

  // Smooth wheel lighting runner during SPINNING phase
  useEffect(() => {
    if (phase !== 'SPINNING') return;

    let step = 0;
    const totalSteps = 24 + (winningItem ? FOOD_ITEMS.findIndex((f) => f.id === winningItem.id) : 0);
    const speed = 70; // ms

    const runLights = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % FOOD_ITEMS.length);
      step++;
      if (step >= totalSteps) {
        clearInterval(runLights);
        if (winningItem) {
          const winIndex = FOOD_ITEMS.findIndex((f) => f.id === winningItem.id);
          if (winIndex !== -1) setActiveHighlightIndex(winIndex);
        }
      }
    }, speed);

    return () => clearInterval(runLights);
  }, [phase, winningItem]);

  // Resolve outcome & winnings
  const resolveRound = () => {
    if (!winningItem) return;

    let won = 0;
    // Food specific bets
    const foodBet = bets[winningItem.id] || 0;
    if (foodBet > 0) {
      won += foodBet * winningItem.multiplier;
    }

    // Category bets
    const cat = winningItem.category;
    if (cat === 'fruit' && categoryBets['fruit']) {
      won += categoryBets['fruit'] * 5;
    } else if (cat === 'feast' && categoryBets['feast']) {
      won += categoryBets['feast'] * 10;
    }
    if (categoryBets['mix']) {
      won += categoryBets['mix'] * 25;
    }

    setUserWonAmount(won);
    if (won > 0) {
      setBalance((b) => b + won);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }

    setRecentHistory((prev) => [winningItem.id, ...prev.slice(0, 11)]);
  };

  // Place bet on food plate
  const placeBetOnFood = (foodId: string) => {
    if (phase !== 'BETTING') return;
    if (balance < selectedChip) {
      alert('Insufficient demo coins! Click the "+100k" button at top to refill.');
      return;
    }

    playChipSound();
    setBalance((b) => b - selectedChip);
    setTotalTodayWager((w) => w + selectedChip);
    setBets((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + selectedChip,
    }));
  };

  // Place bet on category
  const placeCategoryBet = (categoryKey: string) => {
    if (phase !== 'BETTING') return;
    if (balance < selectedChip) {
      alert('Insufficient demo coins! Click the "+100k" button at top to refill.');
      return;
    }

    playChipSound();
    setBalance((b) => b - selectedChip);
    setTotalTodayWager((w) => w + selectedChip);
    setCategoryBets((prev) => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || 0) + selectedChip,
    }));
  };

  const clearCurrentBets = () => {
    if (phase !== 'BETTING') return;
    const totalBetAmount =
      Object.values(bets).reduce((a, b) => a + b, 0) +
      Object.values(categoryBets).reduce((a, b) => a + b, 0);
    setBalance((b) => b + totalBetAmount);
    setBets({});
    setCategoryBets({});
  };

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <div className={`relative flex flex-col items-center justify-center ${isEmbedded ? 'w-full' : 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 overflow-y-auto'}`}>
      {/* Smartphone Device Frame */}
      <div className="relative w-full max-w-[420px] bg-[#0c0819] rounded-[36px] border-[5px] border-[#2b224d] shadow-2xl overflow-hidden flex flex-col h-[780px] select-none text-white font-sans">
        
        {/* Device Notch & Status Bar */}
        <div className="bg-[#130b24] px-6 py-2 flex items-center justify-between text-xs text-hsg-muted border-b border-white/5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Social Room</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'sheet' ? 'full' : 'sheet')}
              className="text-[11px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white flex items-center gap-1"
              title="Toggle Voice Room Overlay View vs Fullscreen Game View"
            >
              {viewMode === 'sheet' ? <Layers className="w-3 h-3 text-hsg-cyan" /> : <Smartphone className="w-3 h-3 text-hsg-purple" />}
              <span>{viewMode === 'sheet' ? 'Room Mode' : 'Full Game'}</span>
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="hover:text-white">
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-hsg-cyan" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
            </button>
            {onClose && (
              <button onClick={onClose} className="hover:text-white text-hsg-muted">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mock Social Voice Chat Room Header (Visible in 'sheet' mode) */}
        {viewMode === 'sheet' && (
          <div className="bg-gradient-to-b from-[#1a0e33] to-[#120824] px-4 py-2.5 border-b border-purple-900/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-xs shadow-md">
                  👑
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Royal Voice Lounge #7821</h4>
                  <p className="text-[10px] text-purple-300">1.4k Listeners • High Stakes</p>
                </div>
              </div>
              {/* Live Coin Balance Pill with Refill */}
              <div className="flex items-center gap-1.5 bg-[#261645] border border-amber-400/40 px-2.5 py-1 rounded-full shadow-inner">
                <img src="/games/greedy-markhor/drawable/pakii_coin.png" alt="Coins" className="w-4 h-4 object-contain" />
                <span className="text-xs font-black text-amber-300">{formatNumber(balance)}</span>
                <button
                  onClick={() => setBalance((b) => b + 100000)}
                  className="bg-amber-500 hover:bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1"
                  title="Add 100k Demo Coins"
                >
                  +100k
                </button>
              </div>
            </div>

            {/* 4 Voice Mic Seats */}
            <div className="grid grid-cols-4 gap-2 pt-1 pb-1 text-center">
              {[
                { name: 'Host King', emoji: '👑', speaking: true },
                { name: 'Zara VIP', emoji: '🌸', speaking: false },
                { name: 'Hamza', emoji: '🦁', speaking: true },
                { name: 'Ali_99', emoji: '⚡', speaking: false },
              ].map((seat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full bg-[#2a174f] border ${seat.speaking ? 'border-emerald-400 ring-2 ring-emerald-400/40 animate-pulse' : 'border-purple-500/40'} flex items-center justify-center text-sm shadow`}>
                    {seat.emoji}
                  </div>
                  <span className="text-[9px] text-white/80 mt-0.5 truncate w-full">{seat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Greedy Markhor Game Area ── */}
        <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#180d33] via-[#0f0721] to-[#090414] p-3 overflow-y-auto">
          
          {/* Top Bar: Round No, Phase Banner, History */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-2 px-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                <span>Round #{roundNumber}</span>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full font-black text-[11px] tracking-wider uppercase shadow-md ${
                phase === 'BETTING' ? 'bg-amber-500 text-black animate-pulse' :
                phase === 'SPINNING' ? 'bg-cyan-500 text-black' : 'bg-emerald-500 text-white'
              }`}>
                {phase === 'BETTING' && `Betting: ${timer}s`}
                {phase === 'SPINNING' && `Spinning: ${timer}s`}
                {phase === 'SHOWING' && `Winner Reveal: ${timer}s`}
              </div>
            </div>

            {/* Recent History Food Icons */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2 py-1.5 rounded-xl mb-3 overflow-x-auto">
              <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider shrink-0 mr-1">History:</span>
              {recentHistory.map((id, idx) => {
                const food = FOOD_ITEMS.find((f) => f.id === id);
                return (
                  <div key={idx} className="w-6 h-6 shrink-0 rounded-full bg-white/10 p-0.5 flex items-center justify-center" title={food?.name}>
                    {food && <img src={food.iconImg} alt={food.name} className="w-full h-full object-contain" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Center Wheel / 8 Food Plates Grid ── */}
          <div className="relative my-auto">
            {/* 8 Food Plates arranged in 2 rows of 4 (matching mobile arcade layout) */}
            <div className="grid grid-cols-4 gap-2">
              {FOOD_ITEMS.map((item, index) => {
                const isHighlighted = activeHighlightIndex === index;
                const isWinner = phase === 'SHOWING' && winningItem?.id === item.id;
                const userBetOnThis = bets[item.id] || 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => placeBetOnFood(item.id)}
                    disabled={phase !== 'BETTING'}
                    className={`relative flex flex-col items-center justify-between p-1.5 rounded-2xl border transition-all duration-150 ${
                      isWinner
                        ? 'bg-gradient-to-b from-amber-400/40 to-yellow-600/30 border-amber-300 ring-4 ring-amber-400 shadow-lg scale-105'
                        : isHighlighted
                        ? 'bg-purple-600/40 border-cyan-400 ring-2 ring-cyan-400 shadow-md scale-102'
                        : 'bg-[#1e113d]/80 border-purple-900/60 hover:border-purple-500'
                    }`}
                  >
                    {/* Multiplier Badge */}
                    <div className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-black/60 text-amber-300">
                      {item.multiplier}x
                    </div>

                    {/* Food Plate Graphic */}
                    <div className="w-11 h-11 my-0.5 flex items-center justify-center">
                      <img src={item.iconImg} alt={item.name} className="w-full h-full object-contain drop-shadow" />
                    </div>

                    {/* Food Name */}
                    <span className="text-[10px] font-bold text-white/90 truncate w-full text-center">
                      {item.name}
                    </span>

                    {/* Active Bet Badge */}
                    {userBetOnThis > 0 && (
                      <div className="absolute -top-1.5 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-lg border border-yellow-200">
                        {formatNumber(userBetOnThis)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3 Fast Category Buttons: Fruit (5x), Feast (10x), Mix (25x) */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { key: 'fruit', label: '🍎 Fruit (5x)', sub: 'Lemon, Apple, Mango, Strawberry', multi: 5, color: 'from-emerald-600 to-teal-800' },
                { key: 'feast', label: '🍗 Feast (10x)', sub: 'Burger, Pizza, Chicken, Fish', multi: 10, color: 'from-orange-600 to-red-800' },
                { key: 'mix', label: '🍕 Mix (25x)', sub: 'Special Combo Bet', multi: 25, color: 'from-purple-600 to-indigo-800' },
              ].map((cat) => {
                const catBet = categoryBets[cat.key] || 0;
                return (
                  <button
                    key={cat.key}
                    onClick={() => placeCategoryBet(cat.key)}
                    disabled={phase !== 'BETTING'}
                    className={`relative py-2 px-1 rounded-xl bg-gradient-to-b ${cat.color} border border-white/20 shadow flex flex-col items-center justify-center transition active:scale-95`}
                  >
                    <span className="text-[11px] font-black text-white">{cat.label}</span>
                    <span className="text-[8px] text-white/70 truncate w-full text-center">{cat.sub}</span>
                    {catBet > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-400 text-black font-black text-[9px] px-1.5 rounded-full shadow">
                        {formatNumber(catBet)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Bottom Bet Controls & Chip Selector ── */}
          <div className="mt-3 pt-2 border-t border-white/10">
            {/* Chip selector bar */}
            <div className="flex items-center justify-between gap-1 mb-2 px-1">
              {CHIP_VALUES.map((val) => {
                const isSelected = selectedChip === val;
                const label = val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}K` : `${val}`;
                return (
                  <button
                    key={val}
                    onClick={() => setSelectedChip(val)}
                    className={`w-9 h-9 rounded-full font-black text-[10px] flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-200 text-black border-white ring-2 ring-amber-400 scale-110 shadow-lg'
                        : 'bg-[#251545] text-purple-200 border-purple-800 hover:border-purple-500'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Clear Bets & Total Bet Summary */}
            <div className="flex items-center justify-between px-1 text-xs">
              <button
                onClick={clearCurrentBets}
                disabled={phase !== 'BETTING'}
                className="flex items-center gap-1 text-purple-300 hover:text-white text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] text-hsg-muted">Total Round Bet: </span>
                <span className="font-bold text-amber-400">
                  {formatNumber(
                    Object.values(bets).reduce((a, b) => a + b, 0) +
                    Object.values(categoryBets).reduce((a, b) => a + b, 0)
                  )} Coins
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Win Celebration Modal Popup (SHOWING phase) ── */}
        {phase === 'SHOWING' && winningItem && (
          <div className="absolute inset-x-4 top-1/3 z-50 bg-[#1e0f3d]/95 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-md animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg animate-bounce">
              <img src={winningItem.iconImg} alt={winningItem.name} className="w-full h-full object-contain" />
            </div>
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest">
              {winningItem.name} Wins! ({winningItem.multiplier}x)
            </h3>
            {userWonAmount > 0 ? (
              <div className="mt-2 bg-emerald-500/20 border border-emerald-400/50 rounded-xl py-2 px-3">
                <span className="text-xs text-emerald-300 block font-bold">🎉 YOU WON!</span>
                <span className="text-lg font-black text-emerald-400">+{formatNumber(userWonAmount)} COINS</span>
              </div>
            ) : (
              <p className="text-xs text-purple-200 mt-1">Better luck in the next round!</p>
            )}
          </div>
        )}

        {/* Bottom Disclaimer Banner */}
        <div className="bg-[#080410] px-3 py-1.5 text-center border-t border-white/5">
          <p className="text-[9px] text-hsg-muted">
            🎮 <strong className="text-white">Live Browser Simulation</strong> • Exact game assets & sound • Native Kotlin source code delivered on purchase.
          </p>
        </div>

      </div>
    </div>
  );
};
