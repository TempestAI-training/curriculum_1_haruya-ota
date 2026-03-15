//送信者の定義

export const Sender = {
    user:{
    name: "Sender",
    
},
bot:{
    name: "Assistant",
    
}
} as const;


//送信者の型の定義
export type MessageSender = keyof typeof Sender;

//メッセージの定義
export type ViewState = 'start' | 'chat'; 

// 1. メッセージ1件の定義
export interface Message {
    id: string;            // DBのID
    sender: 'user' | 'bot'; // 'assistant' を 'bot' にマッピングして使う
    content: string;
    timestamp: Date;        // 文字列で届くので変換が必要
}

// 2. /chat APIへのリクエスト形式
export interface ChatRequest {
    message: string;
    session_id: number | null; // 初回はnull
}

// 3. /chat APIからのレスポンス形式
export interface ChatResponse {
    reply: string;
    session_id: number;
}