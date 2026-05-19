from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client
from app.models.schemas import ProjetoCreate, ProjetoUpdate, FaseUpdate
from typing import List, Dict, Any

class ProjetosService:
    @staticmethod
    def listar_projetos(usuario_id: str) -> List[Dict[str, Any]]:
        """
        Retorna todos os projetos do usuário logado, calculando o progresso médio e contagem de sessões.
        """
        supabase = get_supabase_client()
        try:
            # Busca projetos do usuário
            projetos_res = supabase.table("projetos").select("*").eq("usuario_id", usuario_id).order("criado_em", desc=True).execute()
            projetos = projetos_res.data

            if not projetos:
                return []

            projeto_ids = [p["id"] for p in projetos]

            # Busca fases para calcular progresso
            fases_res = supabase.table("fases").select("*").in_("projeto_id", projeto_ids).execute()
            fases = fases_res.data

            # Busca sessões para contagem
            sessoes_res = supabase.table("sessoes").select("id, projeto_id").in_("projeto_id", projeto_ids).execute()
            sessoes = sessoes_res.data

            # Agrupa fases por projeto
            fases_por_projeto = {}
            for f in fases:
                pid = f["projeto_id"]
                if pid not in fases_por_projeto:
                    fases_por_projeto[pid] = []
                fases_por_projeto[pid].append(f)

            # Agrupa sessões por projeto
            sessoes_por_projeto = {}
            for s in sessoes:
                pid = s["projeto_id"]
                sessoes_por_projeto[pid] = sessoes_por_projeto.get(pid, 0) + 1

            # Monta o resultado final enriquecido
            resultado = []
            for p in projetos:
                pid = p["id"]
                pfases = fases_por_projeto.get(pid, [])
                progresso = 0
                if pfases:
                    progresso = sum(f.get("percentual", 0) for f in pfases) // len(pfases)

                p["progresso"] = progresso
                p["sessoes_count"] = sessoes_por_projeto.get(pid, 0)
                resultado.append(p)

            return resultado
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao listar projetos: {str(e)}"
            )

    @staticmethod
    def criar_projeto(usuario_id: str, dados: ProjetoCreate) -> Dict[str, Any]:
        """
        Cria um novo projeto e gera automaticamente as 6 fases padrão do roadmap.
        """
        supabase = get_supabase_client()
        try:
            projeto_data = dados.model_dump()
            projeto_data["usuario_id"] = usuario_id

            # Insere o projeto
            res = supabase.table("projetos").insert(projeto_data).execute()
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Falha ao criar projeto no banco de dados."
                )

            novo_projeto = res.data[0]
            projeto_id = novo_projeto["id"]

            # Cria as 6 fases padrão
            fases_padrao = [
                {"projeto_id": projeto_id, "nome": "1. Fundação e Estrutura", "ordem": 0, "percentual": 0},
                {"projeto_id": projeto_id, "nome": "2. Autenticação e Segurança", "ordem": 1, "percentual": 0},
                {"projeto_id": projeto_id, "nome": "3. Gestão de Projetos e Hub", "ordem": 2, "percentual": 0},
                {"projeto_id": projeto_id, "nome": "4. Módulo Extrator e IA", "ordem": 3, "percentual": 0},
                {"projeto_id": projeto_id, "nome": "5. Prompts, Checklists e Roteiros", "ordem": 4, "percentual": 0},
                {"projeto_id": projeto_id, "nome": "6. Histórico, Erros e Exportação", "ordem": 5, "percentual": 0}
            ]
            supabase.table("fases").insert(fases_padrao).execute()

            novo_projeto["progresso"] = 0
            novo_projeto["sessoes_count"] = 0
            return novo_projeto
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao criar projeto: {str(e)}"
            )

    @staticmethod
    def atualizar_projeto(usuario_id: str, projeto_id: str, dados: ProjetoUpdate) -> Dict[str, Any]:
        """
        Atualiza os campos de configuração de um projeto existente.
        """
        supabase = get_supabase_client()
        try:
            # Verifica permissão no projeto
            res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res_proj.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado ou acesso não autorizado.")

            update_data = {k: v for k, v in dados.model_dump(exclude_unset=True).items() if v is not None}
            if not update_data:
                return ProjetosService.obter_projeto(usuario_id, projeto_id)

            res = supabase.table("projetos").update(update_data).eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res.data:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Falha ao atualizar projeto no banco de dados.")

            return ProjetosService.obter_projeto(usuario_id, projeto_id)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao atualizar projeto: {str(e)}"
            )

    @staticmethod
    def obter_projeto(usuario_id: str, projeto_id: str) -> Dict[str, Any]:
        """
        Retorna os detalhes de um projeto específico, incluindo suas fases e sessões.
        """
        supabase = get_supabase_client()
        try:
            res = supabase.table("projetos").select("*").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Projeto não encontrado ou acesso não autorizado."
                )

            projeto = res.data[0]

            # Busca fases
            fases_res = supabase.table("fases").select("*").eq("projeto_id", projeto_id).order("ordem").execute()
            fases = fases_res.data

            # Busca sessões
            sessoes_res = supabase.table("sessoes").select("*").eq("projeto_id", projeto_id).order("data", desc=True).execute()
            sessoes = sessoes_res.data

            # Busca erros
            erros_res = supabase.table("erros").select("*").eq("projeto_id", projeto_id).order("data", desc=True).execute()
            erros = erros_res.data

            progresso = 0
            if fases:
                progresso = sum(f.get("percentual", 0) for f in fases) // len(fases)

            projeto["fases"] = fases
            projeto["sessoes"] = sessoes
            projeto["erros"] = erros
            projeto["progresso"] = progresso
            projeto["sessoes_count"] = len(sessoes)

            return projeto
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao buscar detalhes do projeto: {str(e)}"
            )

    @staticmethod
    def listar_fases(usuario_id: str, projeto_id: str) -> List[Dict[str, Any]]:
        """
        Retorna as fases de um projeto específico.
        """
        supabase = get_supabase_client()
        try:
            # Verifica permissão no projeto
            res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res_proj.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado.")

            fases_res = supabase.table("fases").select("*").eq("projeto_id", projeto_id).order("ordem").execute()
            return fases_res.data
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao listar fases: {str(e)}"
            )

    @staticmethod
    def atualizar_fases(usuario_id: str, projeto_id: str, dados: FaseUpdate) -> Dict[str, Any]:
        """
        Atualiza o percentual de múltiplas fases em lote.
        """
        supabase = get_supabase_client()
        try:
            # Verifica permissão no projeto
            res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res_proj.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado.")

            for f in dados.fases:
                fase_id = f.get("id")
                percentual = f.get("percentual")
                if fase_id and percentual is not None:
                    supabase.table("fases").update({"percentual": percentual}).eq("id", fase_id).eq("projeto_id", projeto_id).execute()

            return {"status": "sucesso", "mensagem": "Fases atualizadas com sucesso."}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao atualizar fases: {str(e)}"
            )

    @staticmethod
    def atualizar_fase_unica(usuario_id: str, projeto_id: str, fase_id: str, percentual: int) -> Dict[str, Any]:
        """
        Atualiza o percentual de uma única fase.
        """
        supabase = get_supabase_client()
        try:
            # Verifica permissão no projeto
            res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res_proj.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado.")

            supabase.table("fases").update({"percentual": percentual}).eq("id", fase_id).eq("projeto_id", projeto_id).execute()

            return {"status": "sucesso", "mensagem": "Fase atualizada com sucesso."}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao atualizar fase: {str(e)}"
            )
