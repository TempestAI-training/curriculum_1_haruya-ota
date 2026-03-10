//送信者の定義

export const Sender = {
    user:{
    name: "Sender",
    avatarUrl: "https://example.com/avatar.jpg"
},
bot:{
    name: "Assistant",
    avatarUrl: "https://example.com/avatar.jpg"
}
} as const;


//送信者の型の定義
export type MessageSender = keyof typeof Sender;

//メッセージの定義
export interface Message {
    id: string;
    sender: MessageSender;
    content: string;
    timestamp: Date;
}

//画面遷移の状態

export type ViewState = 'start' | 'chat' ;
