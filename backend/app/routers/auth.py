from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from app.models.schemas import LoginInput, CadastroInput, UsuarioResponse
from app.services.auth_service import AuthService
from typing import Dict, Any

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

def get_token_from_header(authorization: str = Header(None, alias="Authorization"), token: str = Depends(oauth2_scheme)) -> str:
    """
    Extrai o token JWT do header Authorization (Bearer token).
    """
    if token:
        return token
    if authorization and authorization.startswith("Bearer "):
        return authorization.split(" ")[1]
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token de autenticação ausente."
    )

@router.post("/login", summary="Realizar Login")
async def login(dados: LoginInput) -> Dict[str, Any]:
    """
    Autentica um usuário com email e senha e retorna o token de acesso e dados do usuário.
    """
    return AuthService.login(dados)

@router.post("/cadastro", summary="Cadastrar Usuário", status_code=status.HTTP_201_CREATED)
async def cadastro(dados: CadastroInput) -> Dict[str, Any]:
    """
    Cria uma nova conta de usuário no Supabase Auth e na tabela pública.
    """
    return AuthService.cadastro(dados)

@router.post("/logout", summary="Realizar Logout")
async def logout(token: str = Depends(get_token_from_header)) -> Dict[str, Any]:
    """
    Invalida a sessão do usuário no backend.
    """
    return AuthService.logout(token)

@router.get("/me", summary="Obter Usuário Logado", response_model=UsuarioResponse)
async def get_me(token: str = Depends(get_token_from_header)):
    """
    Retorna os dados do usuário atualmente autenticado com base no token JWT.
    """
    return AuthService.get_current_user(token)
