# 🚀 Quick Start — Corpus AI Detection

**Status**: ✅ Estrutura criada e pronta!

---

## 📁 Estrutura Criada

```
dev/corpus-ai-detection/
├── generated/
│   ├── chatgpt-3.5/    ← Salve textos gerados aqui (001.md, 002.md, etc.)
│   ├── chatgpt-4/
│   ├── claude/
│   ├── gemini/
│   └── meta/
├── human/
│   ├── published/      ← Salve textos publicados aqui
│   ├── indie/          ← Textos de autores indie
│   ├── technical/      ← Artigos técnicos
│   └── diverse/        ← Outros (reviews, ensaios, etc.)
├── PROMPTS.md          ← Todos os prompts prontos
├── metadata.csv        ← Rastreia cada texto adicionado
├── TEMPLATE_GENERATED.md   ← Modelo para textos IA
├── TEMPLATE_HUMAN.md       ← Modelo para textos humanos
└── README.md
```

---

## 📋 Próximos Passos (Muito Simples)

### Passo 1: Ler os Prompts (5 min)

```bash
cat dev/corpus-ai-detection/PROMPTS.md
```

Você verá 8 prompts prontos para usar com ChatGPT 3.5, e assim por diante.

### Passo 2: Gerar Textos com IA (2-3 horas)

#### Para cada prompt:

**1. Abrir ChatGPT** (chatgpt.com)
**2. Copiar prompt exatamente de `PROMPTS.md`**
**3. Colar no ChatGPT e gerar**
**4. Copiar resposta completa**
**5. Salvar em arquivo**:

```bash
# Exemplo: Para ChatGPT 3.5, prompt #1
nano dev/corpus-ai-detection/generated/chatgpt-3.5/001.md
```

**6. Usar este template**:

```markdown
# AI Generated Text - ChatGPT 3.5

## Metadata
- **Model**: GPT-3.5-turbo
- **Date Generated**: 2026-01-13
- **Prompt Number**: 1
- **Word Count**: [contar palavras]
- **Language**: Portuguese (Brazil)
- **Label for Training**: GENERATED

## Prompt Used
[Copiar exatamente de PROMPTS.md]

## Generated Text
[Colar resposta do ChatGPT aqui - SEM EDITAR]

## Notes
- Unedited output from model
```

**7. Salvar arquivo** (Ctrl+O, Enter, Ctrl+X)

**8. Atualizar metadata.csv**:

```bash
# Abrir arquivo
nano dev/corpus-ai-detection/metadata.csv

# Adicionar linha:
chatgpt-3.5-001.md,ChatGPT 3.5,GENERATED,gpt-3.5-turbo,425,pt-BR,2026-01-13,original response
```

### Passo 3: Repetir para Todos os Modelos

- [ ] ChatGPT 3.5: 8 textos (uma hora)
- [ ] ChatGPT 4: 4 textos (30 min)
- [ ] Claude: 4 textos (30 min)
- [ ] Gemini: 2 textos (15 min)
- [ ] Meta Llama: 2 textos (15 min)

**Total**: ~2.5 horas

### Passo 4: Coletar Textos Humanos (2-3 horas)

#### Option 1: Clássicos (Domínio Público)

**Project Gutenberg** (www.gutenberg.org):
1. Buscar: "Machado de Assis" ou outro clássico
2. Selecionar "Plain Text UTF-8"
3. Copiar 300-500 palavras
4. Salvar em `dev/corpus-ai-detection/human/published/001.md`
5. Adicionar em metadata.csv

#### Option 2: Autores Indie

**Amazon Kindle** (amazon.com):
1. Buscar romance indie
2. Clicar "Look Inside" (amostra grátis)
3. Copiar trecho de 300-500 palavras
4. Salvar em `dev/corpus-ai-detection/human/indie/001.md`
5. Adicionar em metadata.csv

#### Option 3: Técnico

**Medium** (medium.com):
1. Buscar artigo sobre qualquer tema
2. Copiar 300-500 palavras
3. Salvar em `dev/corpus-ai-detection/human/technical/001.md`
4. Adicionar em metadata.csv

#### Option 4: Diverso

**Goodreads** (goodreads.com):
1. Encontrar review de livro
2. Copiar 300-500 palavras
3. Salvar em `dev/corpus-ai-detection/human/diverse/001.md`
4. Adicionar em metadata.csv

### Passo 5: Executar Análise (30 min)

```bash
# Quando terminar de coletar todos os 40 textos, rodar:
python3 dev/analyze-corpus.py

# Isso vai gerar:
# - dev/corpus-ai-detection/analysis-results/results.json
# - dev/corpus-ai-detection/analysis-results/report.md
```

### Passo 6: Revisar Resultados (30 min)

```bash
# Ver relatório em markdown
cat dev/corpus-ai-detection/analysis-results/report.md

# Ver resultados JSON (abrir em editor)
nano dev/corpus-ai-detection/analysis-results/results.json
```

---

## 🛠️ Comandos Úteis

```bash
# Ver quantos textos já foram coletados
find dev/corpus-ai-detection -name "*.md" -type f | wc -l

# Ver metadata coletado até agora
head -20 dev/corpus-ai-detection/metadata.csv

# Ver prompts disponíveis
cat dev/corpus-ai-detection/PROMPTS.md

# Listar todos os textos gerados
ls -la dev/corpus-ai-detection/generated/*/

# Listar todos os textos humanos
ls -la dev/corpus-ai-detection/human/*/
```

---

## 📊 Checklist Simples

```
GERAÇÃO (ChatGPT 3.5):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md
[ ] 005.md
[ ] 006.md
[ ] 007.md
[ ] 008.md

GERAÇÃO (ChatGPT 4):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md

GERAÇÃO (Claude):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md

GERAÇÃO (Gemini):
[ ] 001.md
[ ] 002.md

GERAÇÃO (Meta):
[ ] 001.md
[ ] 002.md

HUMANOS (Published):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md
[ ] 005.md

HUMANOS (Indie):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md
[ ] 005.md

HUMANOS (Technical):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md
[ ] 005.md

HUMANOS (Diverse):
[ ] 001.md
[ ] 002.md
[ ] 003.md
[ ] 004.md
[ ] 005.md

FINAL:
[ ] Metadata.csv preenchido (40 linhas)
[ ] python3 dev/analyze-corpus.py
[ ] report.md gerado
[ ] git add e commit
```

---

## 💡 Dicas Rápidas

1. **Copiar sem formatação**: Cole em editor de texto puro (nano, vim)
2. **Contar palavras rápido**: `wc -w < arquivo.md`
3. **Editar arquivo**: `nano dev/corpus-ai-detection/human/published/001.md`
4. **Ver arquivo**: `cat dev/corpus-ai-detection/generated/chatgpt-3.5/001.md`
5. **Backup**: `cp -r dev/corpus-ai-detection dev/corpus-ai-detection-backup`

---

## ⏱️ Tempo Total Estimado

- Geração textos IA: **2-3 horas**
- Coleta textos humanos: **2-3 horas**
- Documentação: **30 min**
- Análise: **30 min**
- **Total: ~6-7 horas distribuídas em 2 semanas**

---

## ✅ Próximo Passo

**Começar agora**:

```bash
# 1. Abrir PROMPTS.md e ler
cat dev/corpus-ai-detection/PROMPTS.md

# 2. Copiar primeiro prompt
# 3. Abrir ChatGPT e gerar
# 4. Salvar em generated/chatgpt-3.5/001.md
# 5. Adicionar em metadata.csv
# 6. Repetir para próximos textos
```

---

**Status**: 🟢 Pronto para começar!  
**Tempo até 40 textos coletados**: 6-7 horas  
**Data alvo para análise completa**: 20 de janeiro de 2026
