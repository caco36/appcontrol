export const formatarSlug = (texto: string): string => {
  return texto
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

export const gerarNomeArquivo = (tipo: string, projeto: string, extensao: string): string => {
  const now = new Date();
  
  // Formata dia, mês e ano em dois dígitos cada (DDMMAA)
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = String(now.getFullYear()).slice(-2);
  const dataStr = `${dia}${mes}${ano}`;
  
  // Formata hora e minutos em dois dígitos (HHMM)
  const hora = String(now.getHours()).padStart(2, '0');
  const minutos = String(now.getMinutes()).padStart(2, '0');
  const horaStr = `${hora}${minutos}`;
  
  const projetoSlug = formatarSlug(projeto);
  const tipoSlug = formatarSlug(tipo);
  
  return `${tipoSlug}_${projetoSlug}_${dataStr}_${horaStr}.${extensao}`;
};

export const formatarCabecalho = (tipo: string, nomeProjeto: string, nomeArquivo: string): string => {
  const now = new Date();
  
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = String(now.getFullYear()).slice(-2);
  
  const hora = String(now.getHours()).padStart(2, '0');
  const minutos = String(now.getMinutes()).padStart(2, '0');
  
  return `# ${tipo.toUpperCase()} — ${nomeProjeto}\nData: ${dia}/${mes}/${ano}\nHora: ${hora}:${minutos}\nArquivo: ${nomeArquivo}\n========================================\n\n`;
};

export const downloadMarkdown = (tipo: string, nomeProjeto: string, conteudo: string) => {
  const nomeArquivo = gerarNomeArquivo(tipo, nomeProjeto, 'md');
  const cabecalho = formatarCabecalho(tipo, nomeProjeto, nomeArquivo);
  
  // Se o conteúdo já começa com o cabeçalho gerado anteriormente, não duplicamos
  let conteudoFinal = conteudo;
  if (!conteudo.trim().startsWith(`# ${tipo.toUpperCase()} —`)) {
    conteudoFinal = cabecalho + conteudo;
  }
  
  const blob = new Blob([conteudoFinal], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
