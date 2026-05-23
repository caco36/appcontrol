import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client
from app.utils.nomenclatura import gerar_nome_arquivo, formatar_cabecalho

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SISTEMA_PROMPT_BRIEFING = """
Você é o consolidador de briefings do AppControl v2.0. Seu objetivo é pegar todos os metadados de um projeto (fases, erros, sessões, regras, stacks) e gerar um documento de briefing em Markdown extremamente completo e premium para ser lido por uma nova IA que assumirá o desenvolvimento do projeto.

O documento gerado deve ser claro, bem estruturado, focar nos detalhes técnicos, no estado atual do roadmap, nas regras cruciais de segurança (Guard Prompt) e nos próximos passos práticos.

Regras de Saída:
1. Retorne APENAS o corpo do Markdown do briefing em formato limpo. Não adicione tags de bloco de código ```markdown.
2. Seja detalhado, profissional e completo. Não oculte informações cruciais.
"""

class BriefingService:
    @staticmethod
    def gerar_briefing(usuario_id: str, projeto_id: str) -> dict:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY não configurada no servidor."
            )
            
        supabase = get_supabase_client()
        
        # 1. Carrega dados do projeto
        res_proj = supabase.table("projetos").select("*").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
        if not res_proj.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado ou acesso não autorizado.")
            
        projeto = res_proj.data[0]
        projeto_nome = projeto.get("nome", "projeto")
        
        # 2. Carrega fases
        fases_res = supabase.table("fases").select("*").eq("projeto_id", projeto_id).order("ordem").execute()
        fases = fases_res.data or []
        
        # 3. Carrega sessões
        sessoes_res = supabase.table("sessoes").select("*").eq("projeto_id", projeto_id).order("data", desc=True).limit(5).execute()
        sessoes = sessoes_res.data or []
        
        # 4. Carrega erros
        erros_res = supabase.table("erros").select("*").eq("projeto_id", projeto_id).execute()
        erros = erros_res.data or []
        
        # 5. Formatar dados brutos de entrada para a IA
        fases_str = "\n".join([f"- {f.get('nome')}: {f.get('percentual')}% concluído" for f in fases])
        
        sessoes_str = ""
        for s in sessoes:
            sessoes_str += (
                f"- Data: {s.get('data')}\n"
                f"  Status: {s.get('status')}\n"
                f"  Resumo: {s.get('resumo')}\n"
                f"  Arquivos Tocados: {', '.join(s.get('arquivos_tocados', []))}\n\n"
            )
            
        erros_str = "\n".join([f"- {e.get('tipo')}: {e.get('descricao')} (Solução sugerida: {e.get('solucao') or 'nenhuma'})" for e in erros])
        
        # 6. Gerar briefing com o Gemini
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SISTEMA_PROMPT_BRIEFING
            )
            
            prompt_usuario = (
                f"=== INFORMAÇÕES GERAIS ===\n"
                f"Nome: {projeto_nome}\n"
                f"Tipo: {projeto.get('tipo')}\n"
                f"Stack FE: {projeto.get('stack_fe') or 'não definida'}\n"
                f"Stack BE: {projeto.get('stack_be') or 'não definida'}\n"
                f"LLM Base: {projeto.get('llm_base') or 'não definido'}\n"
                f"Caminho Antigravity: {projeto.get('antigravity_path') or 'não definido'}\n\n"
                f"=== ARQUIVOS CRÍTICOS (PROIBIDO DELETAR/ALTERAR SEM PERMISSÃO) ===\n"
                f"{', '.join(projeto.get('arquivos_criticos', [])) or 'Nenhum'}\n\n"
                f"=== REGRAS ESPECIAIS / GUARD PROMPT ===\n"
                f"{projeto.get('regras_especiais') or 'Nenhuma'}\n\n"
                f"=== ESTADO ATUAL DO ROADMAP ===\n"
                f"{fases_str or 'Sem fases cadastradas.'}\n\n"
                f"=== ÚLTIMAS SESSÕES DE DESENVOLVIMENTO ===\n"
                f"{sessoes_str or 'Nenhuma sessão cadastrada.'}\n\n"
                f"=== LOG DE ERROS EM ABERTO ===\n"
                f"{erros_str or 'Sem erros em aberto.'}"
            )
            
            resposta = model.generate_content(prompt_usuario)
            briefing_markdown = resposta.text
            
            # Aplica nomenclatura e cabeçalho padrão
            nome_arquivo = gerar_nome_arquivo("briefing", projeto_nome, "md")
            cabecalho = formatar_cabecalho("Briefing de Contexto para Nova IA", projeto_nome, nome_arquivo)
            
            return {
                "nome_arquivo": nome_arquivo,
                "briefing_markdown": cabecalho + briefing_markdown
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao gerar briefing com Gemini: {str(e)}"
            )
