// RF03 — Persistência Local Autônoma (localStorage)

const CHAVE = 'diario_exploradores_v2';

export function carregarRegistros() {
  try {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  } catch (e) {
    console.error('Erro ao carregar registros:', e);
    return [];
  }
}

export function salvarRegistros(registros) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(registros));
  } catch (e) {
    console.error('Erro ao salvar registros:', e);
  }
}

export function gerarId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `EXP-${ts}-${rnd}`;
}
