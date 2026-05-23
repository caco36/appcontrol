import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SISTEMA_PROMPT_VALIDADOR = """
Você é o auditor de entregas do AppControl v2.0. Seu papel é comparar o escopo original solicitado pelo cliente com as alegações de entrega feitas pelo agente de IA.

Analise as discrepâncias, validações e retornos.
Você deve retornar ESTRITAMENTE um objeto JSON estruturado da seguinte forma:
{
  "feito_corretamente": ["Lista de requisitos entregues com sucesso e exatamente de acordo com o pedido"],
  "feito_diferente": ["Lista de requisitos que foram implementados mas de forma diferente, parcial ou com desvios do pedido original"],
  "nao_feito": ["Lista de requisitos que foram solicitados mas não foram implementados de forma alguma"],
  "feito_extra": ["Lista de funcionalidades extras, mocks indevidos ou refatorações não autorizadas que a IA realizou sem que fossem pedidas"]
}

Regras:
1. Retorne apenas o JSON limpo. Não adicione markdown como ```json ou qualquer comentário externo.
2. Seja crítico e analítico.
"""

class ValidadorService:
    @staticmethod
    def comparar_escopo(pedido: str, entregue: str) -> dict:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY não configurada no servidor."
            )
        
        try:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SISTEMA_PROMPT_VALIDADOR,
                generation_config={"response_mime_type": "application/json"}
            )
            
            prompt_usuario = (
                f"=== ESCOPO ORIGINAL SOLICITADO ===\n{pedido}\n\n"
                f"=== ALEGAÇÕES DE ENTREGA DA IA ===\n{entregue}"
            )
            
            resposta = model.generate_content(prompt_usuario)
            return json.loads(resposta.text)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao decodificar auditoria de IA: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro na auditoria do Gemini: {str(e)}"
            )
