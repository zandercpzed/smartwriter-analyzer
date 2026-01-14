# Development Plan - SmartWriter Analyzer

This document outlines the strategic roadmap for the development of SmartWriter Analyzer. It focuses on architectural improvements, feature expansion, and stability, without binding to specific calendar dates.

## Phase 1: Core Stability & Architecture Foundation
*Focus: Ensure the plugin is robust, handles errors gracefully, and manages resources efficiently.*

- [x] **Robust Error Handling**: Implement comprehensive error catching in the `AnalysisOrchestrator` to prevent plugin crashes during long analyses. Add retry logic for failed LLM API calls.
- [x] **Memory Management Optimization**: Refine the `ChunkManager` and `ManuscriptParser` to handle extremely large manuscripts (>200k words) without freezing Obsidian. Optimized regex-based counting and chapter parsing.
- [x] **Enhanced Caching Strategy**: Improved `CacheManager` to invalidate cache intelligently based on content hash per analysis entry.
- [x] **Unit & Integration Testing**: Set up Jest testing framework with mocks for Obsidian API. Initial tests for `ManuscriptParser` are passing.

## Phase 2: Analyzer Engine Expansion
*Focus: Deepen the analytical capabilities and refine the "Helena Vasconcelos" persona implementation.*

- [ ] **Full DETECT-AI Implementation**: rigorous implementation of the AI detection logic described in the persona document, possibly combining statistical heuristics (entropy, perplexity approximation) with LLM evaluation.
- [ ] **Structural Analysis Module**: Implement a dedicated analyzer for "Save the Cat" beat sheet extraction using the LLM to identify plot points.
- [ ] **Character Profiler**: Create a module to track character occurrences and sentiment/agency throughout the manuscript chunks to build dynamic character arcs.
- [ ] **Prompt Engineering Refinement**: Systematically test and refine prompts to ensure the "Helena Vasconcelos" voice is consistent and the feedback is actionable and specific, not generic.

## Phase 3: User Experience & Interface
*Focus: Make the analysis results more accessible and interactive.*

- [ ] **Interactive Dashboard**: Move beyond static Markdown reports. Create a React-based view within Obsidian to display graphs (sentiment arcs, pacing curves) and interactive report sections.
- [ ] **Inline Suggestions**: (Experimental) Display analysis flags directly in the editor gutter or as highlights (similar to spell-check) for things like "passive voice" or "AI artifacts".
- [ ] **Progress Visualization**: Improve the progress bar to show detailed status (e.g., "Analyzing Chapter 3...", "Generating Character Report...").
- [ ] **Settings UI Overhaul**: Organize settings into collapsible sections or tabs for better usability as options grow.

## Phase 4: Ecosystem & Extensibility
*Focus: Allow users to customize and extend the tool.*

- [ ] **Custom Persona Support**: Architecture to allow users to define their own analyst personas (e.g., "Romance Expert", "Thriller Specialist") with custom prompts.
- [ ] **Template Editor**: UI to modify the output report template without editing files directly.
- [ ] **Export Options**: Export reports to PDF or HTML with proper styling.
- [ ] **Multi-Language Enhancements**: rigorous verification and tuning of prompts for English and Spanish support (alongside the primary Portuguese).

## Technical Debt & Maintenance
- **Refactoring**: Regularly audit `src/analyzers` to ensure separation of concerns.
- **Documentation**: Keep `docs/` updated with architectural decisions and API changes.
- **Dependency Management**: Monitor and update LLM SDKs and Obsidian API types.
