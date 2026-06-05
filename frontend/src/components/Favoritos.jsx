// RF08 — Sistema de Favoritos
import CardRegistro from './CardRegistro.jsx';

export default function Favoritos({ registros, onToggleFavorito, onExcluir, onRetry }) {
  const favoritos = registros.filter(r => r.favorito);

  return (
    <div>
      <div className="section-heading">
        <h2 className="section-title">Prioridade<br /><em style={{ color: 'var(--gold-dim)', fontStyle: 'italic' }}>Campo</em></h2>
        {favoritos.length > 0 && (
          <span className="section-count">⭐ {favoritos.length}</span>
        )}
      </div>

      {favoritos.length === 0 ? (
        <div className="empty">
          <span className="empty-icon">⭐</span>
          <p className="empty-title">Sem favoritos ainda</p>
          <p className="empty-sub">
            Marque descobertas como favorito<br />
            para acessá-las rapidamente aqui.
          </p>
        </div>
      ) : (
        <>
          <div style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            padding: '10px 14px',
            marginBottom: 14,
            fontSize: 12,
            color: 'var(--slate)',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>⭐</span>
            <span>
              {favoritos.length} descoberta{favoritos.length > 1 ? 's' : ''} marcada{favoritos.length > 1 ? 's' : ''} como prioritária{favoritos.length > 1 ? 's' : ''}
            </span>
          </div>
          {favoritos.map(r => (
            <CardRegistro
              key={r.id}
              registro={r}
              onToggleFavorito={onToggleFavorito}
              onExcluir={onExcluir}
              onRetry={onRetry}
            />
          ))}
        </>
      )}
    </div>
  );
}
