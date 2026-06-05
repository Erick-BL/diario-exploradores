# 🧭 Diário de Bordo de Exploradores

**Sistema PWA offline-first para registro de descobertas científicas em campo.**  
Desenvolvido para operar em ilhas remotas sem internet — 100% funcional sem conexão.

---

## ✅ Conformidade com Requisitos (PDF)

| ID | Requisito | Implementação | Status |
|----|-----------|---------------|--------|
| RF01 | Registro de Descoberta | Formulário com título, descrição, categoria e timestamp automático | ✅ |
| RF02 | Registro Fotográfico | Câmera nativa via `capture="environment"`, até 3 fotos por registro | ✅ |
| RF03 | Operação Offline | 100% offline via `localStorage` — busca, listagem, cadastro e armazenamento sem rede | ✅ |
| RF04 | Lógica de Sincronização | Polling a cada 5s, transmissão em lote via POST `/sync`, reconciliação de status | ✅ |
| RF05 | Classificação de Raridade | Seleção visual (chips) com 3 níveis: Comum · Rara · Muito Rara | ✅ |
| RF06 | Dashboard Analítico | Métricas: total, sincronizados, pendentes, favoritos + barras por categoria e raridade | ✅ |
| RF07 | Motor de Busca Local | Filtragem reativa em título, descrição e categoria + filtro por status | ✅ |
| RF08 | Sistema de Favoritos | Toggle favorito em cada card + aba dedicada com contador no nav | ✅ |

---

## 🚀 Como Executar no VS Code

### Pré-requisitos
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **VS Code** com terminal integrado

---

### Terminal 1 — Backend (Sincronização)

```bash
cd backend
npm install
npm start
```

✓ Servidor em: `http://localhost:3001`  
✓ Health check: `http://localhost:3001/status`

---

### Terminal 2 — Frontend (App)

Abra um **segundo terminal** no VS Code (`Ctrl+Shift+\``):

```bash
cd frontend
npm install
npm run dev
```

✓ App em: `http://localhost:5173`

---

### Testar no Celular (PWA)

1. Descubra seu IP local:
   - **Windows:** `ipconfig` → "Endereço IPv4"
   - **Mac/Linux:** `ifconfig` ou `ip a`

2. Edite `frontend/src/services/syncService.js`:
   ```js
   // Troque:
   const SERVIDOR = 'http://localhost:3001';
   // Por:
   const SERVIDOR = 'http://SEU_IP:3001';
   ```

3. Acesse no celular: `http://SEU_IP:5173`

4. **Instalar como PWA:**
   - Chrome Android: Menu (⋮) → "Adicionar à tela inicial"
   - Safari iOS: Compartilhar → "Adicionar à Tela de Início"

---

## 🏗️ Arquitetura

```
diario-exploradores/
├── backend/
│   ├── server.js          # Express — RF04 (sincronização em lote)
│   └── package.json
└── frontend/
    ├── public/            # Ícones PWA
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx       # RF06 — métricas e gráficos
    │   │   ├── FormRegistro.jsx    # RF01/RF02/RF05 — cadastro completo
    │   │   ├── ListaRegistros.jsx  # RF07 — busca reativa + filtros
    │   │   ├── Favoritos.jsx       # RF08 — aba de favoritos
    │   │   └── CardRegistro.jsx    # Card com lightbox + confirmação de exclusão
    │   ├── db/
    │   │   └── storage.js          # RF03 — localStorage
    │   ├── services/
    │   │   └── syncService.js      # RF04 — sincronização
    │   ├── App.jsx                 # Orquestrador de estado global
    │   └── index.css               # Design system completo
    ├── index.html
    ├── vite.config.js              # PWA + Service Worker + cache de fontes
    └── package.json
```

---

## 🔄 Fluxo de Dados

```
[Offline] Cadastro → localStorage (status: "pendente")
[Online]  App detecta servidor → botão "Sincronizar" ativo
          POST /sync → backend processa → status: "sincronizado" | "falha"
[Retry]   Botão retry disponível em registros com falha
```

---

## 📦 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Estilos | CSS puro com design system (variáveis CSS) |
| Persistência | localStorage (offline-first) |
| PWA | vite-plugin-pwa + Workbox (service worker) |
| Fontes | Playfair Display + DM Sans + DM Mono |
| Backend | Node.js + Express |

---

## ⚠️ Notas Técnicas

- Backend armazena dados **em memória** — reiniciar o servidor limpa os dados. Em produção, usar banco de dados (PostgreSQL, SQLite, MongoDB).
- O modo offline é garantido pelo Service Worker (PWA) após o primeiro acesso.
- Fotos são armazenadas como `base64` no `localStorage` — limite de ~5MB por origem.
