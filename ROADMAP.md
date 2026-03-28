# ROADMAP — SmartWriter Analyzer

Status: **In progress**  
Target release: **v0.2.0** (finalization)

## Objective ✅
Finalize and release **v0.2.0** with a robust persona system (2–3 core personas), UI for persona selection, prompt versioning, tests and documentation.

---

## v0.2.0 — Finalization Plan (phases)

### Phase 1 — Core & Infrastructure (1 week)
- [ ] Define `Persona` interface and `PersonaType` (types) — 0.5 day
- [ ] Add persona registry / factory (`src/personas/index.ts`) — 0.5 day
- [ ] Update `AnalysisOrchestrator` to use selected persona from request — 1 day
- [ ] Add persona default setting to `SmartWriterSettings` and UI hook — 0.5 day

### Phase 2 — Persona Implementations (2–3 weeks per persona; incremental)
- [ ] Implement `helena-vasconcelos` canonical persona (refactor into persona interface) — 1–2 days
- [ ] Implement `structure-specialist` (Save the Cat, acts/beats) — 1 week
- [ ] Implement `style-coach` (voice, sentence-level guidance) — 1 week
- [ ] Implement `market-strategist` (genre/positioning insights) — 1 week

> Note: Start with 2 personas (structure + style) for v0.2.0 and add the rest in minor releases.

### Phase 3 — UI, Settings & Selection (3 days)
- [ ] Add persona selector to `AnalysisModal` (per-analysis dropdown) — 1 day
- [ ] Add default persona option in settings tab — 0.5 day
- [ ] Allow selecting multiple personas for an analysis run (optional) — 1.5 days

### Phase 4 — Testing & Validation (1 week)
- [ ] Unit tests for persona registry & selection — 1 day
- [ ] Integration tests for end-to-end analysis with mocked LLMService — 2 days
- [ ] Human review of prompts & tuning with sample manuscripts — 2–3 days

### Phase 5 — Docs & Release (3 days)
- [ ] Normalize `_docs/prompt-personas/*` into canonical format — 1 day
- [ ] Add `PROMPT_VERSION` and example usage docs — 0.5 day
- [ ] Update `_docs/STATUS_ATUAL.md`, `README.md`, and release notes — 0.5 day
- [ ] Publish `v0.2.0` release and tag — 0.5 day

---

## Acceptance Criteria
- Persona interface exists and is used by orchestrator
- At least 2 additional personas implemented and documented
- UI allows choosing persona(s) and default is persisted in settings
- Tests (unit + integration) cover persona lifecycle
- Release notes and `_docs` updated; milestone closed

---

## Quick Links
- `_docs/PLANEJAMENTO_DESENVOLVIMENTO.md` — planning & sprints
- `_docs/propmt personas/` — legacy persona files
- `src/personas/` — code implementations

---

_Last updated: 2026-02-01_
