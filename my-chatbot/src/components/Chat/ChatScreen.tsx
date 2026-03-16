import './ChatScreen.css';
import { useState } from "react";
import { Message, MessageSender } from '../../types';



interface ChatScreenProps {
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack }) => {
  // 初期メッセージを設定
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot", // MessageSender型を使用
      content: "こんにちは！政策についてのご質問ですか？",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");

  // メッセージ送信関数
  const handleSend = () => {
    if (!inputText.trim()) return;

    // ユーザーのメッセージを作成
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user" as MessageSender, // ここで型を明示的に使用
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // ボットの固定返信（1秒後）
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot" as MessageSender,
        content: "高市さんは日本の総理大臣です",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };


 return (
    <div className="screen-container">
      <div className="chat-card">
        {/* ヘッダー */}
        <div className="header">
          <div className="chat-title">政策Chatbot</div>
          <button className="back-button" onClick={onBack}>
            &larr; 戻る
          </button>
        </div>

        {/* メッセージエリア */}
        <div className="message-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-container ${msg.sender}`}>
              <div className={`message-bubble ${msg.sender}-bubble`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* 入力エリア */}
        <div className="input-area">
          <input
            type="text"
            className="message-input"
            placeholder="例）気になることを入力"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-button" onClick={handleSend}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;