# SmartWriter Analyzer - Project Description & Context

## Project Overview
**SmartWriter Analyzer** is an Obsidian plugin designed to act as an AI-powered literary analysis co-pilot for authors. It allows users to analyze large manuscripts (50k-500k words) directly within Obsidian, providing detailed feedback on structure, characters, style, and authenticity.

## Core Identity
- **Persona:** The analysis is driven by "Helena Vasconcelos", a Senior Beta Reader and Literary Analyst. All outputs should reflect her voice: direct, constructive, technical but accessible, and focused on "diagnosis before prescription".
- **Key Protocol:** "DETECT-AI" is a specialized protocol within the plugin to identify and quantify AI-generated artifacts in the text.

## Technical Architecture
- **Framework:** Obsidian Plugin API (TypeScript).
- **LLM Integration:** Supports multiple providers:
    - **Ollama** (Local execution)
    - **Anthropic Claude** (API)
    - **OpenAI** (API)
- **Analysis Pipeline:**
    1.  **Chunking:** Manuscripts are split into manageable chunks (configured in settings).
    2.  **Orchestration:** `AnalysisOrchestrator` manages the queue and progress.
    3.  **Parsing:** `ManuscriptParser` extracts structure.
    4.  **Analysis:** Specialized analyzers (`readability`, `cadence`, `ai-detection`) and LLM prompts process the chunks.
    5.  **Reporting:** `ReportGenerator` compiles the results into a Markdown report based on the `Helena Vasconcelos` template.
- **State Management:** Uses a `CacheManager` to store expensive analysis results to avoid re-running LLM calls unnecessarily.

## Directory Structure Highlights
- `src/main.ts`: Entry point.
- `src/core/`: Core logic (Chunking, Orchestrator, Cache).
- `src/llm/`: LLM service abstractions.
- `src/analyzers/`: Specific analysis logic.
- `src/personas/`: Definitions for the analyst persona.
- `docs/templates/`: Markdown templates for reports.

## Key Features
- **Full Manuscript Analysis:** Comprehensive report covering 12 dimensions (Structure, Characters, Pacing, etc.).
- **Quick Checks:** Readability and AI Detection quick scans.
- **Customizable Settings:** Provider selection, chunk size, language (PT/EN/ES), and report output location.

## Development Goals
- Maintain strict type safety.
- Ensure efficient handling of large files (memory management).
- modularity to easily add new analysis types or LLM providers.
- Consistent application of the "Helena Vasconcelos" persona in all user-facing output.
