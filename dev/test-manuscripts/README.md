# Test Manuscripts

Manuscritos para testes e validação de análises.

## Organização

- `sample-*.md` — Manuscritos de exemplo
- `test-*.md` — Casos de teste específicos

## Categorias

### Readability Tests
- Textos com diferentes níveis de complexidade
- Testam accuracy de métricas (Flesch-Kincaid, SMOG, etc.)

### Cadence Tests
- Textos com ritmos narrativos diferentes
- Testam variação de comprimento (burstiness)

### Coherence Tests
- Textos com plot holes e inconsistências
- Testam detecção de problemas estruturais

### AI Detection Tests
- Textos gerados por IA (ChatGPT, Claude, etc.)
- Textos humanos (baseline)
- Textos híbridos para validar false positives

## Padrão

Cada teste deve ter:
```
# Test: [Nome do Teste]

## Objetivo
O que está sendo testado

## Características
- Comprimento: X palavras
- Tipo: romance/técnico/etc
- Gerado por: IA/Humano/Híbrido

## Esperado
Qual é o resultado esperado

## Notas
Observações adicionais
```

## Status

Criar manuscritos de teste conforme necessário durante Fase 1.
