# Plugin SmartWriter Analyzer — Instalado Localmente

## Status: ✅ Instalado

O plugin SmartWriter Analyzer foi instalado no repositório Obsidian local.

---

## Localização

```
.obsidian/plugins/smartwriter-analyzer/
├── main.js           (código bundled)
├── manifest.json     (metadados)
├── styles.css        (estilos)
└── data.json         (configurações)
```

## Configuração

O plugin foi registrado em `.obsidian/community-plugins.json`:
```json
[
  "prettier",
  "smartwriter-analyzer"
]
```

## Próximos Passos

### 1. Abrir Obsidian
1. Ir para: **Settings → Community Plugins**
2. Verificar se "SmartWriter Analyzer" aparece na lista
3. Se aparecer: **Enable** o plugin

### 2. Configurar LLM
1. Abrir **Settings → SmartWriter Analyzer**
2. Escolher provider:
   - **Ollama** (local) — padrão
   - **Claude** (API Anthropic)
   - **OpenAI** (API OpenAI)

### 3. Testar Plugin

#### Se usando Ollama (local):
```bash
# Em outro terminal:
ollama serve

# Depois:
ollama pull llama3.1
```

Volta ao Obsidian:
1. Criar nota `.md` com texto
2. Abrir Command Palette (Cmd+P)
3. Buscar: "SmartWriter: Analyze manuscript"
4. Selecionar tipo de análise
5. Aguardar resultado

#### Se usando Claude/OpenAI:
1. Settings → SmartWriter Analyzer
2. Selecionar "Claude" ou "OpenAI"
3. Entrar API Key
4. Testar análise

---

## Comandos Disponíveis

| Comando | Função |
|---------|--------|
| `SmartWriter: Analyze manuscript` | Análise completa |
| `SmartWriter: Quick readability check` | Só readability |
| `SmartWriter: Detect AI artifacts` | Só AI detection |
| `SmartWriter: Clear cache` | Limpar cache |

---

## Arquivos de Configuração

### data.json
Armazena preferências do usuário. Padrão:
```json
{
  "llmProvider": "ollama",
  "apiEndpoint": "http://localhost:11434",
  "apiKey": "",
  "model": "llama3.1",
  "chunkSize": 10000,
  "cacheDuration": 30,
  "language": "pt-BR"
}
```

### Atualizar Plugin
Quando fizer mudanças no código:
1. Compilar: `npm run build`
2. Copiar: `cp main.js manifest.json styles.css .obsidian/plugins/smartwriter-analyzer/`
3. Reload Obsidian (Cmd+Shift+R ou Settings)

---

## Troubleshooting

### Plugin não aparece em Settings
- [ ] Verificar se `community-plugins.json` tem "smartwriter-analyzer"
- [ ] Reiniciar Obsidian completamente
- [ ] Verificar se arquivos existem em `.obsidian/plugins/smartwriter-analyzer/`

### Erro ao ativar plugin
- [ ] Verificar se `main.js` foi compilado (npm run build)
- [ ] Verificar console (Ctrl+Shift+I) para erros específicos
- [ ] Checar se `manifest.json` é válido

### Ollama não conecta
```bash
# Verificar se Ollama está rodando
curl http://localhost:11434/api/tags

# Se falhar, iniciar:
ollama serve
```

### Análise não funciona
- [ ] Verificar se LLM está configurado corretamente
- [ ] Se Ollama: executar `ollama pull llama3.1`
- [ ] Se Claude/OpenAI: verificar API key é válida
- [ ] Verificar console para erros

---

## Desenvolvimento

### Workflow de desenvolvimento
1. Fazer mudanças em `src/`
2. Compilar: `npm run build`
3. Copiar artifacts: `cp main.js manifest.json styles.css .obsidian/plugins/smartwriter-analyzer/`
4. Reload Obsidian
5. Testar

### Debug
```bash
# Terminal 1: Compilar em watch mode
npm run dev

# Terminal 2: Abrir Obsidian com DevTools
open -a Obsidian
# Depois Ctrl+Shift+I para Developer Tools
```

---

## Links Úteis

- [README Principal](../README.md)
- [Setup de Ambiente](../docs/SETUP_AMBIENTE.md)
- [Guia de Uso](../README.md#usage)
- [Documentação Obsidian](https://docs.obsidian.md/Plugins/Overview)

---

**Data de Instalação**: 2026-01-13  
**Versão**: 0.1.0  
**Status**: ✅ Pronto para testes
