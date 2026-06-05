// RF06 — Dashboard Analítico
const CATEGORIAS = ['Botânica', 'Zoologia', 'Geologia', 'Mineralogia', 'Micologia', 'Hidrologia'];
const CAT_ICON = {
  'Botânica': '🌿', 'Zoologia': '🦋', 'Geologia': '🪨',
  'Mineralogia': '💎', 'Micologia': '🍄', 'Hidrologia': '💧',
};
const CAT_COLOR = {
  'Botânica': '#2E6B4F', 'Zoologia': '#4A3DA0', 'Geologia': '#7A5710',
  'Mineralogia': '#1B5EA8', 'Micologia': '#8B3A8B', 'Hidrologia': '#1A6080',
};

export default function Dashboard({ registros, online, sincronizando, onSincronizar }) {
  const total = registros.length;
  const sincronizados = registros.filter(r => r.status === 'sincronizado').length;
  const pendentes = registros.filter(r => r.status === 'pendente').length;
  const falhas = registros.filter(r => r.status === 'falha').length;
  const pctSync = total ? Math.round((sincronizados / total) * 100) : 0;
  const favoritos = registros.filter(r => r.favorito).length;

  const porCategoria = CATEGORIAS
    .map(cat => ({ cat, qtd: registros.filter(r => r.categoria === cat).length }))
    .filter(x => x.qtd > 0)
    .sort((a, b) => b.qtd - a.qtd);

  const raridades = [
    { key: 'comum',      label: 'Comum',      icon: '🔵', cor: '#1B5EA8' },
    { key: 'rara',       label: 'Rara',        icon: '🟡', cor: '#D97706' },
    { key: 'muito-rara', label: 'Muito Rara',  icon: '🔴', cor: '#C04A1A' },
  ].map(r => ({ ...r, qtd: registros.filter(x => x.raridade === r.key).length }));

  return (
    <div>
      <div className="section-heading">
        <h2 className="section-title">Painel<br /><em style={{ color: 'var(--gold-dim)', fontStyle: 'italic' }}>de Campo</em></h2>
        <span className="section-count">
          {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </span>
      </div>

      {/* Métricas */}
      <div className="metric-grid">
        <div className="metric metric-total">
          <div className="metric-icon">🗂️</div>
          <p className="metric-label">Total</p>
          <p className="metric-val">{total}</p>
        </div>
        <div className="metric metric-sync">
          <div className="metric-icon">✅</div>
          <p className="metric-label">Sincronizados</p>
          <p className="metric-val" style={{ color: 'var(--moss)' }}>{sincronizados}</p>
        </div>
        <div className="metric metric-pend">
          <div className="metric-icon">⏳</div>
          <p className="metric-label">Pendentes</p>
          <p className="metric-val" style={{ color: '#D97706' }}>{pendentes}</p>
        </div>
        <div className="metric metric-fail">
          <div className="metric-icon">⭐</div>
          <p className="metric-label">Favoritos</p>
          <p className="metric-val" style={{ color: 'var(--plum)' }}>{favoritos}</p>
        </div>
      </div>

      {/* Sincronização */}
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-label">Sincronização</span>
          <span className="progress-pct">{pctSync}%</span>
        </div>
        <p className="progress-sub">
          {sincronizados} de {total} registro{total !== 1 ? 's' : ''} enviado{total !== 1 ? 's' : ''}
          {falhas > 0 && ` · ${falhas} falha${falhas > 1 ? 's' : ''}`}
        </p>
        <div className="bar-track" style={{ marginBottom: 14 }}>
          <div className="bar-fill" style={{ width: pctSync + '%', background: 'var(--moss)' }} />
        </div>
        <button
          className="btn-sync"
          onClick={onSincronizar}
          disabled={sincronizando || !online}
        >
          {sincronizando ? '⏳ Sincronizando…' : online ? '🔄 Sincronizar agora' : '📡 Sem conexão'}
        </button>
        {!online && (
          <p style={{ fontSize: 11, color: '#D97706', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>
            Sem servidor — os dados estão salvos localmente
          </p>
        )}
      </div>

      {/* Por categoria */}
      {porCategoria.length > 0 && (
        <div className="cat-section">
          <p className="cat-section-title">Por categoria</p>
          {porCategoria.map(({ cat, qtd }) => (
            <div key={cat} className="cat-row">
              <div className="cat-row-top">
                <span className="cat-row-name">
                  {CAT_ICON[cat]} {cat}
                </span>
                <span className="cat-row-count">{qtd} · {Math.round(qtd / total * 100)}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill"
                  style={{ width: Math.round(qtd / total * 100) + '%', background: CAT_COLOR[cat] }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Por raridade */}
      <div className="cat-section">
        <p className="cat-section-title">Por raridade</p>
        {raridades.map(({ key, label, icon, cor, qtd }) => (
          <div key={key} className="cat-row">
            <div className="cat-row-top">
              <span className="cat-row-name">{icon} {label}</span>
              <span className="cat-row-count">{qtd} · {total ? Math.round(qtd / total * 100) : 0}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill"
                style={{ width: (total ? Math.round(qtd / total * 100) : 0) + '%', background: cor }} />
            </div>
          </div>
        ))}
      </div>

      {total === 0 && (
        <div className="empty">
          <span className="empty-icon">🧭</span>
          <p className="empty-title">Expedição aguardando</p>
          <p className="empty-sub">Registre sua primeira descoberta<br />para ver as análises aqui.</p>
        </div>
      )}
    </div>
  );
}
