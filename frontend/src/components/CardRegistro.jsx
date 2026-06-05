import { useState } from 'react';

const RAR_LABEL = { comum: 'Comum', rara: 'Rara', 'muito-rara': 'Muito Rara' };
const STATUS_LABEL = { pendente: 'Pendente', sincronizado: 'Sincronizado', falha: 'Falha' };
const STATUS_ICON = { pendente: '⏳', sincronizado: '✓', falha: '⚠' };
const CAT_ICON = {
  'Botânica': '🌿', 'Zoologia': '🦋', 'Geologia': '🪨',
  'Mineralogia': '💎', 'Micologia': '🍄', 'Hidrologia': '💧',
};

export default function CardRegistro({ registro: r, onToggleFavorito, onExcluir, onRetry }) {
  const [lightbox, setLightbox] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const data = new Date(r.timestamp).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  const handleDelete = () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    onExcluir(r.id);
  };

  return (
    <>
      <div className="card">
        <div className="card-top">
          <p className="card-title">{r.titulo}</p>
          <span className={`badge status-${r.status}`} style={{ marginTop: 2 }}>
            {STATUS_ICON[r.status]} {STATUS_LABEL[r.status]}
          </span>
        </div>

        <p className="card-desc">{r.descricao}</p>

        {r.fotos?.length > 0 && (
          <div className="card-fotos">
            {r.fotos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Evidência ${i + 1}`}
                className="card-foto-thumb"
                onClick={() => setLightbox(src)}
              />
            ))}
          </div>
        )}

        <div className="card-meta">
          <span className={`badge rar-${r.raridade}`}>{RAR_LABEL[r.raridade]}</span>
          <span className="badge badge-cat">{CAT_ICON[r.categoria]} {r.categoria}</span>
          {r.favorito && <span className="badge badge-fav">⭐ Favorito</span>}
        </div>

        <p className="card-timestamp">
          <span>{data}</span>
          {r.fotos?.length > 0 && <span>📷 {r.fotos.length} foto{r.fotos.length > 1 ? 's' : ''}</span>}
          <span style={{ color: '#C0C8D4', fontFamily: 'DM Mono, monospace', fontSize: 9 }}>{r.id}</span>
        </p>

        <div className="card-actions">
          <button
            className={`btn-sm ${r.favorito ? 'btn-fav-on' : ''}`}
            onClick={() => onToggleFavorito(r.id)}
          >
            {r.favorito ? '⭐ Favoritado' : '☆ Favoritar'}
          </button>

          {r.status === 'falha' && (
            <button className="btn-sm btn-retry" onClick={() => onRetry(r.id)}>
              🔄 Tentar novamente
            </button>
          )}

          <button
            className={`btn-sm btn-danger`}
            onClick={handleDelete}
            style={confirmDel ? { background: '#FAECE7', fontWeight: 700 } : {}}
          >
            {confirmDel ? '⚠ Confirmar exclusão' : '🗑 Excluir'}
          </button>
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Evidência fotográfica" onClick={e => e.stopPropagation()} />
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </>
  );
}
