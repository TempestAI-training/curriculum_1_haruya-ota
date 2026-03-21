import './ChatScreen.css';
import { useState } from "react";
import { Message, MessageSender } from '../../types';

interface ChatScreenProps {
  onBack: () => void;
  onReset: () => void;
  sessionId: number | null;
  setSessionId: (id: number | null) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, onReset, sessionId, setSessionId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content: "政策Chatbotの早苗です。気になることを何でも聞いてくださいね。",
      
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  

  const handleSend = async () => {
    // --- デバッグログ 1 ---
    console.log(">>> 1. handleSendが発火しました");
    
    if (!inputText.trim() || isTyping) {
      console.log(">>> 判定により中断: textが空か、送信中(isTyping)です");
      return;
    }

    const currentInput = inputText;
    
    // ユーザーのメッセージを画面に表示
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user" as MessageSender,
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // --- デバッグログ 2 ---
    console.log(">>> 2. fetch直前: payload ->", { message: currentInput, session_id: sessionId });

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: currentInput, 
          session_id: sessionId 
        }),
      });

      // --- デバッグログ 3 ---
      console.log(">>> 3. HTTPレスポンス受信: status =", response.status);

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();
      
      // --- デバッグログ 4 ---
      console.log(">>> 4. JSONパース成功: data =", data);

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot" as MessageSender,
        content: data.reply || "申し訳ありませんが、回答が得られませんでした。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      // --- デバッグログ 5 ---
      console.error(">>> 5. エラー発生:", error);
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot" as MessageSender,
        content: "申し訳ありません。エラーが発生しました。詳細はコンソールを確認してください。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      // --- デバッグログ 6 ---
      console.log(">>> 6. handleSend 終了");
    }
  };

  return (
    <div className="screen-container">
      <div className="chat-card">
        <div className="header">
          <div className="chat-title">
            <h2>政策Chatbot</h2>
          </div>
          <button className="back-button" onClick={onBack}>&larr; 戻る</button>
        </div>

        <div className="message-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-container ${msg.sender}`}>
              <div className={`message-bubble ${msg.sender}-bubble`}>{msg.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message-container bot">
              <div className="message-bubble bot-bubble typing">早苗さんが回答を執筆中...</div>
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            className="message-input"
            placeholder={isTyping ? "執筆中..." : "例）気になることを入力"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
          />
          <button className="send-button" onClick={handleSend} disabled={isTyping || !inputText.trim()}>
            {isTyping ? "執筆中..." : "送信"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;