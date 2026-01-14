# Publicação no Repositório Obsidian — SmartWriter Analyzer

## Visão Geral

Este documento descreve o processo de publicação do SmartWriter Analyzer no catálogo oficial de plugins Obsidian.

**Repositório Oficial**: https://github.com/obsidianmd/obsidian-releases

---

## Checklist de Pré-Requisitos

### ✅ Arquivo `README.md`
- [x] Descreve o propósito do plugin
- [x] Instruções de uso claras
- [x] Requisitos de instalação
- [x] Screenshots/exemplos (desejável)
- [x] Seção de configuração

### ✅ Arquivo `LICENSE`
- [x] Arquivo MIT definido na raiz
- [x] Compatível com Obsidian (MIT, GPL, Apache 2.0, etc.)

### ✅ Arquivo `manifest.json`
- [x] `id`: "smartwriter-analyzer" (sem "obsidian")
- [x] `name`: "SmartWriter Analyzer"
- [x] `version`: "0.1.0" (segue semver: x.y.z)
- [x] `minAppVersion`: "1.4.0" (Obsidian 1.4.0+)
- [x] `description`: < 250 caracteres ✓ (166 caracteres)
- [x] `author`: "Z Edições"
- [x] `authorUrl`: "https://github.com/zedicoes"
- [x] `fundingUrl`: Vazio (não há programa de suporte financeiro)
- [x] `isDesktopOnly`: true (usa Node.js/Electron para LLM)

### ✅ Código Fonte
- [x] Publicado no GitHub (https://github.com/zandercpzed/smartwriter-analyzer)
- [x] Repositório público
- [x] README visível
- [x] LICENSE visível
- [x] manifest.json visível

---

## Step 1: Preparar Release no GitHub

### 1.1 Atualizar `manifest.json` (quando necessário)

```json
{
	"id": "smartwriter-analyzer",
	"name": "SmartWriter Analyzer",
	"version": "0.1.0",
	"minAppVersion": "1.4.0",
	"description": "AI-powered literary analysis co-pilot. Analyzes readability, cadence, coherence, and literary quality of large manuscripts (50k-500k words).",
	"author": "Z Edições",
	"authorUrl": "https://github.com/zedicoes",
	"fundingUrl": "",
	"isDesktopOnly": true
}
```

### 1.2 Buildar e Publicar Release

```bash
# 1. Certificar-se de que o build está pronto
npm run build

# 2. Verificar que os arquivos foram gerados
ls -la main.js manifest.json styles.css

# 3. Criar um release no GitHub
# Via GitHub UI ou CLI:
gh release create v0.1.0 \
  --title "SmartWriter Analyzer v0.1.0" \
  --notes "Initial release with core analysis features" \
  ./main.js ./manifest.json ./styles.css
```

### 1.3 Detalhes da Release

**Tag Version**: `v0.1.0` (deve corresponder a `manifest.json`)

**Release Name**: "SmartWriter Analyzer v0.1.0"

**Description**:
```
Initial release of SmartWriter Analyzer with:

- AI-powered literary analysis using Claude/OpenAI/Ollama
- Persona-based analysis (Helena Vasconcelos - Senior Beta Reader)
- Readability metrics (Flesch-Kincaid, SMOG, Gunning Fog, ARI)
- Cadence analysis (rhythm and pacing patterns)
- Coherence validation (plot holes, character consistency)
- AI artifact detection (DETECT-AI protocol)
- Intelligent chunking for large manuscripts (50k-500k words)
- Cache system for efficient re-analysis
- Support for local (Ollama) and cloud LLMs (Claude, OpenAI)
- Native Obsidian integration with modal UI and settings

See https://github.com/zandercpzed/smartwriter-analyzer for full documentation.
```

**Assets**: Upload estes três arquivos
- `main.js` (bundled plugin)
- `manifest.json` (metadata)
- `styles.css` (optional but included)

---

## Step 2: Submeter para Revisão Obsidian

### 2.1 Acessar Repositório de Releases

1. Ir para: https://github.com/obsidianmd/obsidian-releases
2. Editar arquivo: `community-plugins.json`
3. Link direto: https://github.com/obsidianmd/obsidian-releases/edit/master/community-plugins.json

### 2.2 Adicionar Entrada do Plugin

No fim do array JSON, **antes do fechamento `]`**, adicionar:

```json
{
  "id": "smartwriter-analyzer",
  "name": "SmartWriter Analyzer",
  "author": "Z Edições",
  "description": "AI-powered literary analysis co-pilot. Analyzes readability, cadence, coherence, and literary quality of large manuscripts (50k-500k words).",
  "repo": "zandercpzed/smartwriter-analyzer"
}
```

**Importante**:
- Adicionar vírgula após entrada anterior (se houver)
- Não incluir comma após a última entrada
- `id` deve ser único (verificar duplicatas)
- `repo` é o path no GitHub: `username/repository`
- Descrição deve corresponder ao `manifest.json`

### 2.3 Exemplo Completo (snippet final)

```json
  {
    "id": "some-other-plugin",
    "name": "Some Other Plugin",
    "author": "Author Name",
    "description": "Description here",
    "repo": "author/repo"
  },
  {
    "id": "smartwriter-analyzer",
    "name": "SmartWriter Analyzer",
    "author": "Z Edições",
    "description": "AI-powered literary analysis co-pilot. Analyzes readability, cadence, coherence, and literary quality of large manuscripts (50k-500k words).",
    "repo": "zandercpzed/smartwriter-analyzer"
  }
]
```

---

## Step 3: Criar Pull Request

### 3.1 Propor Mudanças (via GitHub UI)

1. Após editar `community-plugins.json`
2. Clicar em "Commit changes..." (botão superior direito)
3. Selecionar "Propose changes"
4. Clicar em "Create pull request"

### 3.2 Configurar PR

**Título do PR**:
```
Add plugin: SmartWriter Analyzer
```

**Descrição do PR** (preencher com):

```markdown
## SmartWriter Analyzer

**Author**: Z Edições  
**Repository**: https://github.com/zandercpzed/smartwriter-analyzer  
**Latest Release**: v0.1.0

### Description
AI-powered literary analysis co-pilot for Obsidian. Analyzes readability, 
cadence, coherence, and literary quality of large manuscripts (50k-500k words).

### Features
- Persona-based analysis (Helena Vasconcelos)
- Readability metrics (Flesch-Kincaid, SMOG, ARI)
- AI artifact detection
- Cache system for efficiency
- Support for Claude, OpenAI, and Ollama

### Links
- Repository: https://github.com/zandercpzed/smartwriter-analyzer
- Release: https://github.com/zandercpzed/smartwriter-analyzer/releases/tag/v0.1.0

### Checklist
- [x] Plugin is published on GitHub
- [x] Plugin follows Obsidian plugin standards
- [x] Description is accurate and concise
- [x] Repository is public
- [x] Latest release matches manifest.json version
- [x] Plugin is desktop-only (correctly marked in manifest)
```

### 3.3 Preview e Criar PR

1. Selecionar "Preview" tab
2. Selecionar "Community Plugin" na categoria
3. Clicar "Create pull request"

---

## Step 4: Validação Automática

### 4.1 Bot Validation

Após submeter, um bot do Obsidian automaticamente verificará:

- [x] `manifest.json` é válido
- [x] Versão segue semver (x.y.z)
- [x] `id` não contém "obsidian"
- [x] `id` é único
- [x] `repo` aponta para repositório válido
- [x] Repository é público
- [x] Release corresponde à versão

### 4.2 Labels de Status

**Se passou**: PR receberá label **"Ready for review"** ✅

**Se falhou**: PR receberá label **"Validation failed"** ❌
- Revisar os erros listados
- Fazer commits adicionais para corrigir
- Bot reavaliará automaticamente

### 4.3 Ignorar Merge Conflicts

Se receber aviso de merge conflicts:
- **Ignorar completamente**
- Não fazer merge ou rebase
- Obsidian team resolverá automaticamente

---

## Step 5: Revisão Humana

### 5.1 Tempo de Revisão

- **Tempo estimado**: Variável (dias a semanas)
- **Workload**: Obsidian team é pequeno
- **Paciência**: Necessária 😊

### 5.2 Possíveis Comentários

Reviewers podem:
- ✅ Aprovar e publicar
- 🔄 Solicitar mudanças (lista de issues)
- 💬 Oferecer sugestões de melhorias

### 5.3 Se Solicitado Mudanças

1. Realizar mudanças no código/documentação
2. Atualizar GitHub release com novos arquivos
3. Deixar comentário no PR: "Addressed feedback"
4. **NÃO abrir novo PR**
5. Aguardar re-review

---

## Step 6: Publicação

Após aprovação:
- Obsidian team publicará o plugin automaticamente
- Plugin aparecerá em: https://obsidian.md/plugins
- Usuários conseguirão instalar via Obsidian UI
- Não é necessário fazer nada adicional

---

## Após Publicação: Anúncio Comunitário

### 6.1 Fórum Obsidian

Postar em: https://forum.obsidian.md/c/share-showcase/9

**Título**: "[SmartWriter Analyzer] AI-powered literary analysis for large manuscripts"

**Conteúdo**:
```
Hi Obsidian community!

I'm excited to announce SmartWriter Analyzer, an AI-powered literary 
analysis co-pilot for Obsidian.

## Key Features
- Analyzes readability, cadence, coherence for manuscripts up to 500k words
- Uses AI personas (starting with Helena Vasconcelos - Senior Beta Reader)
- Supports local (Ollama) and cloud LLMs (Claude, OpenAI)
- Intelligent chunking and caching for large documents

## Links
- Repository: https://github.com/zandercpzed/smartwriter-analyzer
- Obsidian Plugin Directory: https://obsidian.md/plugins?id=smartwriter-analyzer

## Roadmap
The plugin is still in active development with exciting features coming:
- Additional personas (structural editing, style analysis, market positioning)
- Advanced feedback loops and recommendations
- REST API for integrations
- Community-driven personas

I'd love your feedback and suggestions!
```

### 6.2 Discord Obsidian

**Canal**: #updates  
**Requirement**: Ter "Plugin Author" role (request via forum/Discord)

**Mensagem**:
```
🔍 **SmartWriter Analyzer** v0.1.0 is now available!

AI-powered literary analysis for Obsidian. Perfect for manuscript 
evaluation with readability metrics, coherence checking, and AI detection.

🔗 https://obsidian.md/plugins?id=smartwriter-analyzer
📚 https://github.com/zandercpzed/smartwriter-analyzer

Features:
• Large manuscript support (50k-500k words)
• Expert personas for analysis
• Local & cloud LLM support
• Intelligent chunking & caching

Come try it out! 🚀
```

---

## Atualizações Futuras

### Versioning & Releases

Após publicado, para novos releases:

1. **Atualizar versão** em `manifest.json`
2. **Build**: `npm run build`
3. **GitHub Release**: Upload novos `main.js`, `manifest.json`, `styles.css`
4. **Automático**: Obsidian detecta novo release via GitHub
5. **Usuários**: Conseguem atualizar via Obsidian UI

Não precisa fazer nada em `community-plugins.json` para atualizações.

### Exemplo de Release Futura

```bash
# v0.2.0 - Refine AI Detection
git tag v0.2.0
npm run build
gh release create v0.2.0 \
  --title "SmartWriter Analyzer v0.2.0" \
  --notes "Refine AI detection with DETECT-AI protocol improvements" \
  ./main.js ./manifest.json ./styles.css
```

---

## Verificação Pré-Submissão

Execute este checklist antes de submeter:

```bash
# ✅ Compilação sem erros
npm run build

# ✅ Files necessários existem
ls manifest.json main.js styles.css README.md LICENSE

# ✅ Verificar manifest.json
cat manifest.json | jq .version  # Deve ser x.y.z
cat manifest.json | jq .id       # Sem "obsidian"

# ✅ README tem instruções claras
head -50 README.md

# ✅ Repository é público
curl -s https://api.github.com/repos/zandercpzed/smartwriter-analyzer | jq .private
# Deve retornar: false

# ✅ Release existe no GitHub
gh release view v0.1.0
```

---

## Troubleshooting

### "Validation failed" no PR

**Causas comuns:**
- `version` em `manifest.json` não é x.y.z
- `id` contém "obsidian"
- `id` já existe (verificar `community-plugins.json`)
- `repo` não aponta para repositório público
- Arquivos não estão no release GitHub

**Solução:**
1. Identificar erro no log do bot
2. Fazer commit com correção
3. Atualizar release GitHub se necessário
4. Bot reavaliará automaticamente

### "This branch has conflicts"

**Ação**: Ignorar completamente
- Não fazer merge ou rebase
- Obsidian team resolve antes de publicar

### Resposta lenta de reviewers

- Ser paciente (team é pequeno)
- Não fazer bump ou nag
- Disponível para responder comentários rapidamente

---

## Referências

- [Obsidian Plugin Submission Docs](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [Submission Requirements](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins)
- [Developer Policies](https://docs.obsidian.md/Developer+policies)
- [Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Community Plugins JSON](https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json)

---

**Status**: ✅ Pronto para submissão quando v1.0.0 for lançado  
**Próximo passo**: Completar Fase 1 (estabilização) → Publicar v1.0.0 → Submeter
