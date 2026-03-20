import os 
import psycopg
from psycopg.rows import dict_row
import time

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    while True:
        try:
            conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
            return conn
        except Exception as e:
            print(f"データベース接続エラー: {e}. 再試行します...")
            time.sleep(5)  # 5秒待ってから再試行

def create_chat_session(model):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO chat_sessions (model) VALUES (%s) RETURNING id",
                (model,)
            )
            session_id = cur.fetchone()["id"]
            return session_id
        
def save_message(session_id, role, content):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO chat_messages (session_id, role, content) VALUES (%s, %s, %s)",
                (session_id, role, content)
            )
            conn.commit()
            
def get_chat_history(session_id, limit=10):
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