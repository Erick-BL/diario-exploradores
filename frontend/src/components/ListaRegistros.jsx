// RF07 — Motor de Busca Local
import { useState, useMemo } from 'react';
import CardRegistro from './CardRegistro.jsx';

const FILTROS = [
  { id: 'todos',        label: 'Todos',        icon: '📋' },
  { id: 'pendente',     label: 'Pendentes',    icon: '⏳' },
  { id: 'sincronizado', label: 'Sincronizados',icon: '✅' },
  { id: 'falha',        label: 'Falhas',       icon: '⚠' },
];

export default function ListaRegistros({ registros, onToggleFavorito, onExcluir, onRetry }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // RF07 — filtragem reativa em tempo real
  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    return registros.filter(r => {
      const matchStatus = filtroStatus === 'todos' || r.status === filtroStatus;
      const matchBusca = !q ||
        r.titulo.toLowerCase().includes(q) ||
        r.descricao.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q);
      return matchStatus && matchBusca;
    });
  }, [registros, busca, filtroStatus]);

  const counts = useMemo(() => ({
    todos:        registros.length,
    pendente:     registros.filter(r => r.status === 'pendente').length,
    sincronizado: registros.filter(r => r.status === 'sincronizado').length,
    falha:        registros.filter(r => r.status === 'falha').length,
  }), [registros]);

  return (
    <div>
      <div className="section-heading">
        <h2 className="section-title">Diário<br /><em style={{ color: 'var(--gold-dim)', fontStyle: 'italic' }}>de Bordo</em></h2>
        <span className="section-count">{filtrados.length} / {registros.length}</span>
      </div>

      {/* Busca */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar título, descrição ou categoria…"
        />
        {busca && (
          <button className="search-clear" onClick={() => setBusca('')}>✕</button>
        )}
      </div>

      {/* Filtros de status */}
      <div className="filter-row">
        {FILTROS.map(f => (
          <button
            key={f.id}
            className={`filter-chip ${filtroStatus === f.id ? 'active' : ''}`}
            onClick={() => setFiltroStatus(f.id)}
          >
            {f.icon} {f.label}
            {counts[f.id] > 0 && <span style={{ opacity: 0.6 }}>({counts[f.id]})</span>}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="empty">
          <span className="empty-icon">{registros.length === 0 ? '🧭' : '📭'}</span>
          <p className="empty-title">
            {registros.length === 0 ? 'Nenhum registro ainda' : 'Nenhum resultado'}
          </p>
          <p className="empty-sub">
            {registros.length === 0
              ? 'Registre sua primeira descoberta\nnna aba "Novo".'
              : 'Tente outros termos de busca\nou remova os filtros.'}
          </p>
        </div>
      ) : (
        filtrados.map(r => (
          <CardRegistro
            key={r.id}
            registro={r}
            onToggleFavorito={onToggleFavorito}
            onExcluir={onExcluir}
            onRetry={onRetry}
          />
        ))
      )}
    </div>
  );
}
