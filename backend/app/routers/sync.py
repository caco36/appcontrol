from fastapi import APIRouter, Depends, Query
from app.services.sync_service import SyncService
from app.routers.projetos import get_current_usuario_id

router = APIRouter()

@router.get("/antigravity", summary="Sincronizar com Antigravity")
async def sincronizar_antigravity(
    projeto_id: str = Query(..., description="ID do projeto a ser sincronizado"),
    usuario_id: str = Depends(get_current_usuario_id)
):
    """
    Sincroniza o progresso do projeto com os arquivos walkthrough.md e task.md do Antigravity.
    Realiza a leitura local, análise no Gemini, atualização das fases e salva uma sessão.
    """
    return SyncService.sincronizar(usuario_id, projeto_id)
