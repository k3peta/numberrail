import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './App.css';
import { levels } from './levels';
import Tutorial from './Tutorial';
import { bgmManager } from './BgmManager';

const CELL_SIZE = 60;
const GAP = 4;
const COLORS = [
    '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#d946ef', '#06b6d4', '#8b5cf6', '#ec4899'
];

const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
};

const analyzePath = (path) => {
    if (path.length === 0) return { length: 0, turns: 0 };
    const length = path.length;
    let turns = 0;
    if (path.length > 2) {
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];
            const d1r = curr.r - prev.r;
            const d1c = curr.c - prev.c;
            const d2r = next.r - curr.r;
            const d2c = next.c - curr.c;
            if (d1r !== d2r || d1c !== d2c) turns++;
        }
    }
    return { length, turns };
};

const getHintStatus = (hint, path) => {
    if (!hint) return 'empty'; // Safety check for undefined hint
    if (!path) return 'empty';
    const { length, turns } = analyzePath(path);
    const targetLength = Math.floor(hint.val / 10);
    const targetTurns = hint.val % 10;
    const lenOk = length === targetLength;
    const turnOk = turns === targetTurns;
    if (lenOk && turnOk) return 'correct';
    if (length > targetLength) return 'error';
    return 'active';
};

function App() {
    const [levelIndex, setLevelIndex] = useState(0);
    const [paths, setPaths] = useState({});
    const [activeHintIndex, setActiveHintIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMenu, setIsMenu] = useState(true);
    const [clearedLevels, setClearedLevels] = useState([]);
    const [menuTab, setMenuTab] = useState(0);

    // Timer State
    const [timerEnabled, setTimerEnabled] = useState(false); // Default OFF
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180s
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // BGM State
    const [isBgmOn, setIsBgmOn] = useState(false);

    const toggleBgm = () => {
        const playing = bgmManager.toggle();
        setIsBgmOn(playing);
    };

    const level = levels[levelIndex];

    // Safety check
    if (!level) {
        console.error('Level not found for index:', levelIndex);
        return <div>Error: Level {levelIndex + 1} not found</div>;
    }

    const { size, hints } = level;

    const activeHintRef = useRef(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        // Force clear for debug
        setClearedLevels([]);
        localStorage.removeItem('numrail_cleared_v2');
    }, []);

    // Level Reset / Init
    // Level Initialization & Timer Logic
    useEffect(() => {
        const currentLevel = levels[levelIndex];
        if (!currentLevel) return;

        // Path Reset
        const initialPaths = {};
        if (currentLevel.hints) {
            currentLevel.hints.forEach((h, i) => {
                initialPaths[i] = [{ r: h.r, c: h.c }];
            });
        }
        setPaths(initialPaths);
        setActiveHintIndex(null);
        setIsDragging(false);

        // Timer Reset
        if (timerEnabled) {
            setTimeLeft(180);
            setIsTimeUp(false);
            setIsTimerRunning(!isMenu);
        } else {
            setIsTimeUp(false);
            setIsTimerRunning(false);
        }
    }, [levelIndex, timerEnabled, isMenu]);

    // Timer Tick
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        setIsTimeUp(true);
                        setIsTimerRunning(false);
                        setIsDragging(false); // Stop interaction
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    useEffect(() => {
        activeHintRef.current = activeHintIndex;
        isDraggingRef.current = isDragging;
    }, [activeHintIndex, isDragging]);

    const attemptMove = (r, c) => {
        if (isTimeUp) return; // Block input if time up

        const currentIdx = activeHintRef.current;
        if (!isDraggingRef.current || currentIdx === null) return;

        setPaths(prev => {
            const currentPath = prev[currentIdx];
            const tip = currentPath[currentPath.length - 1];
            if (tip.r === r && tip.c === c) return prev;

            const dr = Math.abs(r - tip.r);
            const dc = Math.abs(c - tip.c);
            if (dr + dc !== 1) return prev;

            if (currentPath.length > 1) {
                const prevCell = currentPath[currentPath.length - 2];
                if (prevCell.r === r && prevCell.c === c) {
                    return { ...prev, [currentIdx]: currentPath.slice(0, -1) };
                }
            }

            let isOccupied = false;
            Object.entries(prev).forEach(([idx, p]) => {
                if (p.some(cell => cell.r === r && cell.c === c)) isOccupied = true;
            });
            if (isOccupied) return prev;

            return { ...prev, [currentIdx]: [...currentPath, { r, c }] };
        });
    };

    const handleStart = (r, c) => {
        if (isTimeUp || allCorrect) return; // Block input

        const clickedHintIdx = hints.findIndex(h => h.r === r && h.c === c);
        if (clickedHintIdx !== -1) {
            setActiveHintIndex(clickedHintIdx);
            setPaths(prev => ({ ...prev, [clickedHintIdx]: [{ r, c }] }));
            setIsDragging(true);
            return;
        }

        let foundIdx = -1;
        Object.entries(paths).forEach(([idx, p]) => {
            const tip = p[p.length - 1];
            if (tip.r === r && tip.c === c) {
                foundIdx = parseInt(idx);
            }
        });

        if (foundIdx !== -1) {
            setActiveHintIndex(foundIdx);
            setIsDragging(true);
        }
    };

    const handleEnd = () => {
        setIsDragging(false);
        setActiveHintIndex(null);
    };

    const onMouseDown = (r, c) => handleStart(r, c);
    const onMouseEnter = (r, c) => attemptMove(r, c);

    useEffect(() => {
        const upHandler = () => handleEnd();
        window.addEventListener('mouseup', upHandler);
        window.addEventListener('touchend', upHandler);
        return () => {
            window.removeEventListener('mouseup', upHandler);
            window.removeEventListener('touchend', upHandler);
        };
    }, []);

    const onTouchMove = (e) => {
        if (!isDraggingRef.current || isTimeUp) return;
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el) {
            const cell = el.closest('.cell');
            if (cell) {
                const r = parseInt(cell.dataset.r);
                const c = parseInt(cell.dataset.c);
                if (!isNaN(r) && !isNaN(c)) {
                    attemptMove(r, c);
                }
            }
        }
    };

    let allCorrect = true;
    const occupiedSet = new Set();
    hints.forEach((h, i) => {
        const p = paths[i] || [];
        const status = getHintStatus(h, p);
        if (status !== 'correct') allCorrect = false;
        p.forEach(cell => occupiedSet.add(`${cell.r},${cell.c}`));
    });
    if (occupiedSet.size !== size * size) allCorrect = false;

    useEffect(() => {
        if (allCorrect) {
            // Stop Timer
            setIsTimerRunning(false);

            if (!clearedLevels.includes(level.id)) {
                const newCleared = [...clearedLevels, level.id];
                setClearedLevels(newCleared);
                localStorage.setItem('numrail_cleared_v2', JSON.stringify(newCleared));
            }
            const count = 200;
            const defaults = { origin: { y: 0.7 }, zIndex: 100 };
            function fire(particleRatio, opts) {
                confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
            }
            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }
    }, [allCorrect, level.id]);

    const renderSVGLine = (idx, path) => {
        if (path.length < 2) return null;

        const status = getHintStatus(hints[idx], path);
        if (status === 'correct') return null;

        const points = path.map(p => {
            const x = p.c * (CELL_SIZE + GAP) + CELL_SIZE / 2;
            const y = p.r * (CELL_SIZE + GAP) + CELL_SIZE / 2;
            return `${x},${y}`;
        }).join(' ');
        const color = COLORS[idx % COLORS.length];

        return (
            <polyline
                key={idx}
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
                style={{ transition: 'all 0.3s', pointerEvents: 'none' }}
            />
        );
    };

    const getCellColor = (r, c) => {
        let ownerId = null;
        let pathRef = null;

        Object.entries(paths).forEach(([idx, p]) => {
            if (p.some(cell => cell.r === r && cell.c === c)) {
                ownerId = parseInt(idx);
                pathRef = p;
            }
        });

        if (ownerId !== null) {
            const baseColor = COLORS[ownerId % COLORS.length];
            const status = getHintStatus(hints[ownerId], pathRef);

            if (status === 'correct') {
                return {
                    background: baseColor,
                    border: `2px solid ${baseColor}`,
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
                    opacity: 0.9,
                    transition: 'background 0.3s, opacity 0.3s'
                };
            } else {
                return {
                    border: `2px solid ${baseColor}`,
                    background: `${baseColor}33`,
                    transition: 'background 0.3s'
                };
            }
        }
        return {};
    };

    // SVG Icon for Speaker
    const SpeakerIcon = ({ isOn }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            {isOn && (
                <>
                    <path className="sound-wave-anim" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </>
            )}
            {!isOn && (
                <>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </>
            )}
        </svg>
    );

    const BgmButton = () => (
        <button
            onClick={toggleBgm}
            style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isBgmOn ? '#4ade80' : '#94a3b8',
                transition: 'all 0.3s'
            }}
            title={isBgmOn ? "Mute BGM" : "Play BGM"}
        >
            <SpeakerIcon isOn={isBgmOn} />
        </button>
    );

    /** MENU **/
    if (isMenu) {
        return (
            <div className="app-container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h1>Number Rail</h1>
                    <BgmButton />
                </div>

                <Tutorial />

                {(() => {
                    const tabs = [
                        { label: '🎓 Tutorial', short: '4×4', filter: l => l.size === 4 && !String(l.id).startsWith('H') },
                        { label: '⭐ Main', short: '6×6', filter: l => l.size === 6 && !String(l.id).startsWith('H') },
                        { label: '🔥 Expert', short: '9×9', filter: l => l.size === 9 && !String(l.id).startsWith('X') },
                        { label: '💀 Hard', short: '6×6', filter: l => String(l.id).startsWith('H') },
                        { label: '💎 Extreme', short: '9×9', filter: l => String(l.id).startsWith('X') },
                    ];
                    const activeTab = tabs[menuTab];
                    const sectionLevels = levels.map((l, i) => ({ l, i })).filter(({ l }) => activeTab.filter(l));
                    return (
                        <>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {tabs.map((tab, ti) => (
                                    <button
                                        key={ti}
                                        onClick={() => setMenuTab(ti)}
                                        style={{
                                            padding: '6px 10px',
                                            fontSize: '0.7rem',
                                            fontWeight: menuTab === ti ? 'bold' : 'normal',
                                            background: menuTab === ti ? '#6366f1' : '#1e293b',
                                            color: menuTab === ti ? 'white' : '#94a3b8',
                                            border: menuTab === ti ? '2px solid #818cf8' : '1px solid #334155',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="level-grid custom-scroll">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', width: '100%', justifyItems: 'center' }}>
                                    {sectionLevels.map(({ l, i }, idx) => {
                                        const isCleared = clearedLevels.includes(l.id);
                                        return (
                                            <button
                                                key={l.id}
                                                onClick={() => { setLevelIndex(i); setIsMenu(false); }}
                                                style={{
                                                    width: '50px', height: '50px',
                                                    background: isCleared ? '#4ade80' : '#334155',
                                                    color: isCleared ? '#064e3b' : 'white',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem',
                                                    border: isCleared ? '2px solid #22c55e' : 'none',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{idx + 1}</span>
                                                <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>{activeTab.short}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    );
                })()}

                {/* Timer Toggle in Menu - Moved to Bottom */}
                <div className="controls" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Timer Mode (3 min):
                        <button
                            className={`toggle-btn ${timerEnabled ? 'active' : ''}`}
                            onClick={() => setTimerEnabled(!timerEnabled)}
                        >
                            {timerEnabled ? 'ON' : 'OFF'}
                        </button>
                    </span>
                </div>
            </div>
        )
    }

    const hasNext = levelIndex < levels.length - 1;

    return (
        <div className="app-container" onTouchMove={onTouchMove}>
            {/* Timer UI inside Game */}
            {timerEnabled && (
                <div className={`timer-display ${timeLeft < 30 ? (timeLeft < 10 ? 'critical' : 'warn') : ''}`}>
                    {formatTime(timeLeft)}
                </div>
            )}



            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', maxWidth: (size * (CELL_SIZE + GAP)) }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setIsMenu(true)} style={{ fontSize: '0.8rem' }}>List</button>
                    <BgmButton />
                </div>

                <span style={{ fontWeight: 'bold', color: allCorrect ? '#4ade80' : 'white' }}>
                    Level {levelIndex + 1}
                </span>
                <div style={{ width: 40 }}></div>
            </div>



            <div
                className="game-board"
                style={{
                    width: size * (CELL_SIZE + GAP) - GAP + 32,
                    height: size * (CELL_SIZE + GAP) - GAP + 32
                }}
            >
                {isTimeUp && (
                    <div className="time-up-overlay">
                        <div className="time-up-text">TIME UP!</div>
                        <button
                            onClick={() => {
                                // Restart Level
                                setTimeLeft(180);
                                setIsTimeUp(false);
                                setIsTimerRunning(true);
                                // Reset Board
                                const initialPaths = {};
                                hints.forEach((h, i) => { initialPaths[i] = [{ r: h.r, c: h.c }]; });
                                setPaths(initialPaths);
                            }}
                            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                    {Array.from({ length: size * size }).map((_, i) => {
                        const r = Math.floor(i / size);
                        const c = i % size;
                        const style = getCellColor(r, c);
                        const hint = hints.find(h => h.r === r && h.c === c);

                        return (
                            <div
                                key={i}
                                className="cell"
                                data-r={r}
                                data-c={c}
                                style={style}
                                onMouseDown={() => onMouseDown(r, c)}
                                onMouseEnter={() => onMouseEnter(r, c)}
                                onTouchStart={() => onMouseDown(r, c)}
                            >
                                {hint && <span className="hint-number">{hint.val}</span>}
                            </div>
                        );
                    })}
                </div>

                <svg
                    className="svg-layer"
                    width={size * (CELL_SIZE + GAP)}
                    height={size * (CELL_SIZE + GAP)}
                >
                    {Object.entries(paths).map(([idx, p]) => renderSVGLine(parseInt(idx), p))}
                </svg>
            </div>

            {allCorrect && (
                <div className="win-banner-inline">
                    🎉 COMPLETE!
                </div>
            )}

            <div className="controls">
                <button onClick={() => setLevelIndex(Math.max(0, levelIndex - 1))} disabled={levelIndex === 0}>
                    ← Prev
                </button>
                <button onClick={() => {
                    const initialPaths = {};
                    hints.forEach((h, i) => { initialPaths[i] = [{ r: h.r, c: h.c }]; });
                    setPaths(initialPaths);
                    if (timerEnabled) {
                        setTimeLeft(180);
                        setIsTimeUp(false);
                        setIsTimerRunning(true);
                    }
                }}>
                    Reset
                </button>
                <button
                    className={allCorrect ? 'glow-btn' : ''}
                    onClick={() => setLevelIndex(Math.min(levels.length - 1, levelIndex + 1))}
                    disabled={hasNext === false}
                >
                    Next →
                </button>
            </div>

            <div style={{
                marginTop: '1rem',
                color: '#64748b',
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center',
                fontSize: '0.9rem',
                minHeight: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: allCorrect ? 0 : 1,
                transition: 'opacity 0.3s'
            }}>
                <div>
                    Drag numbers to connect.<br />
                    [Length] [Turn]
                </div>
            </div>
        </div>
    );
}

export default App;
