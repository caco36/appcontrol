from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.services.validador_service import ValidadorService
from app.routers.projetos import get_current_usuario_id

router = APIRouter()

class ComparacaoInput(BaseModel):
    projeto_id: str
    pedido: str = Field(..., min_length=5)
    entregue: str = Field(..., min_length=5)

@router.post("/comparar", summary="Comparar Pedido vs Entregue")
async def comparar_pedido_entregue(
    dados: ComparacaoInput, 
    usuario_id: str = Depends(get_current_usuario_id)
) -> dict:
    """
    Compara o escopo pedido com o que foi entregue pela IA.
    """
    return ValidadorService.comparar_escopo(dados.pedido, dados.entregue)
