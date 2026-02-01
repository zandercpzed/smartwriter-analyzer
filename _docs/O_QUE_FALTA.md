# O Que Falta no Projeto — Roadmap Fase 1

## Resumo

SmartWriter Analyzer tem as funcionalidades **base implementadas** (análises, LLM, personas), mas ainda precisa de **refinamento, testes e documentação** antes de estar pronto para produção (v1.0).

**Progresso Geral**: 35% completo (Fase 1 de 5)

---

## 🔴 Crítico (Bloqueia v1.0)

### 1. AI Detection — Validação Real
**Status**: ✅ Implementado, mas ⚠️ não validado

**O que falta**:
- [ ] Testes com corpus de textos **sabidamente gerados**:
  - ChatGPT (GPT-3.5, GPT-4)
  - Claude (Anthropic)
  - Gemini (Google)
  - Copilot
  - Outros modelos
- [ ] Testes com textos **sabidamente humanos**:
  - Clássicos literários
  - Publicações recentes
  - Romances indie
- [ ] Calibração de confidence score (deve ser 0-100, bem justificado)
- [ ] Documentação de accuracy (TP rate, FP rate, etc.)
- [ ] Testes com edge cases (poesia, técnico, código)

**Por que é crítico**: Se o DETECT-AI tiver falsos positivos/negativos altos, a credibilidade do plugin cai.

**Esforço estimado**: 2-3 semanas

---

### 2. Validação de Template — Helena Vasconcelos
**Status**: ✅ Implementado com 12 seções, mas ⚠️ não testado em manuscritos reais

**O que falta**:
- [ ] Executar análise em **5-10 manuscritos reais**
  - Diferentes gêneros (ficção, crime, romance, sci-fi)
  - Diferentes tamanhos (50k, 150k, 300k palavras)
  - Diferentes qualidades (publicado, indie, draft)
- [ ] Validar que:
  - Todos os 12 seções estão sendo preenchidas corretamente
  - Exemplos citados **realmente existem** no manuscrito (não alucinações do LLM)
  - Scores 1-5 são justificados e consistentes
  - Recomendações são acionáveis
  - Tone é apropriado (crítico mas encorajador)
- [ ] Ajustar prompts se necessário baseado em feedback
- [ ] Documentar quais LLMs produzem melhores resultados

**Por que é crítico**: Se os resultados forem ruins ou imprecisos, o plugin não agrega valor.

**Esforço estimado**: 2-3 semanas

---

### 3. Suite de Testes Unitários
**Status**: ⏳ Não iniciado (Jest configurado, mas sem testes)

**O que falta**:
- [ ] Testes para cada analisador:
  - `readability.ts`: testar cálculo de cada métrica
  - `cadence.ts`: testar detecção de ritmo e variação
  - `coherence.ts`: testar identificação de inconsistências
  - `ai-detection.ts`: testar checklist de artefatos IA
- [ ] Testes para orquestração:
  - `analysis-orchestrator.ts`: fluxo completo de análise
  - Chunking com vários tamanhos
  - Cache hits/misses
- [ ] Testes para LLM service:
  - Mock de respostas de API
  - Retry logic
  - Error handling
- [ ] Target: >70% line coverage, >60% branch coverage

**Por que é crítico**: Sem testes, regressions ocorrem quando alguém muda código. Dificulta debugging.

**Esforço estimado**: 2-3 semanas

**Ferramentas**: Jest (já em package.json), tipos TypeScript

---

### 4. Performance Benchmarking
**Status**: ⏳ Não iniciado (precisa de metodologia)

**O que falta**:
- [ ] Medir performance com **3 tamanhos de manuscrito**:
  - 50k palavras (novela curta)
  - 150k palavras (romance típico)
  - 500k palavras (mega-romance)
- [ ] Métricas a medir:
  - Tempo total de análise (end-to-end)
  - Tempo por analisador (readability, cadence, coherence, LLM)
  - Memória utilizada
  - Cache efficiency (hit rate, savings)
- [ ] Benchmarks por LLM provider:
  - Ollama (local)
  - Claude
  - OpenAI
  - Gemini
- [ ] Documentar requisitos de sistema:
  - CPU mínimo
  - RAM mínimo
  - Limite de tamanho de manuscrito
- [ ] Otimizar bottlenecks se houver

**Por que é crítico**: Usuários precisam saber se demora 5 min ou 2 horas, e se vale a pena.

**Esforço estimado**: 1-2 semanas

---

### 5. Documentação Completa
**Status**: ✅ Parcial (existe legacy/PROMPT_DESCRITIVO.md, SETUP_AMBIENTE.md, legacy/GEMINI_SETUP.md)

**O que falta**:
- [ ] **README.md expansão**:
  - Exemplos passo-a-passo de como usar
  - Screenshots de modal e settings
  - Exemplo de output (relatório gerado)
  - Troubleshooting comum
  - FAQ (perguntas frequentes)
- [ ] **Documentação de Helena Vasconcelos**:
  - O que é cada seção das 12
  - O que significa score 1 vs 5
  - Exemplos de feedback bom vs ruim
  - Princípios da persona (tone, rigor, etc.)
- [ ] **Troubleshooting**:
  - "API key rejeitada"
  - "Análise demora muito"
  - "Erro na geração de relatório"
  - "Cache corrompido"
  - "Como limpar dados"
- [ ] **CHANGELOG detalhado**:
  - v0.1.0 → v0.2.0: O que foi adicionado (Gemini)
  - v0.2.0 → v1.0.0: O que será adicionado (testes, validação)
- [ ] **Publicação**:
  - Versão pronta para submissão em Obsidian Community Plugins

**Por que é crítico**: Sem documentação boa, usuários não conseguem usar o plugin ou desistem.

**Esforço estimado**: 1-2 semanas

---

## 🟡 Importante (Não Bloqueia, mas Recomendado para v1.0)

### 6. Análise de Readability — Expansão
**Status**: ✅ 4 métricas implementadas (Flesch-Kincaid, SMOG, Gunning Fog, ARI)

**O que seria legal adicionar**:
- [ ] Análise **por capítulo** (não só global)
  - Gráfico de readability por capítulo
  - Identificação de capítulos mais/menos readáveis
  - Alertas se um capítulo é muito mais difícil que a média
- [ ] Métrica adicional: **Coleman-Liau** (baseada em caracteres, não sílabas)
- [ ] Comparação contra **benchmarks de gênero**
  - Romance típico: Grade 6-8
  - Ficção científica: Grade 7-9
  - Técnico: Grade 10-12
  - Infantil: Grade 2-4
- [ ] Análise de **complexidade de vocabulário**:
  - Percentage de palavras "difíceis" (raras)
  - Diversidade de vocabulário (type-token ratio)
  - Frequência de palavras

**Por que é importante**: Mais dados = mais valor. Mas não é essential para v1.0.

**Esforço estimado**: 1-2 semanas

---

### 7. Análise de Cadence — Refinamento
**Status**: ✅ Burstiness e variação implementados

**O que seria legal adicionar**:
- [ ] Detecção de **diálogo vs narração**
  - % da prosa que é diálogo
  - Cadencia do diálogo vs narração
  - Alternância entre os dois
- [ ] Identificação de **"plateaus" monótonos**
  - Detectar seções onde cadence é muito uniforme
  - Sugerir quebra de monotonia
- [ ] Correlação com **Save the Cat beats**
  - Verificar se pacing segue os 15 beats
  - Alertas se um ato é muito longo/curto
- [ ] Análise de **pausa vs ação**
  - Seções contemplativas vs ativas
  - Equilíbrio entre os dois

**Por que é importante**: Cadence refinada = análise mais profunda. Mas versão atual já funciona.

**Esforço estimado**: 2-3 semanas

---

### 8. Análise de Coerência — Aprofundamento
**Status**: ✅ Estrutura implementada, ⚠️ detecção básica

**O que seria legal adicionar**:
- [ ] **Timeline Consistency**:
  - Rastrear datas/durações mencionadas
  - Detectar inconsistências (12 de janeiro, depois "3 dias depois", depois 15 de janeiro)
  - Alertas para gaps temporais não explicados
- [ ] **Character Tracking**:
  - Rastrear atributos de personagem (nome, idade, profissão, aparência)
  - Detectar mudanças não justificadas
  - Alertas para personagens que desaparecem sem explicação
- [ ] **Knowledge Consistency**:
  - O que cada personagem sabe em cada ponto?
  - Detectar informações que um personagem não deveria saber
  - Rastrear revelações (quando informações são reveladas)
- [ ] **World Consistency**:
  - Mudanças no mundo (físicas, políticas, etc.)
  - Alertas para mudanças não explicadas
  - Rastreamento de tecnologia/magia disponível

**Por que é importante**: Ajuda a catch plot holes. Mas implementação é complexa (requer parsing avançado).

**Esforço estimado**: 4-6 semanas

---

## 🔵 Backog (Fase 2+)

### 9. Personas Adicionais

**Não iniciado** (Fase 2)

#### Persona: Especialista em Estrutura
- Análise profunda de Save the Cat (15 beats)
- Three-Act Structure (clássica)
- Hero's Journey (Joseph Campbell)
- Kishotenketsu (estrutura alternativa oriental)
- Output: Beat sheet visual + recomendações

#### Persona: Especialista em Estilo & Voz
- Análise léxico-estilística (riqueza, repetição)
- Análise de sintaxe (estruturas dominantes)
- Prosódia (eufonia, fluidez)
- Identificação de voz autoral
- Comparação contra estilos de referência

#### Persona: Especialista em Positioning de Mercado
- Conformidade com gênero (vs benchmarks)
- Análise de competidores (comparable titles)
- Nichos potenciais
- Tendências editoriais
- Apelo comercial estimado

**Esforço**: 3 semanas/persona (Fase 2)

---

### 10. Análises Avançadas (Fase 2)

- Análise emocional (emotional beats, graph de tensão)
- Análise de personagem (archetypes, transformação, want/need)
- Análise de tema (mensagens temáticas, subtexto)
- Análise de worldbuilding (coerência, imersão)
- Análise de diálogo (naturalidade, differenciação de personagem)
- Análise de ponto de vista (POV consistency, head-hopping)

---

### 11. Feedback Loops & Recomendações Inteligentes (Fase 3)

- Detecção de revisões (versionamento)
- Re-análise incremental (apenas seções modificadas)
- Tracking de melhoria ao longo do tempo
- Alertas de regressão
- Ranking por ROI (impacto vs esforço)
- Linking entre issues relacionadas
- Sugestões de exemplo (com IA, com disclaimer)

---

### 12. Escalabilidade (Fase 4)

- API REST pública
- Integração com Google Docs, GitHub, CMS
- Fallback inteligente de LLMs
- Caching distribuído (Redis)
- Logs, auditoria, compliance (LGPD/GDPR)

---

## 📊 Priorização

### Para v1.0 (Necessário)
1. AI Detection Validação ✅ **CRÍTICO**
2. Helena Template Validação ✅ **CRÍTICO**
3. Suite de Testes ✅ **CRÍTICO**
4. Performance Benchmarking ✅ **CRÍTICO**
5. Documentação Completa ✅ **CRÍTICO**

### Desejável (Nice to Have)
6. Readability Expansão
7. Cadence Refinamento
8. Coerência Aprofundamento

### Fase 2+ (Backlog)
- Personas adicionais
- Análises avançadas
- Feedback loops
- Escalabilidade

---

## 📈 Timeline Estimada

```
Semana 1-2   (Jan 13-27)    | AI Detection Validação + Helena Testes
Semana 3-4   (Jan 27-Feb 10)| Suite de Testes + Performance
Semana 5-6   (Feb 10-24)    | Documentação + Refinamentos
Semana 7     (Feb 24-Mar 3) | Release v1.0, Submissão Obsidian
```

**Total estimado**: 6-8 semanas para v1.0 pronto para produção

---

## ✨ Quick Wins (Fácil de Implementar)

Se quer fazer algo rápido para melhorar o plugin:

1. **Expandir README** com exemplos (30 min)
2. **Adicionar .gitignore** para .DS_Store, node_modules (5 min)
3. **Coleman-Liau readability** (1 hora)
4. **Documentação de Helena** — explicar cada seção (2 horas)
5. **FAQ básico** no README (1 hora)

Total: ~5 horas para +2 melhorias percebidas pelos usuários.

---

## 🎯 Próximas Ações Recomendadas

**Semana 1 (Jan 13-20)**:
1. [ ] Preparar corpus de testes para AI Detection
2. [ ] Executar Helena em 3 manuscritos piloto
3. [ ] Documentar achados e ajustes necessários

**Semana 2 (Jan 20-27)**:
1. [ ] Finalizar testes AI Detection
2. [ ] Começar suite de testes Jest
3. [ ] Expandir README e FAQ

**Semana 3 (Jan 27-Feb 3)**:
1. [ ] Testes integrais rodando >70% coverage
2. [ ] Performance benchmarking completo
3. [ ] Release notes v1.0

---

## 📞 Próximos Passos

1. **Priorizar qual item começar primeiro**
2. **Dividir em sprints de 1 semana**
3. **Documentar progresso em dev/development-notes/**
4. **Fazer commits regulares com bom mensageiro**

Quer começar por qual item?
