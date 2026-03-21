import os
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from openai import AzureOpenAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database_utils import init_db
from contextlib import asynccontextmanager


from database_utils import save_message,create_session, get_chat_history

load_dotenv()
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- 起動時の処理 ---
    try:
        init_db()  # init_db自体が同期関数ならそのままでOK
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Database initialization failed: {e}")
    
    yield  # ここでアプリが起動状態になる
    
    # --- 終了時の処理 ---
    print("Shutting down...")
app = FastAPI(lifespan=lifespan)

origins = [
    "*",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION")
)


# クライアントからのリクエスト形式を拡張
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None  # フロントからセッションIDを受け取れるようにする
    
# 環境変数から制限件数を取得
MAX_HISTORY_COUNT = int(os.getenv("MAX_HISTORY_COUNT", 10))

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

@app.post("/chat")

def chat(request: ChatRequest):
    try:
        model_name = DEPLOYMENT_NAME
        
        # --- セッションの準備 ---
        # セッションIDが送られてこない場合は、新規作成する
        current_session_id = request.session_id
        history_data = [] # 最初に空のリストで初期化しておく
        
        if current_session_id is None:
            current_session_id = create_session(model_name)
        else:   
            history_data = get_chat_history(current_session_id, MAX_HISTORY_COUNT)
            print(f"セッションID {current_session_id} の過去の履歴: {history_data}")
            
       # 「内閣総理大臣の高市早苗さん」というロールを与える」
        system_prompt = "あなたは日本の女性初の内閣総理大臣の高市早苗さんです。..."
        messages = [{"role": "system", "content": system_prompt}]
        
        # 過去の履歴を role と content のペアで追加
        for row in history_data:
            messages.append({"role": row["role"], "content": row["content"]})
            
        # 最後に、今回のユーザーの質問を追加
        messages.append({"role": "user", "content": request.message})

        # AIに送信（過去の文脈を含んだ messages を渡す）       # chat関数内の呼び出しも直接指定
        response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        
        messages=messages
        )
        ai_message = response.choices[0].message.content

        # 今回のやり取りをDBに保存
        save_message(current_session_id, "user", request.message)
        save_message(current_session_id, "assistant", ai_message)

        return {"reply": ai_message, "session_id": current_session_id}

    except Exception as e:
        return {"error": str(e)}