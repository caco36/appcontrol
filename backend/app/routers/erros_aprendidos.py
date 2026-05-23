from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.erros_aprendidos_service import ErrosAprendidosService
from app.routers.projetos import get_current_usuario_id

router = APIRouter()

class AnalisarErroInput(BaseModel):
    erro_id: str

class AplicarRegraInput(BaseModel):
    projeto_id: str
    regra: str

@router.post("/analisar", summary="Analisar Erro e Sugerir Regra")
async def analisar_erro(
    dados: AnalisarErroInput,
    usuario_id: str = Depends(get_current_usuario_id)
) -> dict:
    return ErrosAprendidosService.analisar_erro_e_sugerir_regra(usuario_id, dados.erro_id)

@router.post("/aplicar-regra", summary="Aplicar Regra de Erro Aprendido")
async def aplicar_regra(
    dados: AplicarRegraInput,
    usuario_id: str = Depends(get_current_usuario_id)
) -> dict:
    return ErrosAprendidosService.aplicar_regra(usuario_id, dados.projeto_id, dados.regra)
