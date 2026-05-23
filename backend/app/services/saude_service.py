import os
import re
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.services.supabase_service import get_supabase_client

class SaudeService:
    @staticmethod
    def ler_proxima_tarefa(antigravity_path: str) -> str:
        """Lê o arquivo task.md e extrai a primeira tarefa pendente (- [ ])."""
        if not antigravity_path:
            return "Nenhuma tarefa configurada"
        
        caminho_base = os.path.expandvars(os.path.expanduser(antigravity_path))
        task_path = os.path.join(caminho_base, "task.md")
        if not os.path.exists(task_path):
            return "Arquivo task.md não encontrado"
        
        try:
            with open(task_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Regex para encontrar itens - [ ] ou * [ ]
            pendentes = re.findall(r'(?:-|\*)\s*\[\s*\]\s*(.+)', content)
            if pendentes:
                return pendentes[0].strip()
            return "Nenhuma tarefa pendente no task.md"
        except Exception:
            return "Não foi possível ler as tarefas"

    @staticmethod
    def calcular_saude_projeto(usuario_id: str, projeto_id: str) -> dict:
        supabase = get_supabase_client()
        
        # 1. Carrega dados do projeto
        res_proj = supabase.table("projetos").select("*").eq("id", projeto_id).eq("usuario_id", usuario_id).execute()
        if not res_proj.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto não encontrado ou acesso não autorizado."
            )
        projeto = res_proj.data[0]
        
        # 2. Carrega fases do projeto
        res_fases = supabase.table("fases").select("*").eq("projeto_id", projeto_id).execute()
        fases = res_fases.data or []
        progresso_geral = sum(f.get("percentual", 0) for f in fases) // len(fases) if fases else 0
        
        # 3. Carrega erros ativos
        res_erros = supabase.table("erros").select("*").eq("projeto_id", projeto_id).execute()
        erros = res_erros.data or []
        erros_ativos_count = len(erros)
        
        # 4. Carrega sessões recentes
        res_sessoes = supabase.table("sessoes").select("*").eq("projeto_id", projeto_id).order("data", desc=True).limit(5).execute()
        sessoes = res_sessoes.data or []
        
        # 5. Identificação automática de alertas de risco
        alertas_ativos = []
        
        # Alerta: Mesma alteração repetitiva (mesmo arquivo tocado 3x seguidas)
        if len(sessoes) >= 3:
            arqs_s1 = set(sessoes[0].get("arquivos_tocados", []))
            arqs_s2 = set(sessoes[1].get("arquivos_tocados", []))
            arqs_s3 = set(sessoes[2].get("arquivos_tocados", []))
            comum = arqs_s1.intersection(arqs_s2).intersection(arqs_s3)
            if comum:
                alertas_ativos.append(f"ALERTA: O(s) arquivo(s) {', '.join(comum)} foram alterados consecutivamente nas últimas 3 sessões (Loop de Edição?).")
        
        # Alerta: Mesmo tipo de erro repetido
        if len(erros) >= 2:
            tipos_erros = [e.get("tipo") for e in erros if e.get("tipo")]
            for t in set(tipos_erros):
                if tipos_erros.count(t) >= 2:
                    alertas_ativos.append(f"ALERTA: O erro do tipo '{t}' repetiu-se {tipos_erros.count(t)} vezes (Instabilidade Crítica).")
        
        # Alerta: Sessão sem reporte há mais de 2 dias
        data_ultima_sessao = None
        dias_sem_sessao = 999
        if sessoes:
            # Parse data
            try:
                # Exemplo: 2026-05-19T22:36:15+00:00 ou similar
                data_str = sessoes[0].get("data")
                if data_str:
                    # Remove timezone offsets to parse easily
                    clean_date_str = re.sub(r'[\+\-]\d{2}:?\d{2}$', '', data_str)
                    clean_date_str = clean_date_str.split('.')[0] # Remove microsegundos
                    dt = datetime.strptime(clean_date_str, "%Y-%m-%dT%H:%M:%S")
                    dias_sem_sessao = (datetime.now() - dt).days
                    data_ultima_sessao = dt.strftime("%d/%m/%Y %H:%M")
            except Exception as ex:
                print("Erro ao parsear data de sessão:", ex)
        
        if dias_sem_sessao >= 2:
            alertas_ativos.append(f"LEMBRETE: Nenhuma sincronização realizada há {dias_sem_sessao} dia(s).")
            
        # 6. Cálculo do nível de risco
        nivel_risco = "BAIXO"
        if erros_ativos_count >= 3 or any("Loop de Edição" in a or "Instabilidade Crítica" in a for a in alertas_ativos) or dias_sem_sessao >= 5:
            nivel_risco = "ALTO"
        elif erros_ativos_count >= 1 or dias_sem_sessao >= 2:
            nivel_risco = "MÉDIO"
            
        # 7. Score de confiança da IA (0 a 100)
        score = 100
        # Deduz por erros na história
        score -= (erros_ativos_count * 10)
        # Deduz por risco
        if nivel_risco == "ALTO":
            score -= 20
        elif nivel_risco == "MÉDIO":
            score -= 10
            
        # Recompensa por sessões bem sucedidas nas últimas 5
        sucessos_recentes = sum(1 for s in sessoes if s.get("status") == "sucesso")
        score += (sucessos_recentes * 4)
        
        # Limita limites
        score = max(10, min(100, score))
        
        # Categoria de confiança
        categoria_confianca = "Confiável"
        if score < 50:
            categoria_confianca = "Perigoso"
        elif score < 80:
            categoria_confianca = "Instável"
            
        # 8. Próxima tarefa pendente
        antigravity_path = projeto.get("antigravity_path")
        proxima_tarefa = SaudeService.ler_proxima_tarefa(antigravity_path)
        
        return {
            "projeto_id": projeto_id,
            "projeto_nome": projeto.get("nome"),
            "progresso_geral": progresso_geral,
            "erros_ativos": erros_ativos_count,
            "data_ultima_sessao": data_ultima_sessao or "Nunca sincronizado",
            "proxima_tarefa": proxima_tarefa,
            "nivel_risco": nivel_risco,
            "alertas_ativos": alertas_ativos,
            "score_confianca": score,
            "categoria_confianca": categoria_confianca
        }
