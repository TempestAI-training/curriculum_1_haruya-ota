import React, { useState } from 'react';
import { ViewState } from './frontend/types';
import StartScreen from './frontend/components/StartScreen/StartScreen';
import ChatScreen from './frontend/components/Chat/ChatScreen'; 

function App() {
  const [viewState, setViewState] = useState<ViewState>('start');

  //セッションIDの管理を行う
  const [sessionId, setSessionId] = useState<number | null>(null);

  // 画面を切り替える関数
  const handleStart = () => setViewState('chat');
  const handleBack = () => setViewState('start');

  //リセット関数を追加
  const handleReset = () => {
    setSessionId(null); // セッションIDをリセット
    setViewState('start'); // スタート画面に戻る
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {viewState === 'start' ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <ChatScreen 
        onBack={handleBack}
        sessionId={sessionId}
        setSessionId={setSessionId}
        onReset={handleReset}
         />
      )}
    </div>
  );
}

export default App;