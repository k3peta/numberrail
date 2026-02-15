import React from 'react';
import './Tutorial.css';

const Tutorial = () => {
    return (
        <div className="tutorial-container">
            <div className="tutorial-title">
                Running Tutorial
            </div>

            <div className="tutorial-demo-box">
                {/* Mini Board 3x3 */}
                <div className="mini-board">
                    {/* SVG Layer for animation */}
                    <svg className="tutorial-svg" viewBox="0 0 120 120">
                        {/* Start(0,0) -> R(1,0) -> D(1,1) -> D(1,2) */}
                        {/* Coords: 0=>20, 1=>60, 2=>100 (approx center of cells) */}
                        <path className="demo-path" d="M 20 20 L 60 20 L 60 60 L 60 100" />
                    </svg>

                    {/* Hand Cursor */}
                    <div className="tutorial-hand"></div>

                    {/* Cells */}
                    <div className="mini-cell start">
                        <span className="tutorial-hint-val">
                            <span className="val-tens">4</span>
                            <span className="val-ones">1</span>
                        </span>
                    </div>
                    <div className="mini-cell"></div>
                    <div className="mini-cell"></div>

                    <div className="mini-cell"></div>
                    <div className="mini-cell"></div>
                    <div className="mini-cell"></div>

                    <div className="mini-cell"></div>
                    <div className="mini-cell"></div>
                    <div className="mini-cell"></div>
                </div>

                {/* Explanation */}
                <div className="tutorial-text">
                    <div className="explanation-row tens-highlight">
                        <span className="val-tens" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>4</span>
                        <span>=</span>
                        <span className="label">長さ (Length)</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
                        マスの数 (Start含まず)
                    </div>

                    <div className="explanation-row ones-highlight" style={{ marginTop: '0.5rem' }}>
                        <span className="val-ones" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1</span>
                        <span>=</span>
                        <span className="label">曲がり (Turns)</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, paddingLeft: '1.5rem' }}>
                        曲がる回数
                    </div>
                </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                数字をドラッグして、正しくつなごう！
            </div>
        </div>
    );
};

export default Tutorial;
