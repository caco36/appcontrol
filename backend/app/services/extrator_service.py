from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client
from app.services.gemini_service import GeminiService
from app.models.schemas import ExtratorInput, ExtratorOutput
from typing import List, Dict, Any, Optional

class ExtratorService:
    @staticmethod
    def analisar(dados: ExtratorInput) -> ExtratorOutput:
        """
        Envia a resposta bruta para o Gemini e valida o retorno contra o schema ExtratorOutput.
        """
        resultado_dict = GeminiService.analisar_resposta(dados.resposta_ia, dados.contexto)
        try:
            # Valida e converte para o Pydantic model
            return ExtratorOutput(**resultado_dict)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao validar a estrutura de saída do Extrator: {str(e)}"
            )

    @staticmethod
    def salvar_sessao(usuario_id: str, projeto_id: str, analise: ExtratorOutput) -> Dict[str, Any]:
        """
        Salva o resultado da análise como uma nova sessão no Supabase.
        """
        supabase = get_supabase_client()
        try:
            # Verifica permissão no projeto
            res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res_proj.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado ou acesso negado.")

            dados_sessao = {
                "projeto_id": projeto_id,
                "status": analise.status if analise.status in ["sucesso", "parcial", "falhou"] else "sucesso",
                "resumo": analise.resumo,
                "arquivos_tocados": analise.arquivos_tocados,
                "arquivos_nao_tocados": analise.arquivos_nao_tocados,
                "o_que_foi_feito": analise.o_que_foi_feito,
                "o_que_nao_foi_feito": analise.o_que_nao_foi_feito,
                "alertas": analise.alertas,
                "riscos": analise.riscos,
                "proximos_passos": analise.proximos_passos,
                "fonte": "extrator"
            }

            res = supabase.table("sessoes").insert(dados_sessao).execute()
            if not res.data:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Falha ao salvar sessão no banco de dados.")

            return res.data[0]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao salvar sessão: {str(e)}"
            )

    @staticmethod
    def registrar_erros(usuario_id: str, projeto_id: str, sessao_id: Optional[str], erros: List[str]) -> Dict[str, Any]:
        """
        Registra múltiplos erros identificados na análise na tabela de erros.
        """
        supabase = get_supabase_client()
        try:
            # Verifica permissão no projeto
            res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
            if not res_proj.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado ou acesso negado.")

            if not erros:
                return {"status": "sucesso", "mensagem": "Nenhum erro para registrar."}

            registros = []
            for erro_desc in erros:
                registros.append({
                    "projeto_id": projeto_id,
                    "sessao_id": sessao_id if sessao_id else None,
                    "tipo": "Extrator IA",
                    "descricao": erro_desc,
                    "arquivo": "Múltiplos / IA",
                    "solucao": "Pendente de análise manual"
                })

            supabase.table("erros").insert(registros).execute()

            return {"status": "sucesso", "mensagem": f"{len(erros)} erros registrados com sucesso."}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao registrar erros: {str(e)}"
            )
