// RF04 — Servidor de Sincronização
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' })); // suporta fotos em base64

// Armazena registros em memória (sem DB para simplicidade)
const registros = new Map();

// RF04 — Sincronização em lote
app.post('/sync', (req, res) => {
  const { itens } = req.body;
  if (!itens || !Array.isArray(itens)) {
    return res.status(400).json({ erro: 'Formato inválido. Esperado: { itens: [...] }' });
  }

  const resultado = itens.map((item) => {
    if (!item.id || !item.titulo) {
      return { id: item.id, status: 'invalido', motivo: 'Campos obrigatórios ausentes' };
    }
    if (registros.has(item.id)) {
      return { id: item.id, status: 'duplicado' };
    }
    registros.set(item.id, { ...item, sincronizadoEm: new Date().toISOString() });
    return { id: item.id, status: 'sincronizado' };
  });

  const sincronizados = resultado.filter(r => r.status === 'sincronizado').length;
  const duplicados = resultado.filter(r => r.status === 'duplicado').length;

  console.log(`[SYNC] ${sincronizados} sincronizados, ${duplicados} duplicados — total: ${registros.size}`);
  res.json({ resultado, total: registros.size });
});

// Listar todos os registros sincronizados
app.get('/registros', (req, res) => {
  res.json(Array.from(registros.values()));
});

// Health check / status de conexão
app.get('/status', (req, res) => {
  res.json({
    online: true,
    total: registros.size,
    servidor: 'Diário de Bordo API',
    versao: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🧭 Servidor Diário de Bordo rodando`);
  console.log(`   http://localhost:${PORT}/status\n`);
});
