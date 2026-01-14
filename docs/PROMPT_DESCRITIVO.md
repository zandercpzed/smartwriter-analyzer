# Prompt Descritivo: SmartWriter Analyzer

## Visão Geral do Projeto

O **SmartWriter Analyzer** é um plugin avançado para Obsidian que utiliza IA (Claude, OpenAI ou modelos locais via Ollama) para análise profunda e personalizada de manuscritos literários de grande volume (50.000 a 500.000 palavras).

## Objetivo Principal

Automatizar e democratizar o processo de análise técnica e qualitativa de manuscritos literários, utilizando personas especializadas (começando com Helena Vasconcelos, Leitora Beta Sênior) para fornecer feedback técnico detalhado, estruturado e acionável.

## Características Principais

### 1. **Análise Multidimensional**
- **Readability**: Métricas técnicas (Flesch-Kincaid, SMOG, Gunning Fog, ARI)
- **Cadence**: Ritmo, pacing e variação de comprimento de sentenças/parágrafos
- **Coherence**: Consistência cronológica, geográfica, de personagens e plot holes
- **Literary Quality**: Análise estrutural (Save the Cat), arcos de personagem, voz, tema, autenticidade textual

### 2. **Sistema de Personas**
Leitores virtuais especializados com personalidades, princípios e tom definidos:
- **Helena Vasconcelos** (atual): Leitora Beta Sênior com 15 anos de experiência editorial
- Roadmap: Especialistas em estrutura, estilo, posicionamento de mercado

### 3. **Gestão de Grandes Documentos**
- Chunking inteligente para dividir manuscritos em partes analisáveis
- Sistema de cache para evitar reprocessamento desnecessário
- Orquestração de análise que combina múltiplos módulos

### 4. **Integração Nativa com Obsidian**
- Geração de relatórios como notas Markdown formatadas
- Modal interativo para seleção de tipos de análise
- Paleta de comandos intuitiva
- Barra de status com progresso

### 5. **Suporte a Múltiplos LLMs**
- Local: Ollama (llama3.1, Mistral, etc.)
- Cloud: Claude 3.5 Sonnet, OpenAI GPT-4
- Configuração flexível via settings

## Estrutura do Documento de Análise

O template de análise segue a persona Helena Vasconcelos com 12 seções:

1. **Sinopse Estrutural** — Premissa central e arco narrativo
2. **Estrutura Narrativa** — Análise Save the Cat, proporção de atos, timing
3. **Coerência e Coesão** — Plot holes, consistência, Chekhov's guns
4. **Personagens** — Want/Need/Flaw/Ghost/Lie, arcos de transformação
5. **Voz e Estilo** — Identificação de voz autoral e coerência estilística
6. **Ritmo e Pacing** — Distribuição de tensão, velocidade narrativa
7. **Worldbuilding e Cenário** — Construção do mundo, imersão
8. **Tema e Subtexto** — Mensagens temáticas, camadas de significado
9. **Conformidade de Gênero** — Aderência a convenções do gênero
10. **Análise de Autenticidade Textual** — Detecção de artefatos de IA (protocolo DETECT-AI)
11. **Glossário de Termos** — Definições de critérios usados
12. **Sumário Executivo** — Síntese com recomendações principais

Cada seção usa:
- **Escala 1-5** para avaliação
- **Exemplos concretos** retirados do manuscrito
- **Recomendações acionáveis** para melhoria
- **Equilíbrio** entre pontos fortes e áreas de desenvolvimento

## Públicos-Alvo

1. **Autores independentes** — Feedback técnico antes de publicação
2. **Editoras e casas editoriais** — Avaliação de candidatos ao catálogo
3. **Agentes literários** — Análise rápida de qualidade de manuscritos
4. **Escritores em desenvolvimento** — Educação sobre craft narrativo

## Diferencial Técnico

- **Chunking inteligente**: Análise de manuscritos longos sem perder contexto
- **Cache eficiente**: Reutilização de análises para speedup
- **Persona definida**: Consistência de tom e qualidade ao longo do tempo
- **Framework modular**: Fácil adição de novos analisadores ou personas
- **Integração seamless**: Funciona nativamente dentro do workflow Obsidian

## Termos-Chave do Domínio

- **Save the Cat**: Framework de estrutura narrativa (15 beats)
- **Want vs Need**: Desejo externo do protagonista vs. necessidade interna
- **Chekhov's Gun**: Princípio de que elementos plantados devem ter payoff
- **DETECT-AI Protocol**: Metodologia para identificação de texto gerado por IA
- **Plot Hole**: Inconsistência lógica na narrativa
- **Deus Ex Machina**: Resolução artificial/conveniente de conflito

## Status Atual (v0.1.0)

- ✅ Persona Helena Vasconcelos implementada
- ✅ Sistema de chunking e cache
- ✅ Análise de readability, cadence, coherence
- ✅ Modal de análise interativa
- ✅ Suporte a Ollama e APIs cloud
- ✅ Template de 12 seções
- 🚧 AI detection precisa de refinamento
- ⏳ Personas adicionais (estilo, estrutura, mercado)
- ⏳ Integração com feedback loops de melhoria

## Configuração Esperada

### Ambiente
- Obsidian 1.4.0+
- Node.js 20+ (para desenvolvimento)
- TypeScript 5.3+

### Dependências Principais
- `@anthropic-ai/sdk` (Claude API)
- `obsidian` (core API)
- ESBuild para bundling
- Jest para testes

### Extensibilidade
- Novas personas podem ser adicionadas sem modificar o core
- Novos analisadores (léxico-estilístico, emocional, etc.) em arquitetura preparada
- Sistema de plugins para integrações futuras
