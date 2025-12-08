import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Heart, Target, Play, RotateCcw, Settings, CheckSquare, Square, ArrowRight, ArrowLeft, Check, AlertTriangle, BookOpen, Star, Hourglass, Pause } from 'lucide-react';

// --- 資料庫 (完整擴充版) ---
const elementsData = [
  // --- 第 1 週期 ---
  { z: 1, symbol: 'H', name: '氫', nameEn: 'Hydrogen', category: 'nonmetal' },
  { z: 2, symbol: 'He', name: '氦', nameEn: 'Helium', category: 'noble-gas' },

  // --- 第 2 週期 ---
  { z: 3, symbol: 'Li', name: '鋰', nameEn: 'Lithium', category: 'alkali' },
  { z: 4, symbol: 'Be', name: '鈹', nameEn: 'Beryllium', category: 'alkaline' },
  { z: 5, symbol: 'B', name: '硼', nameEn: 'Boron', category: 'metalloid' },
  { z: 6, symbol: 'C', name: '碳', nameEn: 'Carbon', category: 'nonmetal' },
  { z: 7, symbol: 'N', name: '氮', nameEn: 'Nitrogen', category: 'nonmetal' },
  { z: 8, symbol: 'O', name: '氧', nameEn: 'Oxygen', category: 'nonmetal' },
  { z: 9, symbol: 'F', name: '氟', nameEn: 'Fluorine', category: 'halogen' },
  { z: 10, symbol: 'Ne', name: '氖', nameEn: 'Neon', category: 'noble-gas' },

  // --- 第 3 週期 ---
  { z: 11, symbol: 'Na', name: '鈉', nameEn: 'Sodium', category: 'alkali' },
  { z: 12, symbol: 'Mg', name: '鎂', nameEn: 'Magnesium', category: 'alkaline' },
  { z: 13, symbol: 'Al', name: '鋁', nameEn: 'Aluminium', category: 'post-transition' },
  { z: 14, symbol: 'Si', name: '矽', nameEn: 'Silicon', category: 'metalloid' },
  { z: 15, symbol: 'P', name: '磷', nameEn: 'Phosphorus', category: 'nonmetal' },
  { z: 16, symbol: 'S', name: '硫', nameEn: 'Sulfur', category: 'nonmetal' },
  { z: 17, symbol: 'Cl', name: '氯', nameEn: 'Chlorine', category: 'halogen' },
  { z: 18, symbol: 'Ar', name: '氬', nameEn: 'Argon', category: 'noble-gas' },

  // --- 第 4 週期 ---
  { z: 19, symbol: 'K', name: '鉀', nameEn: 'Potassium', category: 'alkali' },
  { z: 20, symbol: 'Ca', name: '鈣', nameEn: 'Calcium', category: 'alkaline' },
  { z: 21, symbol: 'Sc', name: '鈧', nameEn: 'Scandium', category: 'transition' },
  { z: 22, symbol: 'Ti', name: '鈦', nameEn: 'Titanium', category: 'transition' },
  { z: 23, symbol: 'V', name: '釩', nameEn: 'Vanadium', category: 'transition' },
  { z: 24, symbol: 'Cr', name: '鉻', nameEn: 'Chromium', category: 'transition' },
  { z: 25, symbol: 'Mn', name: '錳', nameEn: 'Manganese', category: 'transition' },
  { z: 26, symbol: 'Fe', name: '鐵', nameEn: 'Iron', category: 'transition' },
  { z: 27, symbol: 'Co', name: '鈷', nameEn: 'Cobalt', category: 'transition' },
  { z: 28, symbol: 'Ni', name: '鎳', nameEn: 'Nickel', category: 'transition' },
  { z: 29, symbol: 'Cu', name: '銅', nameEn: 'Copper', category: 'transition' },
  { z: 30, symbol: 'Zn', name: '鋅', nameEn: 'Zinc', category: 'transition' },
  { z: 35, symbol: 'Br', name: '溴', nameEn: 'Bromine', category: 'halogen' },
  { z: 36, symbol: 'Kr', name: '氪', nameEn: 'Krypton', category: 'noble-gas' },

  // --- 第 5 週期 ---
  { z: 47, symbol: 'Ag', name: '銀', nameEn: 'Silver', category: 'transition' },
  { z: 53, symbol: 'I', name: '碘', nameEn: 'Iodine', category: 'halogen' },
  { z: 54, symbol: 'Xe', name: '氙', nameEn: 'Xenon', category: 'noble-gas' },

  // --- 第 6 週期 ---
  { z: 74, symbol: 'W', name: '鎢', nameEn: 'Tungsten', category: 'transition' },
  { z: 78, symbol: 'Pt', name: '鉑', nameEn: 'Platinum', category: 'transition' },
  { z: 79, symbol: 'Au', name: '金', nameEn: 'Gold', category: 'transition' },
  { z: 85, symbol: 'At', name: '砈', nameEn: 'Astatine', category: 'halogen' },
  { z: 86, symbol: 'Rn', name: '氡', nameEn: 'Radon', category: 'noble-gas' },
];

// 護眼粉彩配色 (Pastel Colors)
const pastelColors = {
  'nonmetal': '#86efac',       // Soft Green
  'noble-gas': '#d8b4fe',      // Soft Purple
  'alkali': '#fca5a5',         // Soft Red
  'alkaline': '#fdba74',       // Soft Orange
  'metalloid': '#67e8f9',      // Soft Cyan
  'halogen': '#7dd3fc',        // Soft Blue
  'post-transition': '#a5b4fc',// Soft Indigo
  'transition': '#fde047',     // Soft Yellow
  'hazard': '#ef4444',         // Alert Red
};

// 鼓勵話語庫
const ENCOURAGEMENTS = ["手感發燙！", "太神了！", "完美節奏！", "化學大師！", "勢如破竹！", "保持專注！", "銳不可擋！"];

const App = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, select, playing, paused, transition, gameover
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [targetElement, setTargetElement] = useState(null);
  const [message, setMessage] = useState('');
  const [transitionData, setTransitionData] = useState({ title: '', subtitle: '', count: 5 });
  
  // Settings
  const [selectedSymbols, setSelectedSymbols] = useState(new Set(elementsData.map(e => e.symbol))); 
  const [langMode, setLangMode] = useState('mixed'); 
  const [currentPromptLang, setCurrentPromptLang] = useState('zh'); 

  // 遊戲狀態 Ref
  const gameRef = useRef({
    bullets: [],
    enemies: [],
    bonuses: [],
    particles: [],     
    shockwaves: [],    
    floatingTexts: [], 
    lastEnemySpawn: 0,
    lastBonusSpawn: 0,
    spawnRate: 1500,
    score: 0,
    lives: 3,
    combo: 0,
    target: null,
    currentPool: [], 
    promptLang: 'zh', 
    animationId: null,
    width: 0,
    height: 0,
    shake: 0,          
    frame: 0,          
    difficultyMultiplier: 1,
    
    // 進度控制
    level: 0,           // 0:初級, 1:陷阱, 2:飄移, 3:幽靈, 4:極速
    levelStartScore: 0, // 該等級開始時的分數 (用於計算相對難度)
    wobbleFactor: 0,    // 飄移程度
    ghostFactor: 0,     // 透明度變化程度
    gravityFactor: 1    // 下墜速度倍率
  });

  // --- 選擇邏輯 ---
  const toggleSelection = (symbol) => {
    const newSet = new Set(selectedSymbols);
    if (newSet.has(symbol)) {
      if (newSet.size > 1) newSet.delete(symbol);
    } else {
      newSet.add(symbol);
    }
    setSelectedSymbols(newSet);
  };

  const selectAll = () => setSelectedSymbols(new Set(elementsData.map(e => e.symbol)));
  const deselectAll = () => setSelectedSymbols(new Set([elementsData[0].symbol])); 

  // --- 遊戲邏輯函數 ---

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 強制設定 Canvas 尺寸
    const container = canvas.parentElement;
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;

    // 關鍵修正：確保使用當前選擇的 selectedSymbols 來建立題庫
    const pool = elementsData.filter(e => selectedSymbols.has(e.symbol));

    gameRef.current = {
      ...gameRef.current,
      bullets: [],
      enemies: [],
      bonuses: [],
      particles: [],
      shockwaves: [],
      floatingTexts: [],
      currentPool: pool,
      score: 0,
      lives: 5,
      combo: 0,
      spawnRate: 1800, // 初始速度較慢
      lastBonusSpawn: performance.now(),
      difficultyMultiplier: 1,
      
      // Level 0 初始設定
      level: 0,
      levelStartScore: 0,
      wobbleFactor: 0,
      ghostFactor: 0,
      gravityFactor: 1,

      width: canvas.width,
      height: canvas.height,
      shake: 0,
      frame: 0,
      promptLang: 'zh'
    };

    setScore(0);
    setLives(5);
    setCombo(0);
    pickNewTarget(true); 
    setGameState('playing');
  };

  const pauseGame = () => {
      setGameState('paused');
  };

  const resumeGame = () => {
      setGameState('playing');
      gameRef.current.lastEnemySpawn = performance.now();
  };

  const triggerLevelTransition = (newLevel, title, subtitle) => {
      setGameState('transition');
      setTransitionData({ title, subtitle, count: 5 }); 
      
      gameRef.current.level = newLevel;
      gameRef.current.levelStartScore = gameRef.current.score; 
      
      gameRef.current.enemies = [];
      gameRef.current.bullets = [];
      gameRef.current.bonuses = [];
  };

  useEffect(() => {
      if (gameState === 'transition') {
          if (transitionData.count > 0) {
              const timer = setTimeout(() => {
                  setTransitionData(prev => ({ ...prev, count: prev.count - 1 }));
              }, 1000);
              return () => clearTimeout(timer);
          } else {
              setGameState('playing');
              gameRef.current.lastEnemySpawn = performance.now(); 
          }
      }
  }, [gameState, transitionData.count]);

  const pickNewTarget = (isFirst = false) => {
    const pool = gameRef.current.currentPool;
    if (pool.length === 0) return;
    const randomEl = pool[Math.floor(Math.random() * pool.length)];
    gameRef.current.target = randomEl;
    setTargetElement(randomEl);

    let nextLang = 'zh';
    if (langMode === 'en_target') nextLang = 'zh';
    else if (langMode === 'zh_target') nextLang = 'en';
    else if (langMode === 'mixed') nextLang = Math.random() < 0.5 ? 'zh' : 'en';
    
    gameRef.current.promptLang = nextLang;
    setCurrentPromptLang(nextLang);

    let promptText = '';
    if (nextLang === 'zh') {
        promptText = randomEl.name;
    } else {
        promptText = `${randomEl.nameEn} (${randomEl.symbol})`;
    }
    
    if (isFirst) {
        setMessage(`目標: ${promptText}`);
        setTimeout(() => setMessage(''), 2000);
    }
  };

  const spawnBonus = (now) => {
      if (Math.random() < 0.002 || (now - gameRef.current.lastBonusSpawn > 15000)) {
          const type = 'heart'; 
          const x = Math.random() * (gameRef.current.width - 60) + 30;
          
          gameRef.current.bonuses.push({
              x,
              y: -30,
              radius: 20,
              type,
              speed: 2,
              angle: 0
          });
          gameRef.current.lastBonusSpawn = now;
      }
  }

  const spawnEnemy = (now) => {
    const { width, difficultyMultiplier, currentPool, level, wobbleFactor, ghostFactor, gravityFactor } = gameRef.current;
    
    // Level 1 (100分) 開啟陷阱
    const isHazardEnabled = level >= 1;
    const isHazard = isHazardEnabled && Math.random() < 0.2; 

    let elData;
    let type = 'normal';

    if (isHazard) {
        type = 'hazard';
        elData = { symbol: '☢️', name: '危險', category: 'hazard' };
    } else {
        if (Math.random() < 0.5 && gameRef.current.target) {
            elData = gameRef.current.target; 
        } else {
            elData = currentPool[Math.floor(Math.random() * currentPool.length)];
        }
    }

    const radius = 32; 
    const x = Math.random() * (width - radius * 2) + radius;
    const speed = (Math.random() * 1.0 + 0.8) * difficultyMultiplier * gravityFactor; 

    // Level 2 (300分) 開啟飄移
    const canWobble = level >= 2;
    const currentWobble = canWobble ? (Math.random() * 0.03 + 0.01) * (1 + wobbleFactor) : 0;

    const ghostPhase = Math.random() * Math.PI * 2;

    gameRef.current.enemies.push({
      x,
      originalX: x,
      y: -radius,
      radius,
      speed,
      data: elData,
      type: type,
      color: pastelColors[elData.category] || '#e2e8f0',
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: currentWobble,
      ghostPhase: ghostPhase,
      ghostFactor: ghostFactor
    });
    
    gameRef.current.lastEnemySpawn = now;
  };

  const createExplosion = (x, y, color, isBig = false) => {
    const particleCount = isBig ? 20 : 10;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      gameRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
    gameRef.current.shockwaves.push({
        x,
        y,
        radius: 10,
        maxRadius: isBig ? 80 : 40,
        opacity: 0.6,
        color: color,
        width: 3
    });
  };

  const addFloatingText = (x, y, text, color) => {
      gameRef.current.floatingTexts.push({ x, y, text, color, life: 1.0, vy: -1 });
  };

  // --- 主循環 ---
  const loop = (timestamp) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameRef.current;
    state.frame++;

    ctx.save();
    if (state.shake > 0) {
        const dx = (Math.random() - 0.5) * state.shake;
        const dy = (Math.random() - 0.5) * state.shake;
        ctx.translate(dx, dy);
        state.shake *= 0.9; 
        if (state.shake < 0.5) state.shake = 0;
    }

    ctx.fillStyle = '#f8fafc'; 
    ctx.fillRect(0 - 50, 0 - 50, state.width + 100, state.height + 100); 

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const gridSize = 40;
    ctx.beginPath();
    for(let x=0; x<state.width; x+=gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, state.height);
    }
    for(let y=0; y<state.height; y+=gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(state.width, y);
    }
    ctx.stroke();

    const levelScore = state.score - state.levelStartScore;
    state.spawnRate = Math.max(700, 1800 - levelScore * 3); 
    state.difficultyMultiplier = 1 + levelScore * 0.002; 
    state.wobbleFactor = Math.min(1.5, levelScore * 0.01);
    
    // Level 3: 幽靈 (600分)
    if (state.level >= 3) { state.ghostFactor = 1; }
    // Level 4: 極速 (1000分)
    if (state.level >= 4) { state.gravityFactor = 1.5; }

    if (!timestamp) timestamp = 0;
    if (timestamp - state.lastEnemySpawn > state.spawnRate) {
      spawnEnemy(timestamp);
    }
    spawnBonus(timestamp);

    for (let i = state.bullets.length - 1; i >= 0; i--) {
      let b = state.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      ctx.fillStyle = '#6366f1'; 
      ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, Math.PI * 2); ctx.fill();
      if (b.y < 0 || b.x < 0 || b.x > state.width) state.bullets.splice(i, 1);
    }

    for (let i = state.bonuses.length - 1; i >= 0; i--) {
        let bonus = state.bonuses[i];
        bonus.y += bonus.speed;
        bonus.angle += 0.05;
        ctx.save(); ctx.translate(bonus.x, bonus.y); ctx.rotate(Math.sin(bonus.angle) * 0.2);
        ctx.fillStyle = '#f43f5e'; 
        ctx.beginPath();
        ctx.arc(-10, -5, 10, Math.PI, 0); ctx.arc(10, -5, 10, Math.PI, 0);
        ctx.moveTo(20, -5); ctx.lineTo(0, 15); ctx.lineTo(-20, -5); ctx.fill();
        ctx.restore();

        let collected = false;
        for (let j = state.bullets.length - 1; j >= 0; j--) {
            let b = state.bullets[j];
            const dist = Math.sqrt((b.x - bonus.x)**2 + (b.y - bonus.y)**2);
            if (dist < bonus.radius + 10) {
                state.bullets.splice(j, 1); collected = true; break;
            }
        }
        if (collected) {
            state.bonuses.splice(i, 1);
            state.lives = Math.min(5, state.lives + 1);
            setLives(state.lives);
            addFloatingText(bonus.x, bonus.y, "LIFE UP!", "#f43f5e");
            createExplosion(bonus.x, bonus.y, "#f43f5e", true);
        } else if (bonus.y > state.height + 50) state.bonuses.splice(i, 1);
    }

    for (let i = state.enemies.length - 1; i >= 0; i--) {
      let e = state.enemies[i];
      e.y += e.speed;

      const amplitude = 40 * state.wobbleFactor; 
      if (e.wobbleSpeed > 0 && amplitude > 0) {
          e.x = e.originalX + Math.sin(state.frame * e.wobbleSpeed + e.wobblePhase) * amplitude;
          if (e.x < e.radius) e.x = e.radius;
          if (e.x > state.width - e.radius) e.x = state.width - e.radius;
      }

      let alpha = 1;
      if (e.ghostFactor > 0 && e.type !== 'hazard') {
          alpha = 0.3 + (Math.sin(state.frame * 0.05 + e.ghostPhase) + 1) / 2 * 0.7;
      }

      ctx.save(); 
      ctx.globalAlpha = alpha;

      ctx.fillStyle = e.color;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();
      
      let displayText = "";
      let fontSize = 24;
      let textColor = '#334155'; 

      if (e.type === 'hazard') {
          displayText = "☢️";
          fontSize = 32;
      } else {
          if (state.promptLang === 'en') {
              displayText = e.data.name; 
              fontSize = 22;
          } else {
              displayText = e.data.symbol; 
              fontSize = displayText.length > 1 ? 20 : 26;
          }
      }

      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px "Verdana", sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(displayText, e.x, e.y);

      ctx.restore(); 

      let hit = false;
      for (let j = state.bullets.length - 1; j >= 0; j--) {
        let b = state.bullets[j];
        const dist = Math.sqrt((b.x - e.x)**2 + (b.y - e.y)**2);

        if (dist < e.radius + 10) {
          state.bullets.splice(j, 1);
          
          if (e.type === 'hazard') {
              state.lives -= 1;
              state.score = Math.max(0, state.score - 20);
              state.combo = 0;
              state.shake = 10;
              createExplosion(e.x, e.y, '#ef4444', true);
              addFloatingText(e.x, e.y, '危險!', '#ef4444');
              addFloatingText(e.x, e.y + 30, '-20', '#ef4444');
              setLives(state.lives);
              setScore(state.score);
              setCombo(0);
          } else if (e.data.symbol === state.target?.symbol) {
            const comboBonus = Math.floor(state.combo / 3) * 5;
            const points = 10 + comboBonus;
            const newScore = state.score + points;
            
            if (state.level === 0 && newScore >= 100) {
                const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
                triggerLevelTransition(1, msg, "下一階段：輻射陷阱出現！");
                state.score = newScore;
                setScore(newScore);
                return; 
            }
            else if (state.level === 1 && newScore >= 300) {
                const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
                triggerLevelTransition(2, msg, "下一階段：亂流飄移區！");
                state.score = newScore;
                setScore(newScore);
                return;
            }
            else if (state.level === 2 && newScore >= 600) {
                const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
                triggerLevelTransition(3, msg, "下一階段：幽靈隱形模式！");
                state.score = newScore;
                setScore(newScore);
                return;
            }
            else if (state.level === 3 && newScore >= 1000) {
                const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
                triggerLevelTransition(4, msg, "下一階段：極速重力區！");
                state.score = newScore;
                setScore(newScore);
                return;
            }
            else if (newScore % 50 !== 0 && Math.floor(newScore / 10) > Math.floor(state.score / 10)) {
                const randomMsg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
                addFloatingText(state.width / 2, state.height / 2 - 50, randomMsg, "#f59e0b");
            }

            state.score = newScore;
            state.combo += 1;
            state.shake = 2; 
            createExplosion(e.x, e.y, e.color, true);
            addFloatingText(e.x, e.y, `+${points}`, '#15803d'); 
            if (state.combo > 1) addFloatingText(e.x, e.y - 25, `${state.combo} 連擊!`, '#d97706'); 
            
            setScore(state.score);
            setCombo(state.combo);
            pickNewTarget();
          } else {
            state.score = Math.max(0, state.score - 5);
            state.combo = 0;
            state.shake = 5; 
            createExplosion(e.x, e.y, '#94a3b8', false); 
            addFloatingText(e.x, e.y, '打錯了', '#64748b');
            addFloatingText(e.x, e.y + 25, '-5', '#64748b');
            setScore(state.score);
            setCombo(0);
          }
          state.enemies.splice(i, 1);
          hit = true;
          break;
        }
      }
      if (hit) continue;

      if (e.y > state.height + e.radius) {
        state.enemies.splice(i, 1);
        if (e.type !== 'hazard' && e.data.symbol === state.target?.symbol) {
             state.lives -= 1;
             state.combo = 0;
             state.shake = 5; 
             addFloatingText(state.width/2, state.height - 80, '漏接了!', '#ef4444');
             setLives(state.lives);
             setCombo(0);
        }
      }
    }

    [state.particles, state.shockwaves, state.floatingTexts].forEach(arr => {
        for (let i = arr.length - 1; i >= 0; i--) {
            let p = arr[i];
            if (p.vx !== undefined) {
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                if (p.life <= 0) arr.splice(i, 1);
                else {
                    ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
            } else if (p.radius !== undefined) {
                p.radius += 2; p.opacity -= 0.03;
                if (p.opacity <= 0) arr.splice(i, 1);
                else {
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
                    ctx.lineWidth = p.width; ctx.strokeStyle = p.color;
                    ctx.globalAlpha = p.opacity; ctx.stroke(); ctx.globalAlpha = 1.0;
                }
            } else {
                p.y += p.vy; p.life -= 0.02;
                if (p.life <= 0) arr.splice(i, 1);
                else {
                    ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
                    ctx.font = 'bold 20px "Segoe UI"'; ctx.textAlign = 'center';
                    ctx.fillText(p.text, p.x, p.y); ctx.restore();
                }
            }
        }
    });

    const centerX = state.width / 2;
    const centerY = state.height - 40;
    ctx.save(); ctx.translate(centerX, centerY);
    ctx.rotate(Math.sin(state.frame * 0.05) * 0.1);
    ctx.fillStyle = '#475569'; ctx.fillRect(-6, -30, 12, 40);
    ctx.restore();
    ctx.beginPath(); ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#334155'; ctx.fill();
    ctx.beginPath(); ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#94a3b8'; ctx.fill();
    ctx.restore(); 

    if (state.lives <= 0) {
      setGameState('gameover');
    } else {
      state.animationId = requestAnimationFrame(loop);
    }
  };

  // --- 事件處理 ---
  const handleShoot = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const startX = gameRef.current.width / 2;
    const startY = gameRef.current.height - 40;
    const angle = Math.atan2(mouseY - startY, mouseX - startX);
    const speed = 18; 
    
    gameRef.current.bullets.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed
    });
    gameRef.current.shake = 1;
  };

  useEffect(() => {
    const handleResize = () => {
        if(canvasRef.current && canvasRef.current.parentElement){
            gameRef.current.width = canvasRef.current.parentElement.clientWidth;
            gameRef.current.height = canvasRef.current.parentElement.clientHeight;
            canvasRef.current.width = gameRef.current.width;
            canvasRef.current.height = gameRef.current.height;
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
        cancelAnimationFrame(gameRef.current.animationId);
        gameRef.current.animationId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(gameRef.current.animationId);
  }, [gameState]); 

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden flex flex-col relative touch-none select-none">
      
      {/* 遊戲 HUD */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3">
            <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">分數</div>
                <div className="text-3xl font-black font-mono tracking-wide text-indigo-600">{score.toString().padStart(6, '0')}</div>
            </div>
            <div className="flex gap-1 ml-1">
                {[...Array(5)].map((_, i) => (
                    <Heart key={i} size={24} className={`${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300'} transition-all duration-300`} />
                ))}
            </div>
        </div>

        {targetElement && gameState === 'playing' && (
             <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col items-center animate-in slide-in-from-top-10 duration-500 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-xl px-8 py-4 rounded-2xl border border-indigo-100 shadow-lg flex items-center gap-4 min-w-[280px]">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Target className="text-indigo-500" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs text-indigo-400 font-bold tracking-[0.1em] uppercase mb-0.5">
                            {currentPromptLang === 'zh' ? '請射擊 (英文符號)' : '請射擊 (中文名稱)'}
                        </div>
                        <div className="text-3xl font-black text-slate-800">
                            {currentPromptLang === 'zh' ? targetElement.name : `${targetElement.nameEn} (${targetElement.symbol})`}
                        </div>
                    </div>
                </div>
                {message && (
                    <div className="mt-4 px-6 py-3 bg-amber-100 border border-amber-300 text-amber-800 text-lg font-bold tracking-wider rounded-xl shadow-lg animate-bounce z-50">
                        {message}
                    </div>
                )}
             </div>
        )}

        <div className="flex flex-col items-end gap-3 pointer-events-auto">
             {gameState === 'playing' && (
                <button onClick={pauseGame} className="bg-white/90 p-3 rounded-full hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm transition-colors backdrop-blur-sm">
                    <Pause size={20} />
                </button>
             )}
             {combo > 1 && (
                 <div className="animate-in slide-in-from-right-10 zoom-in duration-300 flex flex-col items-end">
                     <div className="text-4xl font-black italic text-amber-500 drop-shadow-sm transform -skew-x-12">{combo}x</div>
                     <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mr-1">連擊!</div>
                 </div>
             )}
        </div>
      </div>

      <div className="flex-1 w-full h-full relative cursor-crosshair active:cursor-crosshair bg-slate-50">
         <canvas ref={canvasRef} className="block w-full h-full" onMouseDown={handleShoot} onTouchStart={handleShoot} />
      </div>

      {/* 暫停選單 */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-widest uppercase">遊戲暫停</h2>
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button onClick={resumeGame} className="flex items-center justify-center gap-3 px-10 py-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg">
                    <Play size={24} className="fill-current"/> 繼續遊戲
                </button>
                <button onClick={initGame} className="flex items-center justify-center gap-3 px-10 py-4 font-bold text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50">
                    <RotateCcw size={24}/> 重新開始
                </button>
                <button onClick={() => setGameState('menu')} className="flex items-center justify-center gap-3 px-10 py-4 font-bold text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50">
                    <ArrowLeft size={24}/> 回主選單
                </button>
            </div>
        </div>
      )}

      {/* 轉場畫面 (中場休息) */}
      {gameState === 'transition' && (
        <div className="fixed inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="text-4xl font-black text-indigo-600 mb-2">{transitionData.title}</h2>
            <p className="text-slate-500 text-xl mb-8">{transitionData.subtitle}</p>
            
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                <p className="text-slate-400 font-bold tracking-widest uppercase">
                    休息一下... {transitionData.count}
                </p>
            </div>
        </div>
      )}

      {/* 選單畫面 */}
      {gameState === 'menu' && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="mb-8">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl">
                        <BookOpen size={48} className="text-indigo-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">元素射擊：特訓班</h1>
                <p className="text-slate-500 text-lg">輕鬆學習化學元素的英文與符號</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 w-full max-w-lg">
                {[
                    { id: 'en_target', label: '中測英', desc: '提示:中文 球:英文' },
                    { id: 'zh_target', label: '英測中', desc: '提示:英文 球:中文' },
                    { id: 'mixed', label: '混合訓練', desc: '隨機切換 挑戰反應' }
                ].map(mode => (
                    <button 
                        key={mode.id}
                        onClick={() => setLangMode(mode.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1
                            ${langMode === mode.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'}
                        `}
                    >
                        <div className="font-bold text-base">{mode.label}</div>
                        <div className="text-xs opacity-70">{mode.desc}</div>
                    </button>
                ))}
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button onClick={initGame} className="flex items-center justify-center gap-3 px-10 py-5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 shadow-md w-full">
                    <Play size={24} className="fill-current" />
                    <span className="text-lg tracking-wider">開始練習</span>
                </button>
                
                <button onClick={() => setGameState('select')} className="flex items-center justify-center gap-3 px-10 py-4 font-bold text-slate-600 transition-all duration-300 bg-white rounded-xl hover:bg-slate-50 hover:text-slate-800 border-2 border-slate-200 hover:border-slate-300 w-full">
                    <Settings size={20} />
                    <span className="text-sm tracking-wider">選擇元素範圍</span>
                </button>
            </div>
        </div>
      )}

      {/* 元素選擇畫面 (固定佈局) */}
      {gameState === 'select' && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
             <div className="shrink-0 p-4 bg-white border-b border-slate-200 shadow-sm z-10 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Settings className="text-indigo-500"/><span>自訂題庫</span></h2>
                    <p className="text-slate-500 text-xs">已選擇 {selectedSymbols.size} 個元素</p>
                 </div>
                 <div className="flex gap-2">
                     <button onClick={selectAll} className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300">全選</button>
                     <button onClick={deselectAll} className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300">清除</button>
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar touch-auto">
                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {elementsData.map(el => {
                        const isSelected = selectedSymbols.has(el.symbol);
                        const dotColor = pastelColors[el.category] || '#ccc';
                        return (
                            <button key={el.symbol} onClick={() => toggleSelection(el.symbol)} className={`relative p-3 rounded-xl border-2 transition-all duration-200 group text-left ${isSelected ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-100' : 'bg-slate-100 border-slate-200 opacity-60 hover:opacity-100'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-2xl font-black text-slate-800">{el.symbol}</span>
                                    {isSelected ? <CheckSquare size={20} className="text-indigo-500"/> : <Square size={20} className="text-slate-400"/>}
                                </div>
                                <div className="text-sm font-bold text-slate-600 mb-1">{el.name}</div>
                                <div className="text-xs text-slate-400">{el.nameEn}</div>
                                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full" style={{backgroundColor: dotColor}}></div>
                            </button>
                        );
                    })}
                 </div>
                 {/* Padding to prevent content from being hidden behind fixed footer */}
                 <div className="h-24"></div>
             </div>

             <div className="shrink-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 flex justify-end">
                <button onClick={initGame} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 w-full sm:w-auto justify-center">
                    <span>確認並開始遊戲</span>
                    <Play size={20} />
                </button>
             </div>
        </div>
      )}

      {/* Game Over 畫面 */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="mb-10 relative">
                <div className="p-4 bg-red-50 rounded-full inline-block mb-4">
                    <AlertTriangle size={48} className="text-red-500" />
                </div>
                <div className="text-red-500 font-bold text-xl mb-2 tracking-widest uppercase">練習結束</div>
                <div className="text-7xl font-black text-slate-800 mb-2">{score}</div>
                <div className="inline-block px-4 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-sm tracking-wider">最終得分</div>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setGameState('menu')} className="px-6 py-3 font-bold text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-all border-2 border-slate-200 shadow-sm">回主選單</button>
                <button onClick={initGame} className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md hover:-translate-y-1"><RotateCcw size={20} /><span>再來一次</span></button>
            </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;