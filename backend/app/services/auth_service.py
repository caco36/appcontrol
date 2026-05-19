from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client
from app.models.schemas import LoginInput, CadastroInput, UsuarioResponse
from pydantic import EmailStr

class AuthService:
    @staticmethod
    def login(dados: LoginInput):
        """
        Realiza a autenticação do usuário utilizando o Supabase Auth.
        """
        supabase = get_supabase_client()
        try:
            resposta = supabase.auth.sign_in_with_password({
                "email": dados.email,
                "password": dados.senha
            })
            
            user = resposta.user
            session = resposta.session
            
            if not user or not session:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciais inválidas"
                )
                
            nome = user.user_metadata.get("nome", "") if user.user_metadata else ""
            
            return {
                "token": session.access_token,
                "usuario": UsuarioResponse(
                    id=user.id,
                    email=user.email,
                    nome=nome
                ).model_dump()
            }
        except Exception as e:
            # Captura erros específicos do Supabase (ex: AuthApiError)
            erro_msg = str(e)
            if "Invalid login credentials" in erro_msg or "invalid" in erro_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Email ou senha incorretos."
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro ao realizar login: {erro_msg}"
            )

    @staticmethod
    def cadastro(dados: CadastroInput):
        """
        Realiza o cadastro de um novo usuário no Supabase Auth e garante a criação na tabela de usuários.
        """
        supabase = get_supabase_client()
        try:
            # 1. Cria o usuário no Supabase Auth com metadados
            resposta = supabase.auth.sign_up({
                "email": dados.email,
                "password": dados.senha,
                "options": {
                    "data": {
                        "nome": dados.nome
                    }
                }
            })
            
            user = resposta.user
            session = resposta.session
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Não foi possível criar o usuário. Verifique se o email já está cadastrado."
                )
            
            # 2. Insere/Garante o registro na tabela pública 'usuarios'
            try:
                supabase.table("usuarios").upsert({
                    "id": user.id,
                    "email": user.email,
                    "nome": dados.nome
                }).execute()
            except Exception as db_err:
                # Loga o erro mas não impede o fluxo se o trigger do Supabase já tiver criado
                print(f"Aviso ao sincronizar tabela usuarios: {db_err}")

            nome = user.user_metadata.get("nome", dados.nome) if user.user_metadata else dados.nome

            return {
                "token": session.access_token if session else None,
                "usuario": UsuarioResponse(
                    id=user.id,
                    email=user.email,
                    nome=nome
                ).model_dump()
            }
        except HTTPException:
            raise
        except Exception as e:
            erro_msg = str(e)
            if "already registered" in erro_msg.lower() or "already exists" in erro_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Este email já está cadastrado em nosso sistema."
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro ao realizar cadastro: {erro_msg}"
            )

    @staticmethod
    def logout(token: str):
        """
        Realiza o logout invalidando a sessão no Supabase Auth.
        """
        supabase = get_supabase_client()
        try:
            # O Supabase client requer o token de autorização no header para deslogar a sessão correta
            supabase.auth.sign_out(jwt=token)
            return {"status": "sucesso", "mensagem": "Logout realizado com sucesso."}
        except Exception as e:
            # Mesmo que falhe no servidor (ex: token já expirado), confirmamos o logout para o cliente limpar localmente
            return {"status": "sucesso", "mensagem": "Sessão encerrada."}

    @staticmethod
    def get_current_user(token: str) -> UsuarioResponse:
        """
        Valida o token JWT no Supabase Auth e retorna os dados do usuário logado.
        """
        supabase = get_supabase_client()
        try:
            resposta = supabase.auth.get_user(token)
            user = resposta.user
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Sessão inválida ou expirada."
                )
            
            nome = user.user_metadata.get("nome", "") if user.user_metadata else ""
            
            return UsuarioResponse(
                id=user.id,
                email=user.email,
                nome=nome
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de autenticação inválido ou expirado."
            )
