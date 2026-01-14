# Analysis Results

Resultados de análises para rastreabilidade e validação.

## Organização

```
YYYY-MM-DD - [Tipo] - [Descripción].md
```

Exemplos:
- `2026-01-15 - Readability - Sample Short Story.md`
- `2026-01-16 - AI Detection - ChatGPT Generated Text.md`
- `2026-01-17 - Full Analysis - Novel Chapter 3.md`

## Estrutura de Arquivo

```markdown
# Analysis: [Título do Manuscrito]

**Date**: YYYY-MM-DD
**Analyzer**: [Qual analyzer foi usado]
**Test Manuscript**: ../test-manuscripts/[arquivo].md
**Duration**: X segundos

## Results

### Readability
- Flesch-Kincaid: X
- SMOG: X
- Gunning Fog: X
- ARI: X

### Cadence
- Avg Sentence Length: X
- Burstiness: X
- ...

### Coherence
- Plot Holes Found: X
- Character Issues: X
- ...

### Literary Quality (Helena)
- Structure Score: X/5
- Character Arcs: X/5
- ...

## Notes
- Observações sobre a análise
- Problemas encontrados
- Validações confirmar

## Follow-up
- Próximas ações
- Issues a investigar
```

## Processos

1. **Após cada teste**: Salvar resultado completo
2. **Validação**: Comparar com expectativas
3. **Rastreamento**: Linkar commit relevante
4. **Iteração**: Documentar mudanças e re-testes

## Dashboard (Optional)

Criar index.md listando todos os testes com status:
- ✅ Passado
- 🚧 Em progresso
- ❌ Falhou
