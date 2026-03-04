import React, { useState } from 'react';
import { ViewState } from './types';
import StartScreen from './components/StartScreen';
import ChatScreen from './components/Chat/ChatScreen'; 

function App() {
  const [viewState, setViewState] = useState<ViewState>('start');

  // 画面を切り替える関数
  const handleStart = () => setViewState('chat');
  const handleBack = () => setViewState('start');

  return (
    <div className="min-h-screen bg-slate-100">
      {viewState === 'start' ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <ChatScreen onBack={handleBack} />
      )}
    </div>
  );
}

export default App;