# Changelog — SmartWriter Analyzer

Todas as mudanças notáveis neste projeto estão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Helena Vasconcelos persona with 12-section analysis template
- Readability analysis (Flesch-Kincaid, SMOG, Gunning Fog, ARI metrics)
- Cadence analysis (rhythm patterns, sentence variation)
- Coherence validation (plot holes, character consistency tracking)
- AI artifact detection (DETECT-AI protocol)
- Manuscript parser with chapter detection
- Intelligent chunking system for large documents (50k-500k words)
- Cache management for efficient re-analysis
- LLM service with support for Claude, OpenAI, and Ollama
- Obsidian plugin UI (modal, settings tab, commands)
- Documentation for development and deployment

### Changed
- Fixed TypeScript type assertions in dropdown handlers
- Improved JSON parsing with safe type guards

### Fixed
- Resolved TypeScript compilation errors

---

## [0.1.0] — 2026-01-13

### Added
- Initial release (MVP)
- Core analysis infrastructure
- Basic UI and commands
- First iteration of all major components

### Status
- ✅ Compiles without errors
- ✅ Core features functional
- ✅ Ready for Phase 1 stabilization
- 🚧 AI detection needs refinement
- 🚧 Comprehensive testing needed

---

## Version Guidelines

### Semantic Versioning (semver)

Format: `MAJOR.MINOR.PATCH`

**MAJOR** (X.0.0)
- Breaking changes to API or analysis output
- Significant architectural changes
- Incompatible with previous versions

**MINOR** (x.Y.0)
- New features (backwards compatible)
- New personas or analyzers
- Enhancement to existing functionality

**PATCH** (x.y.Z)
- Bug fixes
- Documentation updates
- Performance improvements

### Examples

```
0.1.0 → 0.2.0  (Add new analyzer)
0.2.0 → 0.2.1  (Fix bug in readability calculation)
0.2.1 → 1.0.0  (First stable release)
1.0.0 → 1.1.0  (Add new persona)
1.1.0 → 2.0.0  (Redesign API)
```

### Version Format

- ✅ Correct: `1.0.0`, `0.2.5`, `2.3.0`
- ❌ Incorrect: `1.0`, `v1.0.0`, `1.0-alpha`, `1.0.0.0`

---

## How to Update CHANGELOG

When making a release:

1. **Update version in manifest.json**
   ```json
   "version": "1.0.0"
   ```

2. **Move [Unreleased] to new version**
   ```markdown
   ## [1.0.0] — 2026-01-15
   ```

3. **Add new [Unreleased] section**
   ```markdown
   ## [Unreleased]

   ### Added

   ### Changed

   ### Fixed

   ### Removed

   ### Deprecated
   ```

4. **Commit with proper message**
   ```bash
   git commit -m "chore(release): bump version to 1.0.0

   - List major changes
   - Link to issues if applicable"
   ```

5. **Create git tag**
   ```bash
   git tag v1.0.0
   ```

---

## Entry Categories

Use these categories in CHANGELOG:

- **Added** — New features
- **Changed** — Changes in existing functionality
- **Deprecated** — Soon-to-be removed features
- **Removed** — Removed features
- **Fixed** — Bug fixes
- **Security** — Vulnerability fixes

---

## Release Process

### Phase 1 → v1.0.0

```
Phase 1: Stabilization (Current)
├─ Complete AI detection
├─ Add comprehensive tests
├─ Refine documentation
└─ → v1.0.0 Release

Checklist for v1.0.0:
- [ ] All Phase 1 work items done
- [ ] 70%+ test coverage
- [ ] README comprehensive
- [ ] 0 critical/high priority bugs
- [ ] Manual testing with real manuscripts
- [ ] CHANGELOG updated
- [ ] manifest.json version updated
```

### v1.0.0 → v1.1.0

```
Phase 2: New Personas (After v1.0.0)
├─ Persona: Estrutura
├─ Persona: Estilo
├─ Persona: Mercado
└─ → v1.1.0 Release
```

### v2.0.0

```
Phase 3-4: Major Features (Future)
├─ Intelligence layer
├─ API REST
├─ Multiple LLM support
├─ Community features
└─ → v2.0.0 Release
```

---

## Announcement Template

When releasing to community:

```markdown
## SmartWriter Analyzer v1.0.0 Released 🎉

We're excited to announce the first stable release of SmartWriter Analyzer!

### Highlights
- [List 3-5 key features]
- [Performance improvements]
- [Bugfixes]

### Downloads
- [Obsidian Community Plugins](https://obsidian.md/plugins?id=smartwriter-analyzer)
- [GitHub Release](https://github.com/zandercpzed/smartwriter-analyzer/releases/tag/v1.0.0)

### Changelog
[Link to CHANGELOG.md or summary]

### What's Next
- Phase 2: Additional personas (Q1 2026)
- Phase 3: Intelligence layer (Q2 2026)

Thanks to all contributors and beta testers! 🙏
```

---

## Notes

- Update CHANGELOG before creating release
- Keep entries concise but descriptive
- Link to relevant issues when applicable
- Focus on user-facing changes
- Internal refactoring goes in "Changed" if impactful, or omit if minor

---

**Last Updated**: 2026-01-13
