from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.models.schemas import ExtratorInput, ExtratorOutput
from app.services.extrator_service import ExtratorService
from app.services.auth_service import AuthService
from app.routers.auth import get_token_from_header

router = APIRouter()

class SalvarSessaoInput(BaseModel):
    projeto_id: str = Field(..., description="ID do projeto")
    analise: ExtratorOutput = Field(..., description="Objeto de análise completo retornado pelo Gemini")

class RegistrarErrosInput(BaseModel):
    projeto_id: str = Field(..., description="ID do projeto")
    sessao_id: Optional[str] = Field(None, description="ID opcional da sessão associada")
    erros: List[str] = Field(..., description="Lista de descrições de erros")

async def get_current_usuario_id(token: str = Depends(get_token_from_header)) -> str:
    usuario = AuthService.get_current_user(token)
    return str(usuario.id)

@router.post("/analisar", summary="Analisar Resposta da IA", response_model=ExtratorOutput)
async def analisar_resposta(dados: ExtratorInput, usuario_id: str = Depends(get_current_usuario_id)):
    """
    Processa a resposta bruta da IA utilizando o Google Gemini e retorna a estrutura JSON padronizada.
    """
    return ExtratorService.analisar(dados)

@router.post("/salvar-sessao", summary="Salvar Análise como Sessão")
async def salvar_sessao(dados: SalvarSessaoInput, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Converte o resultado do Extrator em uma nova sessão no histórico do projeto.
    """
    return ExtratorService.salvar_sessao(usuario_id, dados.projeto_id, dados.analise)

@router.post("/registrar-erros", summary="Registrar Erros da Análise")
async def registrar_erros(dados: RegistrarErrosInput, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Cadastra os erros identificados pela IA no log de erros do projeto.
    """
    return ExtratorService.registrar_erros(usuario_id, dados.projeto_id, dados.sessao_id, dados.erros)
