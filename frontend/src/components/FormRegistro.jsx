// RF01 — Registro de Descoberta | RF02 — Registro Fotográfico | RF05 — Raridade
import { useState, useRef } from 'react';
import { gerarId } from '../db/storage.js';

const CATEGORIAS = [
  { value: 'Botânica',    icon: '🌿', label: 'Botânica' },
  { value: 'Zoologia',   icon: '🦋', label: 'Zoologia' },
  { value: 'Geologia',   icon: '🪨', label: 'Geologia' },
  { value: 'Mineralogia',icon: '💎', label: 'Mineralogia' },
  { value: 'Micologia',  icon: '🍄', label: 'Micologia' },
  { value: 'Hidrologia', icon: '💧', label: 'Hidrologia' },
];

const RARIDADES = [
  { value: 'comum',      icon: '🔵', label: 'Comum' },
  { value: 'rara',       icon: '🟡', label: 'Rara' },
  { value: 'muito-rara', icon: '🔴', label: 'Muito Rara' },
];

export default function FormRegistro({ onSalvar }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [raridade, setRaridade] = useState('');
  const [fotos, setFotos] = useState([]);
  const [erros, setErros] = useState({});
  const fileRef = useRef();

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file || fotos.length >= 3) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFotos(prev => [...prev, ev.target.result]);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removerFoto = (i) => setFotos(prev => prev.filter((_, idx) => idx !== i));

  const validar = () => {
    const e = {};
    if (!titulo.trim()) e.titulo = 'Informe um título';
    if (!descricao.trim()) e.descricao = 'Informe uma descrição';
    if (!categoria) e.categoria = 'Selecione uma categoria';
    if (!raridade) e.raridade = 'Selecione a raridade';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    const novo = {
      id: gerarId(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria,
      raridade,
      timestamp: Date.now(),
      status: 'pendente',
      favorito: false,
      fotos,
    };
    const ok = onSalvar(novo);
    if (ok) {
      setTitulo(''); setDescricao(''); setCategoria('');
      setRaridade(''); setFotos([]); setErros({});
    }
  };

  return (
    <div>
      <div className="section-heading">
        <h2 className="section-title">Nova<br /><em style={{ color: 'var(--gold-dim)', fontStyle: 'italic' }}>Descoberta</em></h2>
      </div>

      <div className="form-card">
        {/* Título */}
        <div className="form-group">
          <label className="form-label form-label-required">Título da Descoberta</label>
          <input
            type="text"
            value={titulo}
            onChange={e => { setTitulo(e.target.value); if (erros.titulo) setErros(p => ({ ...p, titulo: '' })); }}
            placeholder="Ex: Orquídea azul da encosta norte"
            style={erros.titulo ? { borderColor: 'var(--ember)' } : {}}
          />
          {erros.titulo && <p style={{ color: 'var(--ember)', fontSize: 11, marginTop: 4 }}>⚠ {erros.titulo}</p>}
        </div>

        {/* Descrição */}
        <div className="form-group">
          <label className="form-label form-label-required">Descrição Detalhada</label>
          <textarea
            value={descricao}
            onChange={e => { setDescricao(e.target.value); if (erros.descricao) setErros(p => ({ ...p, descricao: '' })); }}
            placeholder="Características observadas, localização exata, comportamento, ambiente..."
            rows={4}
            style={erros.descricao ? { borderColor: 'var(--ember)' } : {}}
          />
          {erros.descricao && <p style={{ color: 'var(--ember)', fontSize: 11, marginTop: 4 }}>⚠ {erros.descricao}</p>}
        </div>

        {/* Categoria */}
        <div className="form-group">
          <label className="form-label form-label-required">Categoria Taxonômica / Geológica</label>
          <select
            value={categoria}
            onChange={e => { setCategoria(e.target.value); if (erros.categoria) setErros(p => ({ ...p, categoria: '' })); }}
            style={erros.categoria ? { borderColor: 'var(--ember)' } : {}}
          >
            <option value="">Selecionar categoria…</option>
            {CATEGORIAS.map(c => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
          {erros.categoria && <p style={{ color: 'var(--ember)', fontSize: 11, marginTop: 4 }}>⚠ {erros.categoria}</p>}
        </div>

        {/* Raridade — RF05 */}
        <div className="form-group">
          <label className="form-label form-label-required">Classificação de Raridade</label>
          <div className="rar-chips">
            {RARIDADES.map(r => (
              <div
                key={r.value}
                className={`rar-chip ${raridade === r.value ? `selected-${r.value}` : ''}`}
                onClick={() => { setRaridade(r.value); setErros(p => ({ ...p, raridade: '' })); }}
              >
                <span className="rar-chip-icon">{r.icon}</span>
                <span className="rar-chip-label">{r.label}</span>
              </div>
            ))}
          </div>
          {erros.raridade && <p style={{ color: 'var(--ember)', fontSize: 11, marginTop: 6 }}>⚠ {erros.raridade}</p>}
        </div>

        {/* Fotos — RF02 */}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Evidências Fotográficas <span style={{ color: 'var(--mist)', textTransform: 'none', letterSpacing: 0 }}>(até 3 fotos)</span></label>
          <div className="foto-area">
            {fotos.map((src, i) => (
              <div key={i} className="foto-thumb-wrap">
                <img src={src} alt={`Foto ${i + 1}`} />
                <button className="foto-rm" onClick={() => removerFoto(i)}>✕</button>
              </div>
            ))}
            {fotos.length < 3 && (
              <div className="foto-add" onClick={() => fileRef.current.click()}>
                <span className="foto-add-icon">📷</span>
                <span className="foto-add-label">Adicionar</span>
              </div>
            )}
          </div>
          {fotos.length > 0 && (
            <p className="foto-hint">{fotos.length}/3 evidência{fotos.length > 1 ? 's' : ''} adicionada{fotos.length > 1 ? 's' : ''}</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={handleFoto}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          💾 Registrar Descoberta
        </button>
      </div>
    </div>
  );
}
