import { useState, useEffect, useCallback } from 'react';
import { carregarRegistros, salvarRegistros } from './db/storage.js';
import { verificarConexao, sincronizar } from './services/syncService.js';
import Dashboard from './components/Dashboard.jsx';
import FormRegistro from './components/FormRegistro.jsx';
import ListaRegistros from './components/ListaRegistros.jsx';
import Favoritos from './components/Favoritos.jsx';
import './index.css';

const ABAS = [
  { id: 'dashboard', label: 'Painel',     icon: '📊' },
  { id: 'lista',     label: 'Registros',  icon: '📋' },
  { id: 'favoritos', label: 'Favoritos',  icon: '⭐' },
  { id: 'novo',      label: 'Novo',       icon: '➕' },
];

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [aba, setAba] = useState('dashboard');
  const [online, setOnline] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [toast, setToast] = useState('');
  const [toastTimer, setToastTimer] = useState(null);

  // Carrega dados ao iniciar (RF03)
  useEffect(() => { setRegistros(carregarRegistros()); }, []);

  // Persiste dados localmente (RF03)
  useEffect(() => {
    salvarRegistros(registros);
  }, [registros]);

  // Verifica conexão a cada 5s (RF04)
  useEffect(() => {
    const checar = async () => setOnline(await verificarConexao());
    checar();
    const id = setInterval(checar, 5000);
    return () => clearInterval(id);
  }, []);

  const mostrarToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToast(''), 3500);
    setToastTimer(t);
  }, [toastTimer]);

  // RF01 — Salvar nova descoberta
  const handleSalvar = (novoRegistro) => {
    const duplicado = registros.find(
      r => r.titulo.toLowerCase() === novoRegistro.titulo.toLowerCase()
    );
    if (duplicado) {
      mostrarToast('⚠ Já existe um registro com este título.');
      return false;
    }
    setRegistros(prev => [novoRegistro, ...prev]);
    mostrarToast('✅ Descoberta registrada!');
    setAba('lista');
    return true;
  };

  // RF04 — Sincronizar
  const handleSincronizar = useCallback(async () => {
    if (!online) { mostrarToast('📡 Sem conexão com o servidor.'); return; }
    const pendentes = registros.filter(r => r.status === 'pendente');
    if (!pendentes.length) { mostrarToast('Nenhum registro pendente.'); return; }
    setSincronizando(true);
    mostrarToast(`🔄 Sincronizando ${pendentes.length} registro(s)…`);
    const resultado = await sincronizar(registros);
    setRegistros(resultado.registros);
    setSincronizando(false);
    mostrarToast(`✅ ${resultado.sincronizados} sincronizado(s), ${resultado.falhas} falha(s).`);
  }, [online, registros, mostrarToast]);

  // RF08 — Favoritos
  const handleToggleFavorito = (id) => {
    setRegistros(prev => prev.map(r =>
      r.id === id ? { ...r, favorito: !r.favorito } : r
    ));
  };

  const handleExcluir = (id) => {
    setRegistros(prev => prev.filter(r => r.id !== id));
    mostrarToast('🗑 Registro excluído.');
  };

  const handleRetry = (id) => {
    setRegistros(prev => prev.map(r => r.id === id ? { ...r, status: 'pendente' } : r));
    mostrarToast('🔄 Marcado para nova tentativa.');
  };

  const favCount = registros.filter(r => r.favorito).length;

  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <p className="header-eyebrow">Sistema de Campo · v2.0</p>
            <h1 className="header-title">
              Diário de <span className="header-title-em">Bordo</span>
            </h1>
          </div>
          <div className="header-right">
            <div className={`status-badge ${online ? 'online' : 'offline'}`}>
              <span className="status-dot" />
              {online ? 'servidor on' : 'offline'}
            </div>
            <span className="header-date">{dataHoje}</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        {ABAS.map(a => (
          <button
            key={a.id}
            className={`nav-btn ${aba === a.id ? 'active' : ''}`}
            onClick={() => setAba(a.id)}
          >
            <span className="nav-icon">{a.icon}</span>
            <span>{a.label}</span>
            {a.id === 'favoritos' && favCount > 0 && (
              <span className="nav-badge">{favCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Conteúdo */}
      <main className="main" key={aba}>
        {aba === 'dashboard' && (
          <Dashboard
            registros={registros}
            online={online}
            sincronizando={sincronizando}
            onSincronizar={handleSincronizar}
          />
        )}
        {aba === 'lista' && (
          <ListaRegistros
            registros={registros}
            onToggleFavorito={handleToggleFavorito}
            onExcluir={handleExcluir}
            onRetry={handleRetry}
          />
        )}
        {aba === 'favoritos' && (
          <Favoritos
            registros={registros}
            onToggleFavorito={handleToggleFavorito}
            onExcluir={handleExcluir}
            onRetry={handleRetry}
          />
        )}
        {aba === 'novo' && (
          <FormRegistro onSalvar={handleSalvar} />
        )}
      </main>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
