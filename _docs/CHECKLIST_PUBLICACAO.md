# Checklist de Publicação — SmartWriter Analyzer

Use este checklist quando estiver pronto para publicar a versão 1.0.0 no repositório Obsidian.

---

## 📋 Pré-Publicação (Antes de criar release)

### Código & Compilação
- [ ] `npm run build` executa sem erros
- [ ] `npm run lint` sem warnings críticos
- [ ] Nenhum `console.log` em produção
- [ ] TypeScript types são seguros (sem `any` desnecessário)
- [ ] Todos os imports estão corretos

### Documentação
- [ ] README.md está completo e atualizado
- [ ] Instruções de instalação são claras
- [ ] Guia de uso é compreensível
- [ ] FAQ está preenchido (se aplicável)
- [ ] Documentação de configuração (Ollama, APIs) presente

### Manifest & Metadata
- [ ] `manifest.json` tem versão `1.0.0`
- [ ] `id` é "smartwriter-analyzer" (sem "obsidian")
- [ ] `name` é "SmartWriter Analyzer"
- [ ] `description` tem < 250 caracteres (verificado: 166 chars ✓)
- [ ] `author` é "Z Edições"
- [ ] `authorUrl` aponta para repositório GitHub válido
- [ ] `minAppVersion` é apropriado (1.4.0 ✓)
- [ ] `isDesktopOnly` é `true` (usa Node.js/Electron)
- [ ] `fundingUrl` removido (não aceita doações)

### Licença & Legais
- [ ] LICENSE file presente (MIT)
- [ ] LICENSE está presente em `_docs/LICENSE` (moved to `_docs/`)
- [ ] Compatível com Obsidian (MIT ✓)
- [ ] Termos de uso são claros

### Testes & QA
- [ ] Manual testing com pelo menos 2 manuscritos reais
- [ ] Análises geram saída correta
- [ ] Nenhum crash ou erro não tratado
- [ ] Performance é aceitável (< 30s para 50k words)
- [ ] Funções de cache funcionam
- [ ] Settings são salvos corretamente

---

## 🔖 Criação de Release (Criar v1.0.0)

### Via Script (Recomendado)
```bash
./release.sh 1.0.0
```

Isso faz automaticamente:
- [x] Atualiza versão em manifest.json
- [x] Compila com npm run build
- [x] Verifica integridade dos arquivos
- [x] Cria commit com versão
- [x] Cria git tag v1.0.0

### Via Manual (Se necessário)

#### Passo 1: Atualizar manifest.json
```bash
# Editar manifest.json, mudar version para "1.0.0"
# Verificar:
# - "version": "1.0.0"
# - "minAppVersion": "1.4.0"
# - "id": "smartwriter-analyzer" (sem "obsidian")
```

#### Passo 2: Build
```bash
npm run build
```

#### Passo 3: Verificar artifacts
```bash
ls -la main.js manifest.json styles.css
# Todos devem existir
```

#### Passo 4: Git commit
```bash
git add manifest.json main.js styles.css
git commit -m "chore(release): bump version to 1.0.0"
git tag v1.0.0 -m "SmartWriter Analyzer 1.0.0"
```

#### Passo 5: Push
```bash
git push origin main
git push origin v1.0.0
```

---

## 🚀 Criar GitHub Release

### Via CLI
```bash
gh release create v1.0.0 \
  --title "SmartWriter Analyzer 1.0.0" \
  --notes "See CHANGELOG.md for details" \
  ./main.js ./manifest.json ./styles.css
```

### Via GitHub UI
1. Ir para https://github.com/zandercpzed/smartwriter-analyzer/releases
2. Clicar "Create a new release"
3. Tag version: `v1.0.0`
4. Title: "SmartWriter Analyzer 1.0.0"
5. Description: [Copiar do CHANGELOG.md]
6. Upload artifacts:
   - [ ] main.js
   - [ ] manifest.json
   - [ ] styles.css
7. Clicar "Publish release"

### Checklist de Release
- [ ] Tag correspond à versão em manifest.json
- [ ] Release title é claro
- [ ] Description é descritiva
- [ ] Todos 3 arquivos fazem upload
- [ ] Release é public (não draft)

---

## 📝 Submeter para Obsidian (IMPORTANTE!)

### Pré-Submissão
- [ ] GitHub release v1.0.0 está criada
- [ ] Repository é público
- [ ] manifest.json está correto
- [ ] README é compreensível
- [ ] Plugin já funciona e foi testado

### Submissão no community-plugins.json

1. **Abrir arquivo**
   - URL: https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json
   - Clicar ✏️ para editar

2. **Adicionar entrada**
   ```json
   {
     "id": "smartwriter-analyzer",
     "name": "SmartWriter Analyzer",
     "author": "Z Edições",
     "description": "AI-powered literary analysis co-pilot. Analyzes readability, cadence, coherence, and literary quality of large manuscripts (50k-500k words).",
     "repo": "zandercpzed/smartwriter-analyzer"
   }
   ```

3. **Validações**
   - [ ] `id` é único (search em `community-plugins.json`)
   - [ ] `id` não contém "obsidian"
   - [ ] Descrição corresponde a manifest.json
   - [ ] `repo` path está correto: `zandercpzed/smartwriter-analyzer`

4. **Commit message**
   - Title: "Add plugin: SmartWriter Analyzer"
   - Selecionar "Propose changes"

5. **Pull Request**
   - Title: "Add plugin: SmartWriter Analyzer"
   - Description:
     ```markdown
     ## SmartWriter Analyzer

     - **Author**: Z Edições
     - **Repository**: https://github.com/zandercpzed/smartwriter-analyzer
     - **Version**: 1.0.0

     AI-powered literary analysis co-pilot for Obsidian.

     [Completar com detalhes do plugin]
     ```
   - Checklist:
     - [x] Plugin is published on GitHub
     - [x] Repository is public
     - [x] Plugin follows Obsidian standards
     - [x] Description matches manifest.json
     - [x] Plugin is tested and stable
   - Clicar "Create pull request"

---

## ✅ Validação Automática

### Bot Validation (Automático)
- [ ] Bot valida submissão
- [ ] Se `Validation failed`: corrigir erros listados
- [ ] Se `Ready for review`: aguardar review humano

**Erros Comuns:**
- Version não é x.y.z (e.g., "1.0" é inválido)
- `id` contém "obsidian"
- `id` já existe
- Repository não é público
- Release GitHub não encontrada

### Ignorar Merge Conflicts
- [ ] Se receber aviso de "This branch has conflicts"
- [ ] **Ignorar completamente**
- [ ] Não fazer merge ou rebase
- [ ] Obsidian team resolverá antes de publicar

---

## 👥 Review Humano

### Esperado
- [ ] Obsidian team revisa PR
- [ ] Tempo estimado: dias a semanas (ser paciente)
- [ ] Possíveis comentários com sugestões

### Se Feedback
- [ ] Ler comentários do reviewer
- [ ] Fazer mudanças no código/docs (se necessário)
- [ ] Atualizar GitHub release com novos arquivos
- [ ] Deixar comentário: "Addressed feedback"
- [ ] **NÃO abrir novo PR**

### Aprovação
- [ ] PR aprovado
- [ ] Label "Ready for review" adicionado
- [ ] Aguardar merge by Obsidian team

---

## 🎉 Publicação

### Automático após aprovação
- [ ] Obsidian team publica o plugin
- [ ] Aparece em https://obsidian.md/plugins
- [ ] Disponível no Obsidian Community Plugins
- [ ] Nada adicional necessário

### Verificação
- [ ] Plugin está searchável em Obsidian UI
- [ ] Informações estão corretas
- [ ] Download funciona
- [ ] Instalação é possível

---

## 📢 Anúncio Comunitário

### Obsidian Forum
- [ ] Postar em: https://forum.obsidian.md/c/share-showcase/9
- [ ] Title: "[SmartWriter Analyzer] AI-powered literary analysis"
- [ ] Incluir features principais
- [ ] Incluir link para GitHub
- [ ] Mencionar roadmap

### Obsidian Discord
- [ ] Postar em: `#updates` channel
- [ ] Usar "Plugin Author" role (request se necessário)
- [ ] Mensagem concisa com link
- [ ] Exemplo:
  ```
  🔍 SmartWriter Analyzer v1.0.0 is now available!
  
  AI-powered literary analysis for Obsidian. Analyze manuscripts 
  up to 500k words with readability, cadence, coherence checks.
  
  🔗 https://obsidian.md/plugins?id=smartwriter-analyzer
  ```

---

## 📊 Pós-Publicação

### Monitoramento
- [ ] Acompanhar feedback dos usuários
- [ ] Responder issues no GitHub
- [ ] Corrigir bugs críticos (patch releases)
- [ ] Adicionar melhorias (minor releases)

### Próximas Versões
- [ ] v1.1.0: Novos analisadores/personas
- [ ] v1.2.0: Otimizações e features
- [ ] v2.0.0: Mudanças maiores (Fase 3+)

---

## 🔗 Recursos Úteis

- [Obsidian Plugin Submission Docs](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [Submission Requirements](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins)
- [Community Plugins JSON](https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json)
- [Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)

---

## ⚠️ Dicas Importantes

1. **Ser paciente** — Review leva tempo (Obsidian team é pequeno)
2. **Não fazer spam** — Não "bump" ou nag no PR
3. **Responder feedback** — Ser responsivo a comentários
4. **Manter compatibilidade** — Não quebrar versões antigas desnecessariamente
5. **Comunicar mudanças** — CHANGELOG claro para usuários

---

**Status**: ✅ Checklist Completo e Pronto para v1.0.0

Última atualização: 2026-01-13
