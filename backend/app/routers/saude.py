from fastapi import APIRouter, Depends, HTTPException
from app.services.saude_service import SaudeService
from app.services.projetos_service import ProjetosService
from app.routers.projetos import get_current_usuario_id

router = APIRouter()

@router.get("/projeto/{id}", summary="Obter Saúde do Projeto")
async def obter_saude_projeto(
    id: str, 
    usuario_id: str = Depends(get_current_usuario_id)
) -> dict:
    """
    Retorna os detalhes de saúde de um projeto específico.
    """
    return SaudeService.calcular_saude_projeto(usuario_id, id)

@router.get("/dashboard", summary="Obter Painel Geral de Saúde")
async def obter_painel_saude_geral(
    usuario_id: str = Depends(get_current_usuario_id)
) -> dict:
    """
    Retorna a saúde geral de todos os projetos do usuário, acumulando métricas e alertas de risco.
    """
    projetos = ProjetosService.listar_projetos(usuario_id)
    if not projetos:
        return {
            "nivel_risco_geral": "BAIXO",
            "score_medio_confianca": 100,
            "total_erros_ativos": 0,
            "total_alertas_ativos": 0,
            "alertas_globais": []
        }
        
    resultado_projetos = []
    total_erros = 0
    total_alertas = 0
    soma_scores = 0
    alertas_globais = []
    
    for p in projetos:
        try:
            saude = SaudeService.calcular_saude_projeto(usuario_id, p["id"])
            resultado_projetos.append(saude)
            total_erros += saude["erros_ativos"]
            total_alertas += len(saude["alertas_ativos"])
            soma_scores += saude["score_confianca"]
            for a in saude["alertas_ativos"]:
                alertas_globais.append({
                    "projeto_id": p["id"],
                    "projeto_nome": p["nome"],
                    "alerta": a
                })
        except Exception:
            continue
            
    score_medio = soma_scores // len(resultado_projetos) if resultado_projetos else 100
    
    nivel_geral = "BAIXO"
    if any(saude["nivel_risco"] == "ALTO" for saude in resultado_projetos):
        nivel_geral = "ALTO"
    elif any(saude["nivel_risco"] == "MÉDIO" for saude in resultado_projetos):
        nivel_geral = "MÉDIO"
        
    return {
        "nivel_risco_geral": nivel_geral,
        "score_medio_confianca": score_medio,
        "total_erros_ativos": total_erros,
        "total_alertas_ativos": total_alertas,
        "alertas_globais": alertas_globais,
        "detalhes_projetos": resultado_projetos
    }
