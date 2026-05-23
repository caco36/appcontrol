from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.briefing_service import BriefingService
from app.routers.projetos import get_current_usuario_id

router = APIRouter()

@router.get("/gerar", summary="Gerar Briefing Completo do Projeto")
async def gerar_briefing_projeto(
    projeto_id: str = Query(...),
    usuario_id: str = Depends(get_current_usuario_id)
) -> dict:
    """
    Gera um relatório consolidado de briefing em Markdown contendo o contexto completo do projeto.
    """
    return BriefingService.gerar_briefing(usuario_id, projeto_id)
