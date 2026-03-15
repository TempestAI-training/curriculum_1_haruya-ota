import React from 'react';
import './StartScreen.css';

interface StartScreenProps {
    readonly onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
 return (
    <div className = "screen-container">

        <div className="start-screen">
            <h1 className='header-title'>Politics Study</h1>
            <h2>早苗さんの政策について学ぼう！</h2>
            <p>任意のお問い合わせに対して早苗さんの考えを返答します。</p>
            <button className='Start-button' onClick={onStart}>チャットを始める
            </button>
        </div>
    </div>
 );
}
export default StartScreen;