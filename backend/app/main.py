from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, projetos, extrator

app = FastAPI(
    title="AppControl v1.0 API",
    description="API de gerenciamento do ciclo de desenvolvimento de aplicativos com IA",
    version="1.0.0"
)

import os

cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,https://appcontrol-six.vercel.app,https://appcontrol.vercel.app")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

# Configuração de CORS para permitir requisições do Frontend React (Local e Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro dos roteadores modulares
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(projetos.router, prefix="/api/projetos", tags=["Projetos"])
app.include_router(extrator.router, prefix="/api/extrator", tags=["Extrator IA"])

@app.get("/health", summary="Verificação de Saúde da API")
async def health_check():
    """
    Endpoint de verificação de status do backend.
    """
    return {"status": "ok"}
