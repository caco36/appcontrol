import re
from datetime import datetime

def formatar_slug(texto: str) -> str:
    """Remove caracteres especiais e espaços de um texto para usar em nomes de arquivos."""
    texto = texto.lower()
    # Substitui espaços e caracteres especiais por hífens
    texto = re.sub(r'[\s_]+', '-', texto)
    texto = re.sub(r'[^\w\-]', '', texto)
    return texto

def gerar_nome_arquivo(tipo: str, projeto: str, extensao: str) -> str:
    """
    Gera nome no padrão: [tipo]_[projeto]_[DDMMAA]_[HHMM].[ext]
    Exemplo: sessao_editor-alfa-v10_190526_2236.md
    """
    now = datetime.now()
    data_str = now.strftime("%d%m%y")
    hora_str = now.strftime("%H%M")
    projeto_slug = formatar_slug(projeto)
    tipo_slug = formatar_slug(tipo)
    
    return f"{tipo_slug}_{projeto_slug}_{data_str}_{hora_str}.{extensao}"

def formatar_cabecalho(tipo: str, nome_projeto: str, nome_arquivo: str) -> str:
    """
    Gera o cabeçalho obrigatório:
    # [TIPO] — [Nome do Projeto]
    Data: DD/MM/AA
    Hora: HH:MM
    Arquivo: [nome-completo]
    """
    now = datetime.now()
    data_ext = now.strftime("%d/%m/%y")
    hora_ext = now.strftime("%H:%M")
    
    cabecalho = (
        f"# {tipo.upper()} — {nome_projeto}\n"
        f"Data: {data_ext}\n"
        f"Hora: {hora_ext}\n"
        f"Arquivo: {nome_arquivo}\n"
        f"{'='*40}\n\n"
    )
    return cabecalho
