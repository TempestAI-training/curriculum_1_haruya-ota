import os
import psycopg
from psycopg.rows import dict_row

def get_db_connection():
    # Docker環境の環境変数 DATABASE_URL を使用
    return psycopg.connect(os.getenv("DATABASE_URL"), row_factory=dict_row)

def save_message(session_id: int, role: str, content: str):
    """メッセージをDBに保存する関数"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO chat_messages (session_id, role, content) VALUES (%s, %s, %s)",
                (session_id, role, content)
            )

def create_session(model: str) -> int:
    """新しい会話セッションを作成し、そのIDを返す関数"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO chat_sessions (model) VALUES (%s) RETURNING id",
                (model,)
            )
            return cur.fetchone()["id"]
        
def get_chat_history(session_id: int, limit: int = 10):
    """DBから最新のメッセージ履歴を取得する"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
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