# Convenções de Desenvolvimento — SmartWriter Analyzer

## Git Workflow

### Conventional Commits

Seguir padrão [Conventional Commits](https://www.conventionalcommits.org/) para melhor rastreabilidade:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Types:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças em documentação
- `style`: Formatação (não afeta lógica)
- `refactor`: Refatoração de código
- `test`: Adição/modificação de testes
- `chore`: Atualizações de dependências, config
- `perf`: Otimizações de performance

**Scopes:**
- `helena-persona` — Persona Helena Vasconcelos
- `readability` — Analisador de readability
- `cadence` — Analisador de cadence
- `ai-detection` — Detecção de IA
- `orchestrator` — Orquestrador de análises
- `cache` — Sistema de cache
- `ui` — Interface (modal, settings)
- `llm` — Serviço LLM
- `parser` — Parser de manuscritos
- `report` — Gerador de relatórios
- `core` — Mudanças generalizadas

**Exemplos:**
```bash
git commit -m "feat(helena-persona): add Chekhov's gun tracking

- Implement tracking of planted and payoff elements
- Add severity scoring for unresolved guns
- Include examples with chapter references"

git commit -m "fix(ai-detection): improve accuracy with DETECT-AI protocol

Fixes #42"

git commit -m "docs: update README with configuration guide"

git commit -m "refactor(orchestrator): simplify analysis pipeline"
```

---

## Branch Strategy

### Nomenclatura
```
<type>/<feature-name>

feat/persona-estrutura
fix/ai-detection-bias
docs/api-reference
refactor/chunk-manager
```

### Fluxo

1. **Create branch** a partir de `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/nova-feature
   ```

2. **Commit incrementais** com mensagens claras
   ```bash
   git add .
   git commit -m "feat(scope): descrição clara"
   ```

3. **Push para remote**
   ```bash
   git push origin feat/nova-feature
   ```

4. **Pull Request** no GitHub
   - Descrever mudanças
   - Referenciar issues (#42)
   - Solicitar review

5. **Merge para develop**
   - Squash or rebase (mantém histórico limpo)
   - Delete branch after merge

6. **Merge develop → main**
   - Apenas em releases
   - Tag com versão: `v1.0.0`

---

## Estrutura de Código

### TypeScript Conventions

```typescript
// Arquivos e pastas: kebab-case
src/analyzers/ai-detection.ts
src/core/analysis-orchestrator.ts

// Classes, Interfaces: PascalCase
class AIDetectionAnalyzer { }
interface IAnalysisRequest { }

// Functions, variables: camelCase
const processChunk = () => { }
let analysisScore = 0;

// Constants: UPPER_SNAKE_CASE
const MAX_CHUNK_SIZE = 10000;
const HELENA_SYSTEM_PROMPT = "...";

// Private members: _camelCase (ou # para fields privados)
private _llmService: LLMService;
#cache = new Map();
```

### Imports

```typescript
// Order:
// 1. External packages
import { App, Plugin } from 'obsidian';
import { Anthropic } from '@anthropic-ai/sdk';

// 2. Project types
import { SmartWriterSettings, AnalysisRequest } from '../types';

// 3. Project modules
import { LLMService } from '../llm/llm-service';
import { CacheManager } from '../core/cache-manager';

// 4. Relative imports
import { analyzeContent } from './helper';
```

### Error Handling

```typescript
// ✅ Sempre ter try-catch para operações async
try {
    const result = await this.llmService.complete(request);
    return result;
} catch (error) {
    console.error('Analysis failed:', error);
    return null; // ou throw, dependendo do contexto
}

// ✅ Type-safe error checking
if (error instanceof TypeError) {
    // Handle type error
} else if (error instanceof ReferenceError) {
    // Handle reference error
}
```

### Documentation

```typescript
/**
 * Analyzes manuscript for readability metrics.
 *
 * @param content - Full manuscript text
 * @param language - Language code (pt-BR, en-US, es-ES)
 * @returns ReadabilityMetrics object with scores
 * @throws Will throw if content is empty
 *
 * @example
 * const metrics = await readabilityAnalyzer.analyze(text);
 * console.log(metrics.flesch_kincaid_grade);
 */
async analyze(content: string, language: string): Promise<ReadabilityMetrics> {
    // implementation
}
```

---

## Testing

### Padrão Jest

```typescript
// File: src/analyzers/__tests__/readability.test.ts

import { ReadabilityAnalyzer } from '../readability';

describe('ReadabilityAnalyzer', () => {
    let analyzer: ReadabilityAnalyzer;

    beforeEach(() => {
        analyzer = new ReadabilityAnalyzer();
    });

    describe('analyze', () => {
        it('should return valid metrics for sample text', async () => {
            const text = 'This is a sample text. It has two sentences.';
            const result = await analyzer.analyze(text);

            expect(result.flesch_kincaid_grade).toBeGreaterThan(0);
            expect(result.smog_index).toBeGreaterThan(0);
        });

        it('should throw on empty content', async () => {
            await expect(analyzer.analyze('')).rejects.toThrow();
        });
    });
});
```

### Executar Testes
```bash
npm run test                  # Todos os testes
npm run test -- --watch      # Watch mode
npm run test -- --coverage   # Com coverage report
```

---

## Code Review Checklist

Antes de fazer PR, verificar:

- [ ] **Código**
  - [ ] Segue convenções TypeScript
  - [ ] Sem console.log (debug)
  - [ ] Erros tratados adequadamente
  - [ ] Tipos explícitos (sem `any` se possível)

- [ ] **Funcionalidade**
  - [ ] Feature funcionando localmente
  - [ ] Sem regressões em features existentes
  - [ ] Testes passando
  - [ ] Build sem erros

- [ ] **Documentação**
  - [ ] JSDoc em funções públicas
  - [ ] README atualizado (se necessário)
  - [ ] CHANGELOG updated
  - [ ] Comments explicativos em lógica complexa

- [ ] **Performance**
  - [ ] Sem console logs em produção
  - [ ] Sem async/await desnecessários
  - [ ] Cache utilizado apropriadamente
  - [ ] Chunking eficiente

- [ ] **Security**
  - [ ] Sem hardcoded secrets
  - [ ] API keys via environment variables
  - [ ] Input validation
  - [ ] Sem vulnerabilidades conhecidas

---

## Performance & Optimization

### Targets

| Métrica | Target |
|---------|--------|
| Build time | < 10s |
| Analyze 50k words | < 30s (cloud) / < 2m (local) |
| Cache hit latency | < 100ms |
| Memory usage | < 500MB |

### Monitoramento

```typescript
// Usar para medir performance
const start = performance.now();
const result = await analyzeChunk(chunk);
const duration = performance.now() - start;
console.log(`Analyzed in ${duration.toFixed(2)}ms`);
```

---

## Debugging

### VSCode Launch Config (`.vscode/launch.json`)

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Obsidian Plugin (esbuild)",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/node_modules/.bin/esbuild",
            "args": ["src/main.ts", "--bundle", "--external:obsidian"],
            "outFiles": ["${workspaceFolder}/main.js"],
            "sourceMaps": true
        }
    ]
}
```

### Console Logging

```typescript
// ✅ Estruturado
console.log('SmartWriter:', { action: 'analyze_start', chunkSize });

// ❌ Evitar
console.log('Starting analysis...');
```

---

## Release Process

### Version Bumping
```bash
npm run version  # Atualiza manifest.json e versions.json automaticamente
git add manifest.json versions.json
git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

### Changelog Entry
- Adicionar em `docs/CHANGELOG.md` (quando criado)
- Formato: `## [X.Y.Z] - YYYY-MM-DD`
- Agrupar por: Added, Changed, Fixed, Deprecated, Removed

---

## CI/CD (GitHub Actions)

### Planejado
- [ ] Build em cada push
- [ ] Lint + type check
- [ ] Teste automation
- [ ] Auto-publish releases

---

## Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Obsidian Developer Docs](https://docs.obsidian.md/Plugins/Overview)
- [Jest Testing Framework](https://jestjs.io/)

---

**Status**: ✅ Documentação de Desenvolvimento Completa
