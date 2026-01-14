# Preparação de Corpus de Testes para AI Detection

## 📋 Objetivo

Coletar e estruturar um conjunto de **~40 textos** (20 gerados por IA + 20 humanos) para:
- Treinar/calibrar o algoritmo DETECT-AI
- Validar accuracy (TP, FP, TN, FN rates)
- Documentar confidence scores
- Identificar padrões de falso positivo/negativo

---

## 🎯 Estrutura do Corpus

### Meta Final
```
corpus-ai-detection/
├── generated/          # Textos sabidamente gerados por IA
│   ├── chatgpt-3.5/   (8 textos)
│   ├── chatgpt-4/     (4 textos)
│   ├── claude/        (4 textos)
│   ├── gemini/        (2 textos)
│   └── meta/          (2 textos)
├── human/             # Textos sabidamente humanos
│   ├── published/     (5 textos - clássicos/recentes publicados)
│   ├── indie/         (5 textos - autores indie conhecidos)
│   ├── technical/     (5 textos - artigos técnicos)
│   └── diverse/       (5 textos - blogs, reviews, ensaios)
├── metadata.csv       # Registro de cada texto
└── analysis-results/  # Resultados das análises
```

---

## 📊 Detalhamento: O Que Coletar

### 1. Textos Gerados por IA (20)

#### ChatGPT 3.5 (8 textos)
```
Prompts sugeridos:
- "Escreva um parágrafo de abertura para um romance de ficção científica"
- "Descreva uma cena de confronto entre dois personagens"
- "Escreva um diálogo sobre relacionamento"
- "Faça uma descrição de um cenário futurista"
- "Escreva sobre tema: IA e humanidade"
- "Gere uma sinopse de 200 palavras para um romance"
- "Descreva um personagem de forma detalhada"
- "Escreva uma cena de ação em um livro"

Protocolo:
1. Use ChatGPT 3.5 (não 4)
2. Copie exatamente como gerado (sem editar)
3. Comprimento: 300-500 palavras cada
4. Salve com nome: chatgpt-3.5-001.md
```

#### ChatGPT 4 (4 textos)
```
Mesmos prompts acima, mas com ChatGPT 4
Salve como: chatgpt-4-001.md
Comprimento: 300-500 palavras
```

#### Claude (4 textos)
```
Prompts:
- "Escreva uma cena de abertura de um romance literário"
- "Descreva um conflito emocional profundo"
- "Escreva diálogo natural entre personagens"
- "Crie uma descrição atmosférica de um lugar"

Salve como: claude-001.md
Comprimento: 300-500 palavras
```

#### Gemini (2 textos)
```
Prompts:
- "Escreva uma cena literária"
- "Descreva personagens em interação"

Salve como: gemini-001.md
Comprimento: 300-500 palavras
```

#### Meta Llama (2 textos)
```
Use Ollama localmente se disponível
Ou use API de terceiros (como Hugging Face)

Salve como: meta-llama-001.md
Comprimento: 300-500 palavras
```

### 2. Textos Humanos (20)

#### Publicados (5 textos)
```
Origem:
1. Excerto de clássico (Machado de Assis, Clarice Lispector, etc.)
2. Excerto de romance contemporâneo publicado
3. Conto de escritor premiado
4. Prefácio/introdução de livro
5. Artigo literário de revista respeitada

Como obter:
- Project Gutenberg (domínio público)
- Google Books (preview, cópia permitida)
- Amazon (Look inside)
- Revistas literárias online

Salve como: published-001.md
Comprimento: 300-500 palavras
```

#### Indie (5 textos)
```
Origem:
- Autores indie com boas avaliações (Amazon, Skoob)
- Blogs de escritores em desenvolvimento
- Plataformas como Medium, Wattpad (escritores com seguidores)
- Antologias indie

Como obter:
- Amazon Kindle (amostras grátis)
- Plataformas indie (Smashwords, Draft2Digital)
- Blogs pessoais de autores

Salve como: indie-001.md
Comprimento: 300-500 palavras
```

#### Técnico/Não-ficção (5 textos)
```
Origem:
- Artigos científicos (arXiv, researchgate)
- Ensaios técnicos (Medium, dev.to)
- Artigos jornalísticos
- Análises críticas

Contexto: IA Detection também deve funcionar
em textos técnicos (falsos positivos?)

Salve como: technical-001.md
Comprimento: 300-500 palavras
```

#### Diverso (5 textos)
```
Origem:
- Reviews literários
- Críticas de livros (Goodreads, blogs)
- Ensaios pessoais
- Cartas/memórias
- Diários publicados

Objetivo: Representatividade de estilos e tons

Salve como: diverse-001.md
Comprimento: 300-500 palavras
```

---

## 📝 Metadata & Documentação

### Arquivo: `corpus-ai-detection/metadata.csv`

```csv
filename,source,label,model,prompt_used,word_count,language,date_collected,notes
chatgpt-3.5-001.md,ChatGPT 3.5,GENERATED,gpt-3.5-turbo,"Escreva um parágrafo de abertura...",425,pt-BR,2026-01-13,original response
chatgpt-4-001.md,ChatGPT 4,GENERATED,gpt-4,"Escreva um parágrafo de abertura...",412,pt-BR,2026-01-13,original response
claude-001.md,Claude,GENERATED,claude-3-sonnet,"Escreva uma cena literária...",389,pt-BR,2026-01-13,original response
published-001.md,Gutenberg,HUMAN,N/A,N/A,387,pt-BR,2026-01-13,Excerpt from Machado de Assis
indie-001.md,Amazon Kindle,HUMAN,N/A,N/A,445,pt-BR,2026-01-13,Indie author published book
technical-001.md,Medium,HUMAN,N/A,N/A,512,pt-BR,2026-01-13,Technical article
diverse-001.md,Goodreads,HUMAN,N/A,N/A,398,pt-BR,2026-01-13,Book review
```

---

## 🔬 Estrutura de Cada Arquivo de Teste

### Padrão para `chatgpt-3.5-001.md`:

```markdown
# AI Generated Text - ChatGPT 3.5

## Metadata
- **Model**: GPT-3.5-turbo
- **Date Generated**: 2026-01-13
- **Prompt Used**: "Escreva um parágrafo de abertura para um romance de ficção científica"
- **Word Count**: 425
- **Language**: Portuguese (Brazil)
- **Label for Training**: GENERATED

## Original Prompt
[Copiar exatamente o prompt usado]

## Generated Text
[Copiar exatamente a resposta, sem editar]

## Notes
- Unedited output from model
- Temperature: [padrão do modelo]
- No manual revisions
```

### Padrão para `published-001.md`:

```markdown
# Human Written Text - Published Literature

## Metadata
- **Author**: [Nome do autor]
- **Source**: [Título do livro/artigo]
- **Publication Date**: [Ano]
- **Word Count**: 387
- **Language**: Portuguese (Brazil)
- **Label for Training**: HUMAN
- **Collection Date**: 2026-01-13

## Source Information
- **Genre**: [Romance/Técnico/Ensaio]
- **License**: [Domínio Público/Creative Commons/Citação permitida]
- **URL**: [Link para fonte]

## Excerpt
[Copiar exatamente o texto original, com créditos]

## Notes
- [Observações sobre qualidade, estilo, etc.]
```

---

## 🛠️ Processo Passo-a-Passo

### Semana 1: Planejamento & Setup (2-3 horas)

**Dia 1: Preparar estrutura**
```bash
# No seu projeto
mkdir -p dev/corpus-ai-detection/{generated,human,analysis-results}
mkdir -p dev/corpus-ai-detection/generated/{chatgpt-3.5,chatgpt-4,claude,gemini,meta}
mkdir -p dev/corpus-ai-detection/human/{published,indie,technical,diverse}

# Criar arquivo metadata
touch dev/corpus-ai-detection/metadata.csv
```

**Dia 1-2: Criar lista de prompts**
- [ ] Listar 8 prompts para ChatGPT 3.5
- [ ] Listar 4 prompts para ChatGPT 4
- [ ] Listar 4 prompts para Claude
- [ ] Listar 2 prompts para Gemini
- [ ] Documentar em `dev/corpus-ai-detection/PROMPTS.md`

**Dia 2-3: Pesquisar fontes humanas**
- [ ] Encontrar 5 textos publicados (clássicos/recentes)
- [ ] Encontrar 5 textos indie (Amazon, Wattpad, etc.)
- [ ] Encontrar 5 textos técnicos (Medium, arXiv, etc.)
- [ ] Encontrar 5 textos diversos (reviews, ensaios, etc.)
- [ ] Documentar URLs e metadados

### Semana 2: Coleta de Dados (4-5 horas)

**Dia 1-2: Gerar textos com IA**
```
Para cada modelo:
1. Abra a interface (ChatGPT, Claude, Gemini)
2. Use prompt exato do `PROMPTS.md`
3. Copie resposta completa (sem editar)
4. Salve em arquivo `.md` com template padrão
5. Registre em `metadata.csv`

Tempo estimado: 30 min/modelo × 5 modelos = 2.5 horas
```

**Dia 2-3: Copiar textos humanos**
```
Para cada texto:
1. Acesse fonte (Gutenberg, Amazon, Medium, etc.)
2. Copie 300-500 palavras (verificar permissão!)
3. Salve em arquivo `.md` com template padrão
4. Registre origem, link, dados no metadata.csv
5. Inclua créditos adequados

Tempo estimado: 15 min/texto × 20 textos = 5 horas
```

### Semana 3: Análise & Documentação (3-4 horas)

**Dia 1-2: Executar AI Detection em todos os textos**
```typescript
// Pseudocódigo para processamento em batch
const corpus = await loadCorpus('dev/corpus-ai-detection');

for (const textFile of corpus.files) {
  const text = fs.readFileSync(textFile);
  const result = aiDetectionAnalyzer.analyze(text);
  
  results[textFile] = {
    confidence: result.confidence,
    detectedAsAI: result.detectedAsAI,
    indicators: result.indicators,
    timestamp: new Date()
  };
  
  // Salve em analysis-results/
  fs.writeFileSync(`analysis-results/${textFile}.json`, JSON.stringify(result));
}
```

**Dia 2-3: Compilar resultados & validar**
```csv
filename,actual_label,detected_as_ai,confidence,accuracy,notes
chatgpt-3.5-001.md,GENERATED,YES,0.92,TP,Correct detection
published-001.md,HUMAN,NO,0.05,TN,Correct detection
technical-001.md,HUMAN,YES,0.78,FP,False positive - technical language
```

---

## 📋 Checklist Prático

### Antes de Começar
- [ ] Criar diretório corpus-ai-detection
- [ ] Preparar templates de arquivos
- [ ] Listar prompts exatos
- [ ] Pesquisar fontes humanas

### Geração de Dados
- [ ] [ ] 8 textos ChatGPT 3.5
- [ ] 4 textos ChatGPT 4
- [ ] 4 textos Claude
- [ ] 2 textos Gemini
- [ ] 2 textos Meta Llama
- [ ] 5 textos Published
- [ ] 5 textos Indie
- [ ] 5 textos Technical
- [ ] 5 textos Diverse

### Documentação
- [ ] Metadata.csv completo
- [ ] PROMPTS.md documentado
- [ ] Todos os arquivos com template padrão
- [ ] Créditos e links documentados

### Análise
- [ ] Executar AI Detection em todos
- [ ] Compilar resultados em CSV
- [ ] Calcular accuracy, precision, recall
- [ ] Documentar findings

---

## 🔗 Recursos Úteis

### Textos Publicados (Domínio Público)
- **Project Gutenberg** (www.gutenberg.org) — 70k+ livros em português
- **Domínio Público** (www.dominiopublico.gov.br) — Acervo brasileiro
- **Open Library** (openlibrary.org) — Milhões de textos

### Textos Indie
- **Amazon Kindle** — Look Inside (amostras)
- **Wattpad** (www.wattpad.com) — Comunidade de escritores
- **Medium** (medium.com) — Ensaios diversos
- **Dev.to** (dev.to) — Artigos técnicos

### Ferramentas para Coleta
- **Browser DevTools** — Copiar texto de PDFs/websites
- **PDF readers** — Extrair texto de livros PDF
- **Markdown editors** — Estruturar textos coletados

### APIs de IA para Geração
- **ChatGPT** (openai.com) — Pago por token
- **Claude** (claude.ai) — 100k tokens gratuitos/mês
- **Gemini** (gemini.google.com) — Gratuito
- **Ollama** (ollama.ai) — Local, gratuito

---

## ⚠️ Considerações Legais & Éticas

### Textos Gerados
- ✅ Use modelos públicos (ChatGPT, Claude, Gemini)
- ✅ Documente modelo e prompt exato
- ✅ Reutilize para pesquisa/testes apenas

### Textos Humanos
- ✅ Preferir domínio público (clássicos)
- ✅ Verificar licença (Creative Commons, citação permitida)
- ✅ Dar crédito apropriado
- ✅ Não republique texto integral sem permissão
- ✅ Use excertos (300-500 palavras)

### LGPD/GDPR
- ✅ Se coletar dados pessoais, anonimize
- ✅ Mantenha corpus privado (não publique em GitHub)
- ✅ Use para pesquisa interna apenas

---

## 📊 Formato Final de Saída

Após completar a coleta, estrutura final será:

```
dev/corpus-ai-detection/
├── PROMPTS.md                          # Prompts usados
├── metadata.csv                        # Info de todos os textos
├── analysis-results.csv                # Resultados AI Detection
├── generated/
│   ├── chatgpt-3.5/
│   │   ├── 001.md
│   │   ├── 002.md
│   │   └── ...
│   ├── chatgpt-4/
│   ├── claude/
│   ├── gemini/
│   └── meta/
├── human/
│   ├── published/
│   ├── indie/
│   ├── technical/
│   └── diverse/
├── analysis-results/
│   ├── chatgpt-3.5-001.json
│   ├── published-001.json
│   └── ...
└── README.md                           # Documentação do corpus
```

---

## 🎯 Próximos Passos

**Imediato (hoje)**:
1. [ ] Criar diretórios
2. [ ] Preparar templates
3. [ ] Listar prompts

**Esta semana**:
1. [ ] Gerar 20 textos IA
2. [ ] Coletar 20 textos humanos
3. [ ] Executar análise em todos

**Próxima semana**:
1. [ ] Compilar resultados
2. [ ] Documentar findings
3. [ ] Começar refinamento AI Detection

---

**Tempo Total Estimado**: 8-10 horas distribuídas em 2-3 semanas

Quer começar? Posso ajudar a criar os scripts para automatizar parte do processo ou preparar os templates exatos!
