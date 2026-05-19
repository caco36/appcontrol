import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Prompt do Sistema para impor o JSON schema exato do ExtratorOutput
SISTEMA_PROMPT = """
Você é o analisador de auditoria do AppControl v1.0. Seu objetivo é analisar a resposta bruta de uma Inteligência Artificial (LLM) fornecida pelo desenvolvedor, e extrair de forma precisa todas as ações, modificações, riscos e pendências identificadas.

Você DEVE retornar ESTRITAMENTE um objeto JSON que siga a seguinte estrutura exata:
{
  "status": "sucesso" | "parcial" | "falhou" | "indefinido",
  "resumo": "Resumo claro e conciso de tudo que foi tratado na resposta da IA",
  "arquivos_tocados": ["lista", "de", "arquivos", "modificados ou criados"],
  "arquivos_nao_tocados": ["lista", "de", "arquivos", "mencionados mas não alterados"],
  "o_que_foi_feito": ["lista", "de", "tarefas", "concluídas"],
  "o_que_nao_foi_feito": ["lista", "de", "tarefas", "pendentes ou ignoradas"],
  "erros_identificados": ["lista", "de", "erros", "ou bugs mencionados na resposta"],
  "riscos": ["lista", "de", "riscos", "arquiteturais ou técnicos"],
  "arquivos_criticos_mencionados": ["lista", "de", "arquivos", "críticos do projeto que foram citados"],
  "limpeza_feita": ["lista", "de", "ações", "de refatoração ou remoção de código morto"],
  "proximos_passos": ["lista", "de", "próximas", "tarefas sugeridas"],
  "alertas": ["lista", "de", "alertas", "importantes para o desenvolvedor"]
}

Regras:
1. O JSON retornado não deve conter markdown adicional, blocos ```json ou explicações fora do JSON.
2. Se uma lista estiver vazia, retorne um array vazio [].
3. O campo status deve refletir o sucesso geral da resposta analisada.
"""

class GeminiService:
    @staticmethod
    def analisar_resposta(resposta_ia: str, contexto: str = None) -> dict:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY não configurada no servidor."
            )
            
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SISTEMA_PROMPT,
                generation_config={"response_mime_type": "application/json"}
            )
            
            prompt_usuario = f"Resposta da IA a ser analisada:\n{resposta_ia}\n\nContexto fornecido pelo desenvolvedor:\n{contexto or 'Nenhum contexto adicional fornecido.'}"
            
            resposta = model.generate_content(prompt_usuario)
            texto_json = resposta.text
            
            # Realiza o parse para garantir que é um JSON válido
            dados_json = json.loads(texto_json)
            return dados_json
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
