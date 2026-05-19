from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.models.schemas import ProjetoCreate, ProjetoUpdate, FaseUpdate
from app.services.projetos_service import ProjetosService
from app.services.auth_service import AuthService
from app.routers.auth import get_token_from_header
from typing import List, Dict, Any

router = APIRouter()

class FasePercentualUpdate(BaseModel):
    percentual: int = Field(ge=0, le=100, description="Percentual de conclusão da fase (0 a 100)")

async def get_current_usuario_id(token: str = Depends(get_token_from_header)) -> str:
    """
    Dependência para validar o token JWT e extrair o ID do usuário autenticado.
    """
    usuario = AuthService.get_current_user(token)
    return str(usuario.id)

@router.get("", summary="Listar Projetos")
async def listar_projetos(usuario_id: str = Depends(get_current_usuario_id)) -> List[Dict[str, Any]]:
    """
    Retorna a lista de projetos do usuário autenticado, enriquecida com progresso e contagem de sessões.
    """
    return ProjetosService.listar_projetos(usuario_id)

@router.post("", summary="Criar Projeto", status_code=status.HTTP_201_CREATED)
async def criar_projeto(dados: ProjetoCreate, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Cria um novo projeto e gera automaticamente as 6 fases padrão do roadmap.
    """
    return ProjetosService.criar_projeto(usuario_id, dados)

@router.get("/{id}", summary="Obter Detalhes do Projeto")
async def obter_projeto(id: str, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Retorna os dados completos de um projeto (incluindo fases e sessões).
    """
    return ProjetosService.obter_projeto(usuario_id, id)

@router.put("/{id}", summary="Atualizar Configurações do Projeto")
async def atualizar_projeto(id: str, dados: ProjetoUpdate, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Atualiza as configurações (stacks, LLM, arquivos críticos, regras especiais) de um projeto.
    """
    return ProjetosService.atualizar_projeto(usuario_id, id, dados)

@router.get("/{id}/fases", summary="Listar Fases do Projeto")
async def listar_fases(id: str, usuario_id: str = Depends(get_current_usuario_id)) -> List[Dict[str, Any]]:
    """
    Retorna as fases de roadmap de um projeto.
    """
    return ProjetosService.listar_fases(usuario_id, id)

@router.put("/{id}/fases", summary="Atualizar Fases em Lote")
async def atualizar_fases(id: str, dados: FaseUpdate, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Atualiza o percentual de múltiplas fases simultaneamente.
    """
    return ProjetosService.atualizar_fases(usuario_id, id, dados)

@router.put("/{id}/fases/{fase_id}", summary="Atualizar Fase Única")
async def atualizar_fase(id: str, fase_id: str, dados: FasePercentualUpdate, usuario_id: str = Depends(get_current_usuario_id)) -> Dict[str, Any]:
    """
    Atualiza o percentual de uma única fase específica.
    """
    return ProjetosService.atualizar_fase_unica(usuario_id, id, fase_id, dados.percentual)
