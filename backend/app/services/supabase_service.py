import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Patch para desativar HTTP/2 nos clientes do Supabase (evita erros de conexão no Windows/HTTP2)
import httpx
from gotrue.http_clients import SyncClient as GotrueSyncClient
from postgrest.utils import SyncClient as PostgrestSyncClient

def gotrue_sync_client_init(self, *args, **kwargs):
    kwargs["http2"] = False
    httpx.Client.__init__(self, *args, **kwargs)

GotrueSyncClient.__init__ = gotrue_sync_client_init

def postgrest_sync_client_init(self, *args, **kwargs):
    kwargs["http2"] = False
    httpx.Client.__init__(self, *args, **kwargs)

PostgrestSyncClient.__init__ = postgrest_sync_client_init

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://placeholder.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "placeholder-service-key")

def get_supabase_client() -> Client:
    """
    Retorna a instância do cliente Supabase configurada com a Service Key.
    """
    return create_client(SUPABASE_URL, SUPABASE_KEY)
