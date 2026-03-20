import React from 'react';
import './StartScreen.css';

interface StartScreenProps {
    readonly onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
 return (
    <div className = "screen-container">

        <div className="start-screen">
        <h1 className='header-title'>政策Chatbot</h1>
            <h2>政治について学習しよう</h2>
            <p>任意の質問に対して、高市総理の考えを返答します。</p>
            <button className='Start-button' onClick={onStart}>チャットを始める
            </button>
        </div>
    </div>
 );
}
export default StartScreen;