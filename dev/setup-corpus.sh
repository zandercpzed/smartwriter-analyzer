#!/bin/bash
# Setup script for AI Detection corpus

set -e

CORPUS_DIR="dev/corpus-ai-detection"

echo "🔧 Setting up AI Detection Corpus structure..."

# Create main directories
mkdir -p "$CORPUS_DIR/generated"/{chatgpt-3.5,chatgpt-4,claude,gemini,meta}
mkdir -p "$CORPUS_DIR/human"/{published,indie,technical,diverse}
mkdir -p "$CORPUS_DIR/analysis-results"

echo "✅ Directory structure created"

# Create metadata CSV header
cat > "$CORPUS_DIR/metadata.csv" << 'EOF'
filename,source,label,model,word_count,language,date_collected,notes
EOF

echo "✅ Metadata CSV created"

# Create PROMPTS.md
cat > "$CORPUS_DIR/PROMPTS.md" << 'EOF'
# Prompts for AI Text Generation

## ChatGPT 3.5 (8 prompts)

1. "Escreva um parágrafo de abertura para um romance de ficção científica que se passa em 2150"
2. "Descreva uma cena de confronto emocional intenso entre dois personagens que se amam"
3. "Escreva um diálogo natural sobre relacionamento amoroso entre dois adultos"
4. "Faça uma descrição vívida e detalhada de um cenário futurista e distópico"
5. "Escreva um trecho de reflexão de um personagem sobre tema: IA e humanidade"
6. "Gere uma sinopse detalhada de 200-250 palavras para um romance de mistério"
7. "Descreva um personagem principal de forma profunda, incluindo características físicas e psicológicas"
8. "Escreva uma cena de ação e perseguição em um cenário urbano moderno"

## ChatGPT 4 (4 prompts - subset do acima)

1. "Escreva um parágrafo de abertura para um romance de ficção científica que se passa em 2150"
2. "Descreva uma cena de confronto emocional intenso entre dois personagens"
3. "Escreva uma cena de ação em um cenário urbano"
4. "Gere uma sinopse de 200 palavras para um romance de mistério"

## Claude (4 prompts)

1. "Escreva uma cena de abertura de um romance literário contemporâneo que engaje o leitor"
2. "Descreva um conflito emocional profundo e authentically human entre personagens"
3. "Escreva diálogo natural e diferenciado entre personagens em um café"
4. "Crie uma descrição atmosférica e imersiva de um lugar abandonado"

## Gemini (2 prompts)

1. "Escreva uma cena literária de abertura de um livro"
2. "Descreva personagens em interação emocional genuína"

## Meta Llama (2 prompts - se disponível via Ollama)

1. "Escreva um parágrafo literário de um romance"
2. "Descreva uma cena narrativa"

---

## Instructions for Generation

1. Use exact prompt as listed
2. Copy full response WITHOUT editing
3. Document the prompt used
4. Note any parameters (temperature, max tokens, etc.)
5. Save as markdown with metadata header
EOF

echo "✅ PROMPTS.md created"

# Create template file
cat > "$CORPUS_DIR/TEMPLATE_GENERATED.md" << 'EOF'
# AI Generated Text - [MODEL NAME]

## Metadata
- **Model**: [e.g., GPT-3.5-turbo, GPT-4, Claude-3-Sonnet, Gemini-2.0-Flash]
- **Date Generated**: YYYY-MM-DD
- **Prompt Number**: [1-8]
- **Word Count**: XXX
- **Language**: Portuguese (Brazil)
- **Label for Training**: GENERATED

## Prompt Used
[Copiar exatamente o prompt do PROMPTS.md]

## Generated Text
[Copiar exatamente a resposta do modelo, sem edições]

## Notes
- Unedited output from model
- No manual revisions or corrections
- Original response as generated
EOF

cat > "$CORPUS_DIR/TEMPLATE_HUMAN.md" << 'EOF'
# Human Written Text - [CATEGORY]

## Metadata
- **Author**: [Nome do autor]
- **Source**: [Título da obra/artigo]
- **Publication Date**: YYYY
- **Word Count**: XXX
- **Language**: Portuguese (Brazil)
- **Label for Training**: HUMAN
- **Collection Date**: YYYY-MM-DD

## Source Information
- **Category**: [Published/Indie/Technical/Diverse]
- **Genre**: [Romance/Técnico/Ensaio/etc]
- **License/Availability**: [Domínio Público/CC License/Citação permitida/etc]
- **Source URL**: [Link para fonte]

## Text
[Copiar exatamente o trecho, com créditos se necessário]

## Metadata Notes
- [Observações sobre estilo, qualidade, etc.]
EOF

echo "✅ Template files created"

# Create README for corpus
cat > "$CORPUS_DIR/README.md" << 'EOF'
# AI Detection Corpus

Corpus of ~40 texts for training and validating AI text detection algorithm.

## Structure

```
corpus-ai-detection/
├── generated/          # Texts known to be AI-generated (20)
│   ├── chatgpt-3.5/   (8)
│   ├── chatgpt-4/     (4)
│   ├── claude/        (4)
│   ├── gemini/        (2)
│   └── meta/          (2)
├── human/             # Texts known to be human-written (20)
│   ├── published/     (5) - Classics and published literature
│   ├── indie/         (5) - Self-published authors
│   ├── technical/     (5) - Technical articles and essays
│   └── diverse/       (5) - Reviews, blogs, misc
├── PROMPTS.md         # Exact prompts used for generation
├── metadata.csv       # Metadata for all texts
├── analysis-results/  # DETECT-AI analysis results
└── README.md          # This file
```

## Usage

1. **Generation Phase** (Week 1-2)
   - Use PROMPTS.md to generate texts with AI models
   - Collect human texts from sources listed
   - Save each with appropriate template
   - Update metadata.csv

2. **Analysis Phase** (Week 3)
   - Run AI Detection algorithm on all texts
   - Store results in analysis-results/
   - Compile accuracy metrics

3. **Validation Phase** (Week 4)
   - Analyze false positives/negatives
   - Calibrate confidence thresholds
   - Document findings

## Status

- [ ] Directory structure created
- [ ] Templates ready
- [ ] Prompts documented
- [ ] AI texts generated (0/20)
- [ ] Human texts collected (0/20)
- [ ] Analysis completed
- [ ] Results compiled
- [ ] Documentation finalized

## Notes

- Keep texts 300-500 words each for consistency
- Document all sources and permissions
- Store analysis results as JSON
- Do not commit full corpus to public GitHub (privacy/licensing)
EOF

echo "✅ README.md created"

echo ""
echo "🎉 Corpus setup complete!"
echo ""
echo "📁 Created structure at: $CORPUS_DIR"
echo ""
echo "📋 Next steps:"
echo "   1. Review PROMPTS.md"
echo "   2. Start generating texts with AI models"
echo "   3. Collect human texts from sources"
echo "   4. Update metadata.csv as you add files"
echo "   5. Run AI Detection analysis"
echo ""
echo "📖 For detailed instructions, see: $CORPUS_DIR/AI_DETECTION_CORPUS.md"
