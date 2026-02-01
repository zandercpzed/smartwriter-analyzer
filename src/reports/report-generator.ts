// src/reports/report-generator.ts
// Generates Markdown reports from analysis results

import { 
	SmartWriterSettings, 
	FullReport, 
	ReadabilityMetrics,
	CadenceMetrics,
	AIDetectionResult,
	StructureAnalysis,
	LiteraryQualityReport,
	ExecutiveSummary,
} from '../types';

export class ReportGenerator {
	private settings: SmartWriterSettings;

	constructor(settings: SmartWriterSettings) {
		this.settings = settings;
	}

	generate(report: FullReport): string {
		const sections: string[] = [];

		// Header
		sections.push(this.generateHeader(report));

		// Executive Summary (always first)
		sections.push(this.generateExecutiveSummary(report.executiveSummary));

		// Readability
		if (report.readability) {
			sections.push(this.generateReadabilitySection(report.readability));
		}

		// Cadence
		if (report.cadence) {
			sections.push(this.generateCadenceSection(report.cadence));
		}

		// AI Detection
		if (report.aiDetection) {
			sections.push(this.generateAIDetectionSection(report.aiDetection));
		}

		// Structure
		if (report.structure) {
			sections.push(this.generateStructureSection(report.structure));
		}

		// Literary Quality
		if (report.literaryQuality) {
			sections.push(this.generateLiteraryQualitySection(report.literaryQuality));
		}

		// Footer
		sections.push(this.generateFooter(report));

		return sections.join('\n\n---\n\n');
	}

	private generateHeader(report: FullReport): string {
		return `---
title: "Análise: ${report.metadata.manuscriptTitle}"
date: ${report.metadata.analysisDate}
plugin: SmartWriter Analyzer v${report.metadata.version}
persona: ${report.metadata.persona}
---

# 📊 Relatório de Análise

**Manuscrito:** ${report.metadata.manuscriptTitle}
**Palavras:** ${report.metadata.wordCount.toLocaleString()}
**Capítulos:** ${report.metadata.chapterCount}
**Data da Análise:** ${new Date(report.metadata.analysisDate).toLocaleDateString('pt-BR')}`;
	}

	private generateExecutiveSummary(summary: ExecutiveSummary): string {
		const recommendationLabels: Record<ExecutiveSummary['recommendation'], string> = {
			'structural-revision': '🔴 Revisão Estrutural',
			'developmental-editing': '🟠 Edição de Desenvolvimento',
			'line-editing': '🟡 Edição de Linha',
			'copyediting': '🟢 Copyediting',
			'ready-for-submission': '✅ Pronto para Submissão',
		};

		let content = `## 📋 Sumário Executivo

### Recomendação
${recommendationLabels[summary.recommendation]}

### Scores
| Dimensão | Score |
|----------|-------|
`;

		for (const [key, value] of Object.entries(summary.scores)) {
			const label = this.formatScoreLabel(key);
			const stars = this.getStars(value);
			content += `| ${label} | ${stars} (${value}/5) |\n`;
		}

		if (summary.strengths.length > 0) {
			content += `\n### ✅ Pontos Fortes\n`;
			for (const strength of summary.strengths) {
				content += `- ${strength}\n`;
			}
		}

		if (summary.improvements.length > 0) {
			content += `\n### 🔧 Áreas de Melhoria\n`;

			const byPriority = {
				high: summary.improvements.filter(i => i.priority === 'high'),
				medium: summary.improvements.filter(i => i.priority === 'medium'),
				low: summary.improvements.filter(i => i.priority === 'low'),
			};

			if (byPriority.high.length > 0) {
				content += `\n#### 🔴 Alta Prioridade\n`;
				for (const imp of byPriority.high) {
					content += `- **${imp.area}**: ${imp.description}\n  - *Sugestão:* ${imp.suggestion}\n`;
				}
			}

			if (byPriority.medium.length > 0) {
				content += `\n#### 🟡 Média Prioridade\n`;
				for (const imp of byPriority.medium) {
					content += `- **${imp.area}**: ${imp.description}\n  - *Sugestão:* ${imp.suggestion}\n`;
				}
			}

			if (byPriority.low.length > 0) {
				content += `\n#### 🟢 Baixa Prioridade\n`;
				for (const imp of byPriority.low) {
					content += `- **${imp.area}**: ${imp.description}\n  - *Sugestão:* ${imp.suggestion}\n`;
				}
			}
		}

		if (summary.notes) {
			content += `\n> ${summary.notes}`;
		}

		return content;
	}

	private generateReadabilitySection(metrics: ReadabilityMetrics): string {
		const interpretation = this.interpretReadability(metrics.fleschKincaid);

		return `## 📖 Legibilidade

### Métricas

| Índice | Valor | Interpretação |
|--------|-------|---------------|
| Flesch-Kincaid | ${metrics.fleschKincaid.toFixed(1)} | ${interpretation.level} |
| SMOG | ${metrics.smog.toFixed(1)} | ${metrics.smog.toFixed(0)} anos de educação |
| Gunning Fog | ${metrics.gunningFog.toFixed(1)} | ${this.interpretFog(metrics.gunningFog)} |
| ARI | ${metrics.ari.toFixed(1)} | Nível ${Math.round(metrics.ari)} |

### Estatísticas

| Métrica | Valor |
|---------|-------|
| Média de palavras por frase | ${metrics.avgSentenceLength.toFixed(1)} |
| Média de palavras por parágrafo | ${metrics.avgParagraphLength.toFixed(1)} |
| Média de caracteres por palavra | ${metrics.avgWordLength.toFixed(1)} |
| Razão de palavras complexas | ${(metrics.complexWordRatio * 100).toFixed(1)}% |

### Análise
${interpretation.audience}. ${interpretation.suggestion}`;
	}

	private generateCadenceSection(metrics: CadenceMetrics): string {
		const rhythmLabels = {
			uniform: '⚠️ Uniforme (monótono)',
			varied: '✅ Variado (natural)',
			chaotic: '⚠️ Caótico (irregular)',
		};

		let content = `## 🎵 Cadência e Ritmo

### Métricas Globais

| Métrica | Valor | Avaliação |
|---------|-------|-----------|
| Burstiness | ${(metrics.burstiness * 100).toFixed(1)}% | ${metrics.burstiness > 0.2 ? '✅ Bom' : '⚠️ Baixo'} |
| Variância de Frases | ${metrics.sentenceLengthVariance.toFixed(1)} | — |
| Variância de Parágrafos | ${metrics.paragraphLengthVariance.toFixed(1)} | — |
| Padrão Rítmico | — | ${rhythmLabels[metrics.rhythmPattern]} |

### Pacing por Capítulo

| Capítulo | Média Palavras/Frase | Burstiness | Ritmo |
|----------|---------------------|------------|-------|
`;

		for (const chapter of metrics.pacingByChapter.slice(0, 20)) {
			const paceEmoji = chapter.paceCategory === 'fast' ? '🏃' : 
				chapter.paceCategory === 'slow' ? '🐢' : '🚶';
			content += `| Cap. ${chapter.chapter} | ${chapter.avgSentenceLength.toFixed(1)} | ${(chapter.burstiness * 100).toFixed(0)}% | ${paceEmoji} ${chapter.paceCategory} |\n`;
		}

		if (metrics.pacingByChapter.length > 20) {
			content += `\n*... e mais ${metrics.pacingByChapter.length - 20} capítulos*`;
		}

		return content;
	}

	private generateAIDetectionSection(result: AIDetectionResult): string {
		const classificationLabels = {
			'authentic': '✅ Autêntico',
			'assisted': '🔵 Assistido por IA',
			'hybrid': '🟡 Híbrido',
			'predominantly-ai': '🟠 Predominantemente IA',
			'ai-generated': '🔴 Gerado por IA',
		};

		let content = `## 🤖 Análise de Autenticidade (DETECT-AI)

### Índice de Uso de LLM (IUL)

\`\`\`
IUL: ${result.iul}%
Classificação: ${classificationLabels[result.classification]}

[${this.generateIULBar(result.iul)}] ${result.iul}%
  0%        35%        60%        85%       100%
  Autêntico | Híbrido  | Predom.IA | Gerado IA
\`\`\`

### Escala de Interpretação

| Faixa | Classificação | Descrição |
|-------|---------------|-----------|
| 0-15% | Autêntico | Texto predominantemente humano |
| 16-35% | Assistido | Possível uso de ferramentas de IA como apoio |
| 36-60% | Híbrido | Mistura significativa de conteúdo humano e IA |
| 61-85% | Predom. IA | Maior parte gerada por IA |
| 86-100% | Gerado por IA | Quase totalmente gerado por IA |

`;

		if (result.artifacts.length > 0) {
			content += `### Artefatos Detectados

| Código | Categoria | Marcador | Peso | Instâncias |
|--------|-----------|----------|------|------------|
`;
			for (const artifact of result.artifacts) {
				const weightEmoji = artifact.weight === 'high' ? '🔴' : 
					artifact.weight === 'medium' ? '🟡' : '🟢';
				content += `| ${artifact.code} | ${artifact.category} | ${artifact.marker} | ${weightEmoji} | ${artifact.instances.length} |\n`;
			}
		}

		if (result.sampleAnalysis.length > 0) {
			content += `\n### Análise por Amostra

| Amostra | Localização | Palavras | IUL Local | Artefatos |
|---------|-------------|----------|-----------|-----------|
`;
			for (const sample of result.sampleAnalysis) {
				content += `| ${sample.sampleIndex + 1} | ${sample.location} | ${sample.wordCount} | ${sample.localIul}% | ${sample.artifactsFound.join(', ') || '—'} |\n`;
			}
		}

		return content;
	}

	private generateStructureSection(structure: StructureAnalysis): string {
		let content = `## 🏗️ Estrutura Narrativa

### Proporção dos Atos

| Ato | Proporção | Ideal | Status |
|-----|-----------|-------|--------|
| Ato 1 (Setup) | ${structure.acts.act1Percentage}% | 25% | ${this.getProportionStatus(structure.acts.act1Percentage, 25)} |
| Ato 2 (Confronto) | ${structure.acts.act2Percentage}% | 50% | ${this.getProportionStatus(structure.acts.act2Percentage, 50)} |
| Ato 3 (Resolução) | ${structure.acts.act3Percentage}% | 25% | ${this.getProportionStatus(structure.acts.act3Percentage, 25)} |

**Score de Balanceamento:** ${this.getStars(structure.acts.balanceScore)} (${structure.acts.balanceScore}/5)

### Save the Cat Beats

| Beat | Presente | Posição | Capítulo | Eficácia |
|------|----------|---------|----------|----------|
`;

		for (const beat of structure.beats) {
			const presentEmoji = beat.present ? '✅' : '❌';
			content += `| ${beat.name} | ${presentEmoji} | ${beat.position}% | Cap. ${beat.chapter} | ${this.getStars(beat.efficacy)} |\n`;
		}

		content += `\n### Turning Points

| Ponto | Capítulo | Posição | Força |
|-------|----------|---------|-------|
`;

		for (const tp of structure.turningPoints) {
			content += `| ${tp.name} | Cap. ${tp.chapter} | ${tp.position}% | ${this.getStars(tp.strength)} |\n`;
		}

		content += `\n### Causalidade
**Score:** ${this.getStars(structure.causalityScore)} (${structure.causalityScore}/5)

> A causalidade mede o quão bem os eventos da história seguem uma lógica de causa e efeito.`;

		return content;
	}

	private generateLiteraryQualitySection(quality: LiteraryQualityReport): string {
		let content = `## 📚 Qualidade Literária

> *Análise realizada pela persona Helena Vasconcelos*

### Sinopse Estrutural

${quality.synopsis}

### Scores por Dimensão

| Dimensão | Score | Avaliação |
|----------|-------|-----------|
| Estrutura | ${this.getStars(quality.structureScore)} | ${quality.structureScore}/5 |
| Coerência | ${this.getStars(quality.coherenceScore)} | ${quality.coherenceScore}/5 |
| Personagens | ${this.getStars(quality.charactersScore)} | ${quality.charactersScore}/5 |
| Voz e Estilo | ${this.getStars(quality.voiceScore)} | ${quality.voiceScore}/5 |
| Pacing | ${this.getStars(quality.pacingScore)} | ${quality.pacingScore}/5 |
| Worldbuilding | ${this.getStars(quality.worldbuildingScore)} | ${quality.worldbuildingScore}/5 |
| Tema | ${this.getStars(quality.themeScore)} | ${quality.themeScore}/5 |
| Conformidade de Gênero | ${this.getStars(quality.genreConformityScore)} | ${quality.genreConformityScore}/5 |
| **OVERALL** | **${this.getStars(quality.overallScore)}** | **${quality.overallScore}/5** |

`;

		if (quality.strengths.length > 0) {
			content += `### Pontos Fortes Identificados\n`;
			for (const strength of quality.strengths) {
				content += `- ${strength}\n`;
			}
		}

		if (quality.improvements.length > 0) {
			content += `\n### Recomendações de Melhoria\n`;
			for (const imp of quality.improvements) {
				const priorityEmoji = imp.priority === 'high' ? '🔴' : 
					imp.priority === 'medium' ? '🟡' : '🟢';
				content += `\n#### ${priorityEmoji} ${imp.area}\n`;
				content += `${imp.description}\n\n`;
				content += `> **Sugestão:** ${imp.suggestion}\n`;
			}
		}

		return content;
	}

	private generateFooter(report: FullReport): string {
		return `## 📝 Notas

Este relatório foi gerado automaticamente pelo **SmartWriter Analyzer** v${report.metadata.version}.

- **Persona:** ${report.metadata.persona === 'helena-vasconcelos' ? 'Helena Vasconcelos (Analista Literária Técnica)' : 'Análise Computacional'}
- **Metodologia:** Combinação de análise computacional e assistência de LLM
- **Limitações:** Este relatório é uma ferramenta de apoio à edição e não substitui a avaliação humana qualificada.

---

*Gerado em ${new Date(report.metadata.analysisDate).toLocaleString('pt-BR')}*`;
	}

	// Helper methods

	private getStars(score: number): string {
		const fullStars = Math.floor(score);
		const hasHalf = score - fullStars >= 0.5;
		let stars = '★'.repeat(fullStars);
		if (hasHalf) stars += '½';
		stars += '☆'.repeat(5 - Math.ceil(score));
		return stars;
	}

	private formatScoreLabel(key: string): string {
		const labels: Record<string, string> = {
			readability: 'Legibilidade',
			cadence: 'Cadência',
			authenticity: 'Autenticidade',
			structure: 'Estrutura',
			coherence: 'Coerência',
			characters: 'Personagens',
			voice: 'Voz/Estilo',
			pacing: 'Pacing',
			worldbuilding: 'Worldbuilding',
			theme: 'Tema',
		};
		return labels[key] || key;
	}

	private interpretReadability(fk: number): { level: string; audience: string; suggestion: string } {
		if (fk <= 6) {
			return {
				level: 'Muito Fácil',
				audience: 'Apropriado para leitores jovens ou iniciantes',
				suggestion: 'O texto é muito acessível.',
			};
		} else if (fk <= 8) {
			return {
				level: 'Fácil',
				audience: 'Bom para público geral e ficção comercial',
				suggestion: 'Nível ideal para ficção de massa.',
			};
		} else if (fk <= 10) {
			return {
				level: 'Moderado',
				audience: 'Adequado para ficção adulta e não-ficção acessível',
				suggestion: 'Equilíbrio entre acessibilidade e profundidade.',
			};
		} else if (fk <= 12) {
			return {
				level: 'Moderadamente Difícil',
				audience: 'Apropriado para ficção literária',
				suggestion: 'Considere se o público-alvo comporta esta complexidade.',
			};
		} else if (fk <= 14) {
			return {
				level: 'Difícil',
				audience: 'Nível universitário',
				suggestion: 'Pode ser complexo demais para públicos amplos.',
			};
		} else {
			return {
				level: 'Muito Difícil',
				audience: 'Nível acadêmico/especializado',
				suggestion: 'Simplificação recomendada para públicos gerais.',
			};
		}
	}

	private interpretFog(fog: number): string {
		if (fog <= 8) return 'Fácil';
		if (fog <= 10) return 'Médio';
		if (fog <= 12) return 'Difícil';
		return 'Muito Difícil';
	}

	private generateIULBar(iul: number): string {
		const totalWidth = 40;
		const filled = Math.round((iul / 100) * totalWidth);
		return '█'.repeat(filled) + '░'.repeat(totalWidth - filled);
	}

	private getProportionStatus(actual: number, ideal: number): string {
		const diff = Math.abs(actual - ideal);
		if (diff <= 5) return '✅';
		if (diff <= 10) return '⚠️';
		return '❌';
	}
}
