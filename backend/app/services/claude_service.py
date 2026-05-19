import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "placeholder-api-key")

def get_anthropic_client() -> Anthropic:
    """
    Retorna a instância do cliente da Anthropic API.
    """
    return Anthropic(api_key=ANTHROPIC_API_KEY)

# O System Prompt fixo do Extrator (Etapa 3) será estruturado aqui nas próximas etapas.
