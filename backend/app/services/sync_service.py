import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client
from app.utils.nomenclatura import gerar_nome_arquivo, formatar_cabecalho

# Configura o Gemini usando a mesma chave do dotenv
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SISTEMA_PROMPT_SYNC = """
Você é o analisador de sincronização e auditor técnico do AppControl v2.0. Seu objetivo é analisar não apenas os relatórios textuais do agente (walkthrough.md e task.md), mas cruzar essas alegações com a ÁRVORE DE CÓDIGO FÍSICO real do projeto.

Estime um percentual de conclusão (de 0 a 100) para cada uma das 6 fases padrão do roadmap:
- Fase 0 (1. Fundação e Estrutura)
- Fase 1 (2. Autenticação e Segurança)
- Fase 2 (3. Gestão de Projetos e Hub)
- Fase 3 (4. Módulo Extrator e IA)
- Fase 4 (5. Prompts, Checklists e Roteiros)
- Fase 5 (6. Histórico, Erros e Exportação)

REGRA DE AUDITORIA CRÍTICA:
Se a árvore de código físico mostrar a existência de arquivos que correspondem a uma fase (ex: arquivos de autenticação em store/auth.ts ou backend de auth), você DEVE dar a pontuação elevada (90 a 100%) para a fase correspondente, MESMO QUE o walkthrough.md não mencione explicitamente essa etapa. A evidência física do código vale mais que o relato em texto.

Você DEVE retornar ESTRITAMENTE um objeto JSON que siga a seguinte estrutura exata:
{
  "status_geral": "sucesso" | "parcial" | "pendente",
  "resumo": "Um resumo conciso de 1 ou 2 parágrafos sobre o status atual do projeto, baseando-se no cruzamento dos logs de texto e dos arquivos físicos detectados.",
  "fases_progresso": [
    {"ordem": 0, "percentual": 100},
    {"ordem": 1, "percentual": 80},
    {"ordem": 2, "percentual": 50},
    {"ordem": 3, "percentual": 10},
    {"ordem": 4, "percentual": 0},
    {"ordem": 5, "percentual": 0}
  ],
  "o_que_foi_feito": ["tarefa 1 feita", "tarefa 2 feita"],
  "o_que_nao_foi_feito": ["tarefa 3 pendente", "tarefa 4 pendente"],
  "erros_identificados": ["erro 1 se aplicável"],
  "proximos_passos": ["próximo passo 1", "próximo passo 2"]
}

Regras:
1. O JSON retornado não deve conter markdown adicional, blocos ```json ou explicações fora do JSON.
2. Certifique-se de incluir todas as 6 fases (ordem de 0 a 5) em fases_progresso.
3. Se uma lista estiver vazia, retorne um array vazio [].
"""

class SyncService:
    @staticmethod
    def ler_arquivo(caminho: str) -> str:
        if not os.path.exists(caminho):
            return ""
        try:
            with open(caminho, "r", encoding="utf-8") as f:
                return f.read()
        except Exception:
            return ""

    @staticmethod
    def gerar_arvore_codigo() -> str:
        # Tenta achar a raiz do projeto procurando a pasta 'backend'
        caminho_atual = os.path.abspath(__file__)
        raiz = os.path.dirname(caminho_atual)
        for _ in range(5):
            if os.path.exists(os.path.join(raiz, "backend")):
                break
            raiz = os.path.dirname(raiz)
        
        if not os.path.exists(os.path.join(raiz, "backend")):
            return "Árvore de código físico não disponível no momento."

        pastas_ignoradas = {'node_modules', '.git', '.venv', '__pycache__', 'dist', 'build', '.next'}
        arvore = []
        
        for root, dirs, files in os.walk(raiz):
            dirs[:] = [d for d in dirs if d not in pastas_ignoradas]
            level = root.replace(raiz, '').count(os.sep)
            # Limita a profundidade para não estourar tokens da IA
            if level > 4:
                continue
            indent = ' ' * 4 * level
            folder_name = os.path.basename(root)
            if folder_name and folder_name not in pastas_ignoradas:
                arvore.append(f"{indent}[{folder_name}/]")
            
            subindent = ' ' * 4 * (level + 1)
            for f in files:
                if f.endswith(('.py', '.ts', '.tsx', '.json', '.md')):
                    arvore.append(f"{subindent}{f}")
                    
        return "\n".join(arvore)

    @staticmethod
    def sincronizar(usuario_id: str, projeto_id: str) -> dict:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY não configurada no servidor."
            )

        # 1. Conectar ao Supabase e buscar o projeto
        supabase = get_supabase_client()
        res_proj = supabase.table("projetos").select("*").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
        if not res_proj.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado ou acesso não autorizado."
            )
        
        projeto = res_proj.data[0]
        projeto_nome = projeto.get("nome", "projeto")
        caminho_base = projeto.get("antigravity_path")
        
        if not caminho_base:
            caminho_base = r"C:\Users\hazim\.gemini\antigravity\brain\5ad0e187-e028-499c-ac37-5a230a6c4586"
        
        caminho_base = os.path.expandvars(os.path.expanduser(caminho_base))
        walkthrough_path = os.path.join(caminho_base, "walkthrough.md")
        task_path = os.path.join(caminho_base, "task.md")

        # 2. Ler arquivos de log
        walkthrough_content = SyncService.ler_arquivo(walkthrough_path)
        task_content = SyncService.ler_arquivo(task_path)
        
        # 3. Gerar a Árvore de Código Físico (O novo Scanner)
        arvore_codigo_fisico = SyncService.gerar_arvore_codigo()

        if not walkthrough_content and not task_content and "não disponível" in arvore_codigo_fisico:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Não foi possível ler os logs nem a árvore de código."
            )

        # 4. Enviar dados cruzados ao Gemini
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SISTEMA_PROMPT_SYNC,
                generation_config={"response_mime_type": "application/json"}
            )

            prompt_usuario = (
                f"=== CONTEÚDO DO WALKTHROUGH.MD ===\n{walkthrough_content or 'Vazio'}\n\n"
                f"=== CONTEÚDO DO TASK.MD ===\n{task_content or 'Vazio'}\n\n"
                f"=== ÁRVORE DE CÓDIGO FÍSICO DO PROJETO ===\n{arvore_codigo_fisico}"
            )

            resposta = model.generate_content(prompt_usuario)
            texto_json = resposta.text
            dados_analise = json.loads(texto_json)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Falha ao processar o JSON retornado pelo Gemini: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro na comunicação com a API do Google Gemini: {str(e)}"
            )

        # 5. Atualizar percentuais no banco
        try:
            fases_res = supabase.table("fases").select("id, ordem").eq("projeto_id", projeto_id).execute()
            mapa_fases = {f["ordem"]: f["id"] for f in fases_res.data}

            for fase_prog in dados_analise.get("fases_progresso", []):
                ordem = fase_prog.get("ordem")
                percentual = fase_prog.get("percentual", 0)
                if ordem in mapa_fases:
                    supabase.table("fases").update({"percentual": percentual}).eq("id", mapa_fases[ordem]).execute()
        except Exception as e:
            print(f"Erro ao atualizar fases: {e}")

        # 6. Salvar Sessão
        try:
            sessao_data = {
                "projeto_id": projeto_id,
                "status": dados_analise.get("status_geral", "parcial"),
                "resumo": dados_analise.get("resumo", ""),
                "o_que_foi_feito": dados_analise.get("o_que_foi_feito", []),
                "o_que_nao_foi_feito": dados_analise.get("o_que_nao_foi_feito", []),
                "alertas": dados_analise.get("erros_identificados", []),
                "riscos": [],
                "proximos_passos": dados_analise.get("proximos_passos", []),
                "fonte": "antigravity"
            }
            res_sessao = supabase.table("sessoes").insert(sessao_data).execute()
            
            sessao_id = res_sessao.data[0]["id"] if res_sessao.data else None
            erros = dados_analise.get("erros_identificados", [])
            if erros and sessao_id:
                for err in erros:
                    supabase.table("erros").insert({
                        "projeto_id": projeto_id,
                        "sessao_id": sessao_id,
                        "tipo": "Sincronização Antigravity",
                        "descricao": err,
                        "solucao": "Análise de auditoria contínua."
                    }).execute()
        except Exception as e:
            print(f"Erro ao salvar sessão: {e}")

        # 7. Gerar Relatório
        nome_arquivo = gerar_nome_arquivo("relatorio", projeto_nome, "md")
        status_geral = dados_analise.get("status_geral", "parcial")
        resumo = dados_analise.get("resumo", "")
        
        def formatar_lista(lista):
            return "\n".join(f"- {item}" for item in lista) + "\n" if lista else "- Nenhum item relatado.\n"

        corpo_markdown = (
            f"## Status Geral do Projeto: {status_geral.upper()}\n\n"
            f"### Resumo Executivo\n{resumo}\n\n"
            f"### O Que Foi Feito\n{formatar_lista(dados_analise.get('o_que_foi_feito', []))}\n"
            f"### O Que Está Pendente\n{formatar_lista(dados_analise.get('o_que_nao_foi_feito', []))}\n"
            f"### Erros Identificados\n{formatar_lista(dados_analise.get('erros_identificados', []))}\n"
            f"### Próximos Passos\n{formatar_lista(dados_analise.get('proximos_passos', []))}"
        )
        
        cabecalho = formatar_cabecalho("Relatório de Sincronização", projeto_nome, nome_arquivo)
        dados_analise["nome_arquivo"] = nome_arquivo
        dados_analise["relatorio_markdown"] = cabecalho + corpo_markdown

        return dados_analise
