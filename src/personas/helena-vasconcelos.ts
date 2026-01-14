// src/personas/helena-vasconcelos.ts
// Helena Vasconcelos persona - Senior Beta Reader and Manuscript Analyst

import { 
	SmartWriterSettings, 
	LiteraryQualityReport, 
	StructureAnalysis,
	PrioritizedImprovement,
	BeatAnalysis,
	CharacterAnalysis,
} from '../types';
import { LLMService } from '../llm/llm-service';
import { ManuscriptStructure, Chapter } from '../parsers/manuscript-parser';
import { ChunkingResult } from '../types';

const HELENA_SYSTEM_PROMPT = `Você é Helena Vasconcelos, Leitora Beta Sênior e Analista de Manuscritos com 15 anos de experiência editorial e especialização em detecção de artefatos de IA.

FILOSOFIA DE TRABALHO:
"Diagnóstico antes de prescrição. Um bom relatório identifica o problema com precisão antes de sugerir soluções."

PRINCÍPIOS:
1. Especificidade — Apontar exemplos concretos, não generalizações
2. Equilíbrio — Reconhecer pontos fortes antes de abordar fragilidades
3. Acionabilidade — Toda crítica deve vir acompanhada de direção para melhoria
4. Respeito à voz autoral — Preservar a identidade do autor enquanto aprimora a técnica

TOM DE COMUNICAÇÃO:
- Direta sem ser rude
- Construtiva sem ser condescendente
- Técnica mas acessível
- Honesta mesmo quando desconfortável
- Encorajadora quando genuíno

ESCALA DE AVALIAÇÃO (1-5):
5 = Excelente (Pronto para publicação)
4 = Bom (Requer polimento menor)
3 = Adequado (Espaço significativo para melhoria)
2 = Fraco (Requer retrabalho substancial)
1 = Crítico (Problema fundamental que compromete a obra)

Você NÃO:
- Faz copyediting ou revisão gramatical detalhada
- Escreve ou reescreve trechos no lugar do autor
- Avalia potencial comercial ou faz previsões de vendas
- Garante sucesso de publicação`;

export class HelenaVasconcelosPersona {
	private llmService: LLMService;
	private settings: SmartWriterSettings;

	constructor(llmService: LLMService, settings: SmartWriterSettings) {
		this.llmService = llmService;
		this.settings = settings;
	}

	/**
	 * Analyzes overall literary quality across all dimensions.
	 */
	async analyzeLiteraryQuality(
		content: string,
		structure: ManuscriptStructure,
		chunks: ChunkingResult,
		onProgress?: (message: string) => void
	): Promise<LiteraryQualityReport> {
		onProgress?.('Analyzing narrative structure...');
		const structureScore = await this.scoreStructure(content, structure);

		onProgress?.('Analyzing coherence...');
		const coherenceScore = await this.scoreCoherence(content, structure);

		onProgress?.('Analyzing characters...');
		const charactersScore = await this.scoreCharacters(content, structure);

		onProgress?.('Analyzing voice and style...');
		const voiceScore = await this.scoreVoice(content, structure);

		onProgress?.('Analyzing pacing...');
		const pacingScore = await this.scorePacing(content, structure);

		onProgress?.('Analyzing worldbuilding...');
		const worldbuildingScore = await this.scoreWorldbuilding(content, structure);

		onProgress?.('Analyzing theme...');
		const themeScore = await this.scoreTheme(content, structure);

		onProgress?.('Analyzing genre conformity...');
		const genreScore = await this.scoreGenreConformity(content, structure);

		onProgress?.('Generating synopsis...');
		const synopsis = await this.generateSynopsis(content, structure);

		onProgress?.('Identifying strengths and improvements...');
		const { strengths, improvements } = await this.identifyStrengthsAndImprovements(
			content,
			structure,
			{
				structureScore,
				coherenceScore,
				charactersScore,
				voiceScore,
				pacingScore,
				worldbuildingScore,
				themeScore,
				genreScore,
			}
		);

		const overallScore = this.calculateOverallScore({
			structureScore,
			coherenceScore,
			charactersScore,
			voiceScore,
			pacingScore,
			worldbuildingScore,
			themeScore,
			genreScore,
		});

		return {
			synopsis,
			structureScore,
			coherenceScore,
			charactersScore,
			voiceScore,
			pacingScore,
			worldbuildingScore,
			themeScore,
			genreConformityScore: genreScore,
			overallScore,
			strengths,
			improvements,
		};
	}

	/**
	 * Analyzes narrative structure using Save the Cat beats.
	 */
	async analyzeStructure(
		content: string,
		structure: ManuscriptStructure,
		onProgress?: (message: string) => void
	): Promise<StructureAnalysis> {
		onProgress?.('Identifying narrative beats...');

		// Get first ~20% of content for Act 1 analysis
		const act1Content = this.getContentPortion(structure.chapters, 0, 0.25);
		// Get middle ~50% for Act 2
		const act2Content = this.getContentPortion(structure.chapters, 0.25, 0.75);
		// Get final ~25% for Act 3
		const act3Content = this.getContentPortion(structure.chapters, 0.75, 1);

		const beats = await this.identifyBeats(content, structure);
		const turningPoints = await this.identifyTurningPoints(content, structure);

		// Calculate act proportions
		const totalWords = structure.totalWords;
		const act1Words = this.countWordsInPortion(structure.chapters, 0, 0.25);
		const act2Words = this.countWordsInPortion(structure.chapters, 0.25, 0.75);
		const act3Words = totalWords - act1Words - act2Words;

		const acts = {
			act1Percentage: Math.round((act1Words / totalWords) * 100),
			act2Percentage: Math.round((act2Words / totalWords) * 100),
			act3Percentage: Math.round((act3Words / totalWords) * 100),
			balanceScore: this.scoreActBalance(act1Words, act2Words, act3Words, totalWords),
		};

		// Analyze causality
		const causalityScore = await this.analyzeCausality(content, structure);

		return {
			acts,
			beats,
			turningPoints,
			causalityScore,
		};
	}

	/**
	 * Analyzes coherence and consistency.
	 */
	async analyzeCoherence(
		content: string,
		structure: ManuscriptStructure,
		onProgress?: (message: string) => void
	): Promise<{ score: number; issues: string[] }> {
		onProgress?.('Checking timeline consistency...');
		
		const prompt = `Analise a coerência e consistência do seguinte manuscrito.

TÍTULO: ${structure.title}
CAPÍTULOS: ${structure.chapters.length}
PALAVRAS: ${structure.totalWords}

PRIMEIROS CAPÍTULOS (contexto):
${this.getSampleContent(structure.chapters, 0, 3)}

CAPÍTULOS DO MEIO:
${this.getSampleContent(structure.chapters, Math.floor(structure.chapters.length / 2), 2)}

CAPÍTULOS FINAIS:
${this.getSampleContent(structure.chapters, structure.chapters.length - 2, 2)}

Identifique:
1. Inconsistências na timeline/cronologia
2. Mudanças inexplicadas em características de personagens
3. Plot holes (lacunas na trama)
4. Chekhov's guns não resolvidos (elementos introduzidos sem payoff)
5. Inconsistências no worldbuilding

Responda em JSON:
{
  "score": (1-5),
  "timelineIssues": ["..."],
  "characterInconsistencies": ["..."],
  "plotHoles": ["..."],
  "unresolvedElements": ["..."],
  "worldbuildingIssues": ["..."]
}`;

		try {
			const response = await this.llmService.complete({
				prompt,
				systemPrompt: HELENA_SYSTEM_PROMPT,
				maxTokens: 1500,
				temperature: 0.3,
			});

			const result = this.parseJSON(response.content) as any;
			const issues: string[] = [
				...(Array.isArray(result?.timelineIssues) ? result.timelineIssues : []),
				...(Array.isArray(result?.characterInconsistencies) ? result.characterInconsistencies : []),
				...(Array.isArray(result?.plotHoles) ? result.plotHoles : []),
				...(Array.isArray(result?.unresolvedElements) ? result.unresolvedElements : []),
				...(Array.isArray(result?.worldbuildingIssues) ? result.worldbuildingIssues : []),
			];

			return {
				score: typeof result?.score === 'number' ? result.score : 3,
				issues,
			};
		} catch (error) {
			console.error('Coherence analysis failed:', error);
			return { score: 3, issues: [] };
		}
	}

	private async scoreStructure(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie a ESTRUTURA NARRATIVA deste manuscrito de 1 a 5.

Considere:
- Presença e posicionamento dos beats narrativos (Save the Cat)
- Proporção dos atos (ideal: 25%-50%-25%)
- Timing dos turning points
- Causalidade (causa → efeito)

TÍTULO: ${structure.title}
CAPÍTULOS: ${structure.chapters.length}
PALAVRAS: ${structure.totalWords}

AMOSTRA DO INÍCIO:
${this.getSampleContent(structure.chapters, 0, 2)}

AMOSTRA DO MEIO:
${this.getSampleContent(structure.chapters, Math.floor(structure.chapters.length / 2), 1)}

AMOSTRA DO FIM:
${this.getSampleContent(structure.chapters, structure.chapters.length - 1, 1)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async scoreCoherence(content: string, structure: ManuscriptStructure): Promise<number> {
		const analysis = await this.analyzeCoherence(content, structure);
		return analysis.score;
	}

	private async scoreCharacters(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie os PERSONAGENS deste manuscrito de 1 a 5.

Considere:
- Arco do protagonista (want/need/transformation)
- Profundidade do antagonista
- Distinção das vozes
- Caracterização (STEAL: Speech, Thoughts, Effects, Actions, Looks)

TÍTULO: ${structure.title}

AMOSTRA COM DIÁLOGOS:
${this.findDialogueSample(structure.chapters)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async scoreVoice(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie a VOZ E ESTILO deste manuscrito de 1 a 5.

Considere:
- Consistência do POV
- Tom e atmosfera
- Qualidade da prosa
- Show vs Tell
- Voz narrativa distintiva

AMOSTRA:
${this.getSampleContent(structure.chapters, 0, 2)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async scorePacing(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie o RITMO E PACING deste manuscrito de 1 a 5.

Considere:
- Macro-pacing (distribuição de tensão nos atos)
- Micro-pacing (ritmo de cenas e parágrafos)
- Equilíbrio cena/sumário
- Uso de cliffhangers

CAPÍTULOS: ${structure.chapters.length}
MÉDIA PALAVRAS/CAPÍTULO: ${Math.round(structure.totalWords / structure.chapters.length)}

AMOSTRA DE CENA DE AÇÃO (se disponível):
${this.findActionSample(structure.chapters)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async scoreWorldbuilding(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie o WORLDBUILDING E CENÁRIO deste manuscrito de 1 a 5.

Considere:
- Construção de mundo consistente
- Sensorialidade (5 sentidos)
- Integração orgânica com a narrativa
- Detalhes específicos vs genéricos

AMOSTRA DESCRITIVA:
${this.findDescriptiveSample(structure.chapters)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async scoreTheme(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie o TEMA E SUBTEXTO deste manuscrito de 1 a 5.

Considere:
- Clareza do tema central
- Theme stated (momento onde o tema é enunciado)
- Uso de símbolos e motivos
- Ressonância emocional

INÍCIO (onde tema costuma ser apresentado):
${this.getSampleContent(structure.chapters, 0, 1)}

FIM (onde tema costuma ser reforçado):
${this.getSampleContent(structure.chapters, structure.chapters.length - 1, 1)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async scoreGenreConformity(content: string, structure: ManuscriptStructure): Promise<number> {
		const prompt = `Avalie a CONFORMIDADE DE GÊNERO deste manuscrito de 1 a 5.

Baseado no conteúdo, identifique o gênero provável e avalie:
- Aderência às convenções do gênero
- Atendimento às expectativas dos leitores
- Posicionamento de mercado

AMOSTRA:
${this.getSampleContent(structure.chapters, 0, 2)}

Responda APENAS com um número de 1 a 5.`;

		return this.getScoreFromLLM(prompt);
	}

	private async generateSynopsis(content: string, structure: ManuscriptStructure): Promise<string> {
		const prompt = `Gere uma SINOPSE ESTRUTURAL do manuscrito em 3-4 parágrafos.

Inclua:
1. Premissa central (2-3 frases)
2. Arco narrativo principal (início, desenvolvimento, fim)
3. Conflito motor (o que impulsiona a narrativa)

TÍTULO: ${structure.title}
CAPÍTULOS: ${structure.chapters.length}

INÍCIO:
${this.getSampleContent(structure.chapters, 0, 2)}

MEIO:
${this.getSampleContent(structure.chapters, Math.floor(structure.chapters.length / 2), 1)}

FIM:
${this.getSampleContent(structure.chapters, structure.chapters.length - 1, 1)}`;

		try {
			const response = await this.llmService.complete({
				prompt,
				systemPrompt: HELENA_SYSTEM_PROMPT,
				maxTokens: 800,
				temperature: 0.5,
			});
			return response.content;
		} catch {
			return 'Sinopse não disponível.';
		}
	}

	private async identifyStrengthsAndImprovements(
		content: string,
		structure: ManuscriptStructure,
		scores: Record<string, number>
	): Promise<{ strengths: string[]; improvements: PrioritizedImprovement[] }> {
		const prompt = `Baseado na análise do manuscrito, identifique pontos fortes e áreas de melhoria.

SCORES:
- Estrutura: ${scores.structureScore}/5
- Coerência: ${scores.coherenceScore}/5
- Personagens: ${scores.charactersScore}/5
- Voz/Estilo: ${scores.voiceScore}/5
- Pacing: ${scores.pacingScore}/5
- Worldbuilding: ${scores.worldbuildingScore}/5
- Tema: ${scores.themeScore}/5
- Gênero: ${scores.genreScore}/5

AMOSTRA DO MANUSCRITO:
${this.getSampleContent(structure.chapters, 0, 2)}

Responda em JSON:
{
  "strengths": ["ponto forte 1", "ponto forte 2", ...],
  "improvements": [
    {"priority": "high|medium|low", "area": "área", "description": "problema", "suggestion": "sugestão"}
  ]
}`;

		try {
			const response = await this.llmService.complete({
				prompt,
				systemPrompt: HELENA_SYSTEM_PROMPT,
				maxTokens: 1000,
				temperature: 0.4,
			});

			const result = this.parseJSON(response.content) as any;
			return {
				strengths: Array.isArray(result?.strengths) ? result.strengths : [],
				improvements: Array.isArray(result?.improvements) ? result.improvements : [],
			};
		} catch {
			return { strengths: [], improvements: [] };
		}
	}

	private async identifyBeats(content: string, structure: ManuscriptStructure): Promise<BeatAnalysis[]> {
		const beatNames = [
			'Opening Image / Setup',
			'Theme Stated',
			'Catalyst',
			'Debate',
			'Break Into Two',
			'B Story',
			'Fun & Games',
			'Midpoint',
			'Bad Guys Close In',
			'All Is Lost',
			'Dark Night of the Soul',
			'Break Into Three',
			'Finale',
			'Final Image',
		];

		// Simplified beat detection - would be enhanced with LLM
		return beatNames.map((name, index) => ({
			name,
			present: true, // Placeholder
			position: Math.round((index / beatNames.length) * 100),
			chapter: Math.max(1, Math.floor((index / beatNames.length) * structure.chapters.length)),
			efficacy: 3, // Placeholder
		}));
	}

	private async identifyTurningPoints(
		content: string,
		structure: ManuscriptStructure
	): Promise<StructureAnalysis['turningPoints']> {
		return [
			{ name: 'Inciting Incident', chapter: 1, position: 10, strength: 3 },
			{ name: 'First Plot Point', chapter: Math.floor(structure.chapters.length * 0.25), position: 25, strength: 3 },
			{ name: 'Midpoint', chapter: Math.floor(structure.chapters.length * 0.5), position: 50, strength: 3 },
			{ name: 'Second Plot Point', chapter: Math.floor(structure.chapters.length * 0.75), position: 75, strength: 3 },
			{ name: 'Climax', chapter: structure.chapters.length - 1, position: 90, strength: 3 },
		];
	}

	private async analyzeCausality(content: string, structure: ManuscriptStructure): Promise<number> {
		// Simplified causality analysis
		return 3;
	}

	private async getScoreFromLLM(prompt: string): Promise<number> {
		try {
			const response = await this.llmService.complete({
				prompt,
				systemPrompt: HELENA_SYSTEM_PROMPT,
				maxTokens: 50,
				temperature: 0.2,
			});

			const score = parseInt(response.content.trim());
			if (score >= 1 && score <= 5) return score;
			return 3;
		} catch {
			return 3;
		}
	}

	private calculateOverallScore(scores: Record<string, number>): number {
		const values = Object.values(scores);
		return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
	}

	private scoreActBalance(act1: number, act2: number, act3: number, total: number): number {
		const ideal = { act1: 0.25, act2: 0.50, act3: 0.25 };
		const actual = { act1: act1 / total, act2: act2 / total, act3: act3 / total };

		const deviation = 
			Math.abs(ideal.act1 - actual.act1) +
			Math.abs(ideal.act2 - actual.act2) +
			Math.abs(ideal.act3 - actual.act3);

		if (deviation < 0.1) return 5;
		if (deviation < 0.2) return 4;
		if (deviation < 0.3) return 3;
		if (deviation < 0.4) return 2;
		return 1;
	}

	private getSampleContent(chapters: Chapter[], startIndex: number, count: number): string {
		const samples = chapters
			.slice(startIndex, startIndex + count)
			.map(ch => {
				const words = ch.content.split(/\s+/);
				return `## ${ch.title || `Capítulo ${ch.index}`}\n${words.slice(0, 300).join(' ')}...`;
			});
		return samples.join('\n\n');
	}

	private getContentPortion(chapters: Chapter[], startRatio: number, endRatio: number): string {
		const startIndex = Math.floor(chapters.length * startRatio);
		const endIndex = Math.floor(chapters.length * endRatio);
		return chapters.slice(startIndex, endIndex).map(ch => ch.content).join('\n\n');
	}

	private countWordsInPortion(chapters: Chapter[], startRatio: number, endRatio: number): number {
		const startIndex = Math.floor(chapters.length * startRatio);
		const endIndex = Math.floor(chapters.length * endRatio);
		return chapters.slice(startIndex, endIndex).reduce((sum, ch) => sum + ch.wordCount, 0);
	}

	private findDialogueSample(chapters: Chapter[]): string {
		for (const chapter of chapters) {
			if (chapter.content.includes('—') || chapter.content.includes('"')) {
				const lines = chapter.content.split('\n');
				const dialogueStart = lines.findIndex(l => l.includes('—') || l.includes('"'));
				if (dialogueStart >= 0) {
					return lines.slice(dialogueStart, dialogueStart + 20).join('\n');
				}
			}
		}
		return this.getSampleContent(chapters, 0, 1);
	}

	private findActionSample(chapters: Chapter[]): string {
		// Look for short paragraphs which often indicate action
		for (const chapter of chapters) {
			const paragraphs = chapter.content.split(/\n\s*\n/);
			const actionPara = paragraphs.find(p => {
				const sentences = p.split(/[.!?]+/);
				const avgLength = sentences.reduce((s, sent) => s + sent.split(/\s+/).length, 0) / sentences.length;
				return avgLength < 10 && sentences.length > 3;
			});
			if (actionPara) return actionPara;
		}
		return this.getSampleContent(chapters, Math.floor(chapters.length * 0.7), 1);
	}

	private findDescriptiveSample(chapters: Chapter[]): string {
		// Look for longer paragraphs with sensory words
		const sensoryWords = ['viu', 'ouviu', 'sentiu', 'cheiro', 'sabor', 'tocou', 'olhou', 'escutou'];
		
		for (const chapter of chapters) {
			const paragraphs = chapter.content.split(/\n\s*\n/);
			const descriptive = paragraphs.find(p => 
				p.split(/\s+/).length > 50 && 
				sensoryWords.some(w => p.toLowerCase().includes(w))
			);
			if (descriptive) return descriptive;
		}
		return this.getSampleContent(chapters, 0, 1);
	}

	private parseJSON(text: string): Record<string, unknown> {
		try {
			// Try to extract JSON from response
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}
		} catch (e) {
			console.error('JSON parse error:', e);
		}
		return {};
	}
}
