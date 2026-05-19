from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from typing import Optional, List, Dict, Any

# --- Modelos de Autenticação (Etapa 1) ---

class LoginInput(BaseModel):
    email: EmailStr
    senha: str

class CadastroInput(BaseModel):
    nome: str
    email: EmailStr
    senha: str = Field(min_length=6)

class UsuarioResponse(BaseModel):
    id: UUID
    email: str
    nome: str

# --- Modelos de Projetos (Etapa 2) ---

class ProjetoCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=100)
    tipo: str
    stack_fe: Optional[str] = None
    stack_be: Optional[str] = None
    llm_base: Optional[str] = None
    arquivos_criticos: List[str] = []
    regras_especiais: Optional[str] = None

class ProjetoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=100)
    tipo: Optional[str] = None
    stack_fe: Optional[str] = None
    stack_be: Optional[str] = None
    llm_base: Optional[str] = None
    arquivos_criticos: Optional[List[str]] = None
    regras_especiais: Optional[str] = None

class FaseUpdate(BaseModel):
    fases: List[Dict[str, Any]]  # Espera lista de objetos contendo {id, percentual}

# --- Modelos do Extrator (Etapa 3) ---

class ExtratorInput(BaseModel):
    resposta_ia: str = Field(min_length=10)
    contexto: Optional[str] = None
    projeto_id: Optional[UUID] = None

class ExtratorOutput(BaseModel):
    status: str  # 'sucesso', 'parcial', 'falhou', 'indefinido'
    resumo: str
    arquivos_tocados: List[str]
    arquivos_nao_tocados: List[str]
    o_que_foi_feito: List[str]
    o_que_nao_foi_feito: List[str]
    erros_identificados: List[str]
    riscos: List[str]
    arquivos_criticos_mencionados: List[str]
    limpeza_feita: List[str]
    proximos_passos: List[str]
    alertas: List[str]
