# SmartWriter Analyzer

AI-powered literary analysis co-pilot for Obsidian. Analyzes readability, cadence, coherence, and literary quality of large manuscripts (50,000-500,000 words).

## Features

- **Large Manuscript Support**: Process manuscripts up to 500,000 words with intelligent chunking
- **Dual LLM Support**: Use local models via Ollama or cloud APIs (Claude, OpenAI)
- **Persona-Based Analysis**: Expert personas provide specialized feedback
- **Comprehensive Reports**: Readability, cadence, coherence, AI detection
- **Cache System**: Analysis results are cached for fast re-access
- **Native Obsidian Integration**: Reports generated as Markdown notes

## Installation

### From Community Plugins (Recommended)
1. Open Obsidian Settings → Community Plugins
2. Search for "SmartWriter Analyzer"
3. Click Install, then Enable

### Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create folder: `<vault>/.obsidian/plugins/smartwriter-analyzer/`
3. Copy downloaded files to the folder
4. Enable the plugin in Obsidian settings

## Usage

### Quick Start
1. Open a manuscript note (.md)
2. Use command palette: `SmartWriter: Analyze manuscript`
3. Select desired reports
4. Wait for analysis (progress shown in status bar)
5. Report opens in new note

### Commands
| Command | Description |
|---------|-------------|
| `Analyze manuscript` | Full analysis with report selection |
| `Quick readability check` | Fast readability metrics only |
| `Detect AI artifacts` | AI detection analysis |
| `Clear cache` | Remove cached analysis data |

### LLM Configuration

#### Local (Ollama)
1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama3.1` or `ollama pull mistral`
3. In plugin settings, set Provider to "Ollama"
4. Configure endpoint (default: `http://localhost:11434`)

#### Cloud (Claude/OpenAI)
1. In plugin settings, set Provider to "Claude" or "OpenAI"
2. Enter your API key
3. Select model

## Analysis Types

### 1. Readability Analysis
- Flesch-Kincaid Grade Level
- SMOG Index
- Gunning Fog Index
- Automated Readability Index (ARI)
- Average sentence/paragraph length

### 2. Cadence Analysis
- Sentence length variation (burstiness)
- Paragraph rhythm patterns
- Pacing distribution across chapters

### 3. Coherence Analysis
- Timeline consistency
- Character trait tracking
- Plot hole detection (Chekhov's guns)

### 4. Literary Quality (Persona: Helena Vasconcelos)
- Narrative structure (Save the Cat beats)
- Character arcs (Want/Need/Flaw/Ghost/Lie)
- Voice and style assessment
- Theme and subtext analysis
- AI artifact detection (DETECT-AI protocol)

## Personas

| Persona | Specialization | Output |
|---------|----------------|--------|
| Helena Vasconcelos | Technical literary analysis + AI detection | 12-section quality report |
| *[Coming Soon]* | Structural editing | Beat sheet analysis |
| *[Coming Soon]* | Style review | Micro-analysis |
| *[Coming Soon]* | Market positioning | Genre conformity |

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| LLM Provider | Ollama, Claude, or OpenAI | Ollama |
| API Endpoint | URL for Ollama or API | `http://localhost:11434` |
| API Key | For cloud providers | — |
| Model | Specific model to use | `llama3.1` |
| Chunk Size | Words per analysis chunk | 10,000 |
| Cache Duration | Days to keep cached results | 30 |
| Language | Analysis language | Portuguese |

## Requirements

- Obsidian v1.4.0+
- For local LLM: Ollama installed with 8GB+ RAM recommended
- For cloud: Valid API key

## Roadmap

- [ ] v0.1 - Core analysis + Helena persona
- [ ] v0.2 - Additional personas
- [ ] v0.3 - Academic/technical document analysis
- [ ] v0.4 - Screenwriting potential analysis
- [ ] v0.5 - Translation adequacy analysis

## Support

- [GitHub Issues](https://github.com/zedicoes/smartwriter-analyzer/issues)
- [Documentation](https://github.com/zedicoes/smartwriter-analyzer/wiki)

## License

MIT License - see [LICENSE](LICENSE)

---

Developed by [Z Edições](https://github.com/zedicoes)
