import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SISTEMA_PROMPT_SUGESTAO_REGRA = """
Você é o engenheiro especialista em Guard Prompts do AppControl v2.0. Seu papel é analisar o log de um erro ocorrido no desenvolvimento de um projeto e sugerir UMA regra corretiva concisa (máximo 25 palavras) para ser adicionada às Regras Especiais / Guard Prompt do projeto.

A regra sugerida deve:
- Impedir que a IA cometa esse mesmo erro no futuro.
- Ser direta, clara e imperativa.
- Começar com um hífen e um espaço, ex: "- [Instrução]"

Retorne ESTRITAMENTE um objeto JSON contendo a regra sugerida:
{
  "regra_sugerida": "- [Sua regra aqui]"
}
Do NOT wrap the output in ```json markdown or add text outside the JSON.
"""

class ErrosAprendidosService:
    @staticmethod
    def analisar_erro_e_sugerir_regra(usuario_id: str, erro_id: str) -> dict:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY não configurada no servidor."
            )
            
        supabase = get_supabase_client()
        
        # 1. Carrega o erro
        res_erro = supabase.table("erros").select("*").eq("id", erro_id).execute()
        if not res_erro.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Erro não encontrado.")
            
        erro = res_erro.data[0]
        projeto_id = erro["projeto_id"]
        
        # 2. Valida propriedade do projeto
        res_proj = supabase.table("projetos").select("id").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
        if not res_proj.data:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso não autorizado ao projeto.")
            
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SISTEMA_PROMPT_SUGESTAO_REGRA,
                generation_config={"response_mime_type": "application/json"}
            )
            
            prompt_usuario = (
                f"=== LOG DE ERRO ===\n"
                f"Tipo: {erro.get('tipo')}\n"
                f"Arquivo: {erro.get('arquivo') or 'Não especificado'}\n"
                f"Descrição: {erro.get('descricao')}\n"
                f"Solução Tentada: {erro.get('solucao') or 'Nenhuma'}"
            )
            
            resposta = model.generate_content(prompt_usuario)
            dados = json.loads(resposta.text)
            return {
                "erro_id": erro_id,
                "projeto_id": projeto_id,
                "regra_sugerida": dados.get("regra_sugerida", "- Evitar o padrão de erro ocorrido.")
            }
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Falha ao processar sugestão do Gemini: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao sugerir regra com Gemini: {str(e)}"
            )

    @staticmethod
    def aplicar_regra(usuario_id: str, projeto_id: str, regra: str) -> dict:
        supabase = get_supabase_client()
        
        # 1. Valida propriedade do projeto e lê regras atuais
        res_proj = supabase.table("projetos").select("id, regras_especiais").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
        if not res_proj.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Projeto não encontrado ou acesso não autorizado.")
            
        projeto = res_proj.data[0]
        regras_atuais = projeto.get("regras_especiais") or ""
        
        # Se a regra já existir, não repete
        if regra.strip() in regras_atuais:
            return {"status": "ignorada", "mensagem": "A regra já existe nas configurações especiais do projeto.", "regras_especiais": regras_atuais}
            
        # Adiciona a nova regra
        novas_regras = regras_atuais.strip()
        if novas_regras:
            novas_regras += f"\n{regra.strip()}"
        else:
            novas_regras = regra.strip()
            
        # Atualiza o banco de dados
        supabase.table("projetos").update({"regras_especiais": novas_regras}).eq("id", projeto_id).execute()
        
        return {
            "status": "sucesso",
            "mensagem": "Regra aplicada com sucesso ao Guard Prompt!",
            "regras_especiais": novas_regras
        }
