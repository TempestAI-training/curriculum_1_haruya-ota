import os
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv

load_dotenv()

# 環境変数から接続情報を取得
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    """データベース接続を取得する（SSLモードを考慮）"""
    # Azure PostgreSQL等の環境では接続文字列に sslmode=require が含まれている必要があります
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)

def init_db():
    """アプリケーション起動時に必要なテーブルを作成する"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # セッション管理テーブルの作成
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS chat_sessions (
                        id SERIAL PRIMARY KEY,
                        model TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                
                # メッセージ履歴テーブルの作成
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS chat_messages (
                        id SERIAL PRIMARY KEY,
                        session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
                        role TEXT NOT NULL,
                        content TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                conn.commit()
                print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Error during database initialization: {e}")
        # 起動時にエラーが出た場合に詳細を確認できるように例外を再送出します
        raise e

def create_session(model: str) -> int:
    """新しい会話セッションを作成し、そのIDを返す"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO chat_sessions (model) VALUES (%s) RETURNING id",
                (model,)
            )
            result = cur.fetchone()
            conn.commit()
            return result["id"]

def save_message(session_id: int, role: str, content: str):
    """メッセージをDBに保存する"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO chat_messages (session_id, role, content) VALUES (%s, %s, %s)",
                (session_id, role, content)
            )
            conn.commit()

def get_chat_history(session_id: int, limit: int = 10):
    """DBから特定のセッションのメッセージ履歴を取得する"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # サブクエリで最新のメッセージを取得し、それを昇順に並べ直して会話の流れを再現する
            cur.execute(
                """
                SELECT role, content FROM (
                    SELECT role, content, created_at FROM chat_messages 
                    WHERE session_id = %s 
                    ORDER BY created_at DESC 
                    LIMIT %s
                ) AS sub
                ORDER BY created_at ASC
                """,
                (session_id, limit)
            )
            return cur.fetchall()