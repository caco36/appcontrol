import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://placeholder.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "placeholder-service-key")

def get_supabase_client() -> Client:
    """
    Retorna a instância do cliente Supabase configurada com a Service Key.
    """
    return create_client(SUPABASE_URL, SUPABASE_KEY)
