// RF04 — Lógica de Sincronização com detecção de rede

const SERVIDOR = 'http://localhost:3001';

export async function verificarConexao() {
  try {
    const res = await fetch(`${SERVIDOR}/status`, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sincronizar(registros) {
  const pendentes = registros.filter((r) => r.status === 'pendente');
  if (!pendentes.length) return { sincronizados: 0, falhas: 0, registros };

  let sincronizados = 0;
  let falhas = 0;

  try {
    const res = await fetch(`${SERVIDOR}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itens: pendentes }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error('Servidor retornou erro');

    const data = await res.json();

    const atualizados = registros.map((r) => {
      const resultado = data.resultado.find((x) => x.id === r.id);
      if (!resultado) return r;
      if (resultado.status === 'sincronizado' || resultado.status === 'duplicado') {
        sincronizados++;
        return { ...r, status: 'sincronizado' };
      }
      falhas++;
      return { ...r, status: 'falha' };
    });

    return { sincronizados, falhas, registros: atualizados };
  } catch {
    const atualizados = registros.map((r) =>
      r.status === 'pendente' ? { ...r, status: 'falha' } : r
    );
    falhas = pendentes.length;
    return { sincronizados, falhas, registros: atualizados };
  }
}
