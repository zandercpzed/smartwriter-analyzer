// src/analyzers/ai-detection.ts
// Implements DETECT-AI protocol for AI artifact detection

import { 
	AIDetectionResult, 
	AIArtifact, 
	ArtifactInstance, 
	SampleAnalysis,
	SmartWriterSettings 
} from '../types';
import { LLMService } from '../llm/llm-service';
import { Chapter } from '../parsers/manuscript-parser';

// Artifact marker definitions from DETECT-AI protocol
const ARTIFACT_MARKERS = {
	// Category A: Lexical Patterns
	A1: { name: 'Sinônimos excessivos', weight: 'high' as const, category: 'A' as const },
	A2: { name: 'Vocabulário elevado uniforme', weight: 'medium' as const, category: 'A' as const },
	A3: { name: 'Frases de ênfase padronizadas', weight: 'high' as const, category: 'A' as const },
	A4: { name: 'Advérbios de intensificação', weight: 'medium' as const, category: 'A' as const },
	A5: { name: 'Conectivos formais', weight: 'medium' as const, category: 'A' as const },
	A6: { name: 'Hedging excessivo', weight: 'medium' as const, category: 'A' as const },

	// Category B: Structural Patterns
	B1: { name: 'Uniformidade frasal', weight: 'high' as const, category: 'B' as const },
	B2: { name: 'Parágrafos simétricos', weight: 'medium' as const, category: 'B' as const },
	B3: { name: 'Transições mecânicas', weight: 'medium' as const, category: 'B' as const },
	B4: { name: 'Listas implícitas', weight: 'high' as const, category: 'B' as const },
	B5: { name: 'Ausência de fragmentos', weight: 'medium' as const, category: 'B' as const },
	B6: { name: 'Abertura-corpo-conclusão rígida', weight: 'high' as const, category: 'B' as const },

	// Category C: Narrative Patterns (Fiction)
	C1: { name: 'Diálogos equilibrados', weight: 'high' as const, category: 'C' as const },
	C2: { name: 'Tags de diálogo repetitivas', weight: 'medium' as const, category: 'C' as const },
	C3: { name: 'Descrições sensoriais genéricas', weight: 'high' as const, category: 'C' as const },
	C4: { name: 'Emoções nomeadas (telling)', weight: 'medium' as const, category: 'C' as const },
	C5: { name: 'Backstory expositivo', weight: 'medium' as const, category: 'C' as const },
	C6: { name: 'Ausência de coloquialismos', weight: 'high' as const, category: 'C' as const },
	C7: { name: 'Metáforas convencionais', weight: 'medium' as const, category: 'C' as const },
	C8: { name: 'Vozes indistintas', weight: 'high' as const, category: 'C' as const },

	// Category D: Statistical Patterns
	D1: { name: 'Perplexidade baixa', weight: 'high' as const, category: 'D' as const },
	D2: { name: 'Burstiness baixa', weight: 'high' as const, category: 'D' as const },
	D3: { name: 'TTR anormal', weight: 'medium' as const, category: 'D' as const },
	D4: { name: 'Desvio da Lei de Zipf', weight: 'high' as const, category: 'D' as const },
	D5: { name: 'N-gramas repetitivos', weight: 'high' as const, category: 'D' as const },
	D6: { name: 'Entropia uniforme', weight: 'medium' as const, category: 'D' as const },

	// Category E: Cultural/Temporal Patterns
	E1: { name: 'Americanismos em contexto não-americano', weight: 'medium' as const, category: 'E' as const },
	E2: { name: 'Anacronismos lexicais', weight: 'high' as const, category: 'E' as const },
	E3: { name: 'Neutralidade cultural excessiva', weight: 'medium' as const, category: 'E' as const },
	E4: { name: 'Formalidade consistente', weight: 'high' as const, category: 'E' as const },
	E5: { name: 'Conhecimento enciclopédico', weight: 'medium' as const, category: 'E' as const },
};

// Common AI-generated phrases (Portuguese)
const AI_PHRASES_PT = [
	'vale ressaltar', 'é importante destacar', 'nesse sentido', 'diante disso',
	'tendo em vista', 'por conseguinte', 'em suma', 'além disso', 'no entanto',
	'ademais', 'outrossim', 'destarte', 'não obstante', 'indubitavelmente',
	'inegavelmente', 'certamente', 'evidentemente', 'claramente',
];

// Common AI-generated phrases (English)
const AI_PHRASES_EN = [
	'it\'s worth noting', 'plays a vital role', 'stands as a testament',
	'underscores the importance', 'in conclusion', 'furthermore', 'moreover',
	'additionally', 'consequently', 'significantly', 'remarkably', 'profoundly',
	'undeniably', 'incredibly', 'it seems', 'appears to', 'might suggest',
];

export class AIDetectionAnalyzer {
	private llmService: LLMService;
	private settings: SmartWriterSettings;

	constructor(llmService: LLMService, settings: SmartWriterSettings) {
		this.llmService = llmService;
		this.settings = settings;
	}

	async analyze(
		content: string,
		chapters: Chapter[],
		onProgress?: (message: string) => void
	): Promise<AIDetectionResult> {
		const artifacts: AIArtifact[] = [];
		const sampleAnalysis: SampleAnalysis[] = [];

		// Phase 1: Collect text samples
		onProgress?.('Collecting samples...');
		const samples = this.collectSamples(content, chapters);

		// Phase 2: Statistical analysis (computational)
		onProgress?.('Running statistical analysis...');
		const statisticalArtifacts = this.analyzeStatistical(content);
		artifacts.push(...statisticalArtifacts);

		// Phase 3: Lexical pattern analysis (computational)
		onProgress?.('Analyzing lexical patterns...');
		const lexicalArtifacts = this.analyzeLexicalPatterns(content);
		artifacts.push(...lexicalArtifacts);

		// Phase 4: Structural pattern analysis (computational)
		onProgress?.('Analyzing structural patterns...');
		const structuralArtifacts = this.analyzeStructuralPatterns(content);
		artifacts.push(...structuralArtifacts);

		// Phase 5: LLM-assisted analysis for each sample
		onProgress?.('Running AI-assisted analysis on samples...');
		for (let i = 0; i < samples.length; i++) {
			onProgress?.(`Analyzing sample ${i + 1}/${samples.length}...`);
			const sample = samples[i];
			const analysis = await this.analyzeSample(sample, i);
			sampleAnalysis.push(analysis);
		}

		// Calculate IUL (Índice de Uso de LLM)
		const iul = this.calculateIUL(artifacts, sampleAnalysis);

		return {
			iul,
			classification: this.classifyIUL(iul),
			artifacts,
			sampleAnalysis,
		};
	}

	private collectSamples(content: string, chapters: Chapter[]): string[] {
		const targetSampleCount = 10;
		const targetSampleSize = 400; // words

		if (chapters.length <= targetSampleCount) {
			// Use start of each chapter as sample
			return chapters.map(ch => {
				const words = ch.content.split(/\s+/);
				return words.slice(0, targetSampleSize).join(' ');
			});
		}

		// Distribute samples across chapters
		const samples: string[] = [];
		const interval = Math.floor(chapters.length / targetSampleCount);

		for (let i = 0; i < targetSampleCount; i++) {
			const chapterIndex = Math.min(i * interval, chapters.length - 1);
			const chapter = chapters[chapterIndex];
			const words = chapter.content.split(/\s+/);
			samples.push(words.slice(0, targetSampleSize).join(' '));
		}

		return samples;
	}

	private analyzeStatistical(content: string): AIArtifact[] {
		const artifacts: AIArtifact[] = [];
		const sentences = content.split(/[.!?]+/).filter(s => s.trim());
		const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 0);

		// D2: Burstiness analysis
		const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
		const burstiness = this.calculateBurstiness(sentenceLengths);
		
		if (burstiness < 0.1) {
			artifacts.push(this.createArtifact('D2', [{
				location: 'Global',
				excerpt: `Burstiness: ${burstiness.toFixed(3)} (baixa variação)`,
				chapterIndex: 0,
			}]));
		}

		// D3: Type-Token Ratio
		const uniqueWords = new Set(words);
		const ttr = uniqueWords.size / words.length;
		
		// Normal TTR for Portuguese fiction: 0.15-0.30
		if (ttr < 0.12 || ttr > 0.35) {
			artifacts.push(this.createArtifact('D3', [{
				location: 'Global',
				excerpt: `TTR: ${ttr.toFixed(3)} (${ttr < 0.12 ? 'vocabulário repetitivo' : 'vocabulário atipicamente diverso'})`,
				chapterIndex: 0,
			}]));
		}

		// D5: N-gram repetition
		const trigramRepetitions = this.findRepetitiveNgrams(words, 3);
		if (trigramRepetitions.length > 5) {
			artifacts.push(this.createArtifact('D5', trigramRepetitions.slice(0, 5).map(r => ({
				location: 'Multiple',
				excerpt: `"${r.ngram}" (${r.count}x)`,
				chapterIndex: 0,
			}))));
		}

		return artifacts;
	}

	private analyzeLexicalPatterns(content: string): AIArtifact[] {
		const artifacts: AIArtifact[] = [];
		const phrases = this.settings.language.startsWith('pt') ? AI_PHRASES_PT : AI_PHRASES_EN;
		const contentLower = content.toLowerCase();

		// A3: Standard emphasis phrases
		const foundPhrases: ArtifactInstance[] = [];
		for (const phrase of phrases) {
			const regex = new RegExp(phrase, 'gi');
			const matches = contentLower.match(regex);
			if (matches && matches.length > 2) {
				foundPhrases.push({
					location: 'Multiple',
					excerpt: `"${phrase}" (${matches.length}x)`,
					chapterIndex: 0,
				});
			}
		}

		if (foundPhrases.length >= 3) {
			artifacts.push(this.createArtifact('A3', foundPhrases));
		}

		// A4: Intensifying adverbs
		const intensifiers = this.settings.language.startsWith('pt')
			? ['notavelmente', 'significativamente', 'profundamente', 'inegavelmente', 'incrivelmente', 'realmente', 'verdadeiramente']
			: ['remarkably', 'significantly', 'profoundly', 'undeniably', 'incredibly', 'truly', 'really'];

		const intensifierCount = intensifiers.reduce((count, adv) => {
			const regex = new RegExp(`\\b${adv}\\b`, 'gi');
			return count + (contentLower.match(regex)?.length || 0);
		}, 0);

		const wordCount = content.split(/\s+/).length;
		if (intensifierCount / wordCount > 0.005) { // More than 0.5% is suspicious
			artifacts.push(this.createArtifact('A4', [{
				location: 'Global',
				excerpt: `${intensifierCount} intensificadores em ${wordCount} palavras (${((intensifierCount/wordCount)*100).toFixed(2)}%)`,
				chapterIndex: 0,
			}]));
		}

		// A5: Formal connectives
		const connectives = this.settings.language.startsWith('pt')
			? ['ademais', 'outrossim', 'destarte', 'por conseguinte', 'não obstante', 'porquanto']
			: ['furthermore', 'moreover', 'additionally', 'consequently', 'henceforth', 'whereby'];

		const connectiveInstances: ArtifactInstance[] = [];
		for (const conn of connectives) {
			const regex = new RegExp(`\\b${conn}\\b`, 'gi');
			const matches = contentLower.match(regex);
			if (matches && matches.length > 0) {
				connectiveInstances.push({
					location: 'Multiple',
					excerpt: `"${conn}" (${matches.length}x)`,
					chapterIndex: 0,
				});
			}
		}

		if (connectiveInstances.length >= 4) {
			artifacts.push(this.createArtifact('A5', connectiveInstances));
		}

		return artifacts;
	}

	private analyzeStructuralPatterns(content: string): AIArtifact[] {
		const artifacts: AIArtifact[] = [];
		const sentences = content.split(/[.!?]+/).filter(s => s.trim());
		const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

		// B1: Sentence length uniformity
		const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
		const variance = this.calculateVariance(sentenceLengths);
		const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
		const coefficientOfVariation = Math.sqrt(variance) / mean;

		if (coefficientOfVariation < 0.3) {
			artifacts.push(this.createArtifact('B1', [{
				location: 'Global',
				excerpt: `Coeficiente de variação: ${coefficientOfVariation.toFixed(3)} (frases muito uniformes)`,
				chapterIndex: 0,
			}]));
		}

		// B2: Paragraph symmetry
		const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);
		const paragraphVariance = this.calculateVariance(paragraphLengths);
		const paragraphMean = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;
		const paragraphCV = Math.sqrt(paragraphVariance) / paragraphMean;

		if (paragraphCV < 0.25 && paragraphs.length > 10) {
			artifacts.push(this.createArtifact('B2', [{
				location: 'Global',
				excerpt: `CV parágrafos: ${paragraphCV.toFixed(3)} (parágrafos muito simétricos)`,
				chapterIndex: 0,
			}]));
		}

		// B4: Implicit lists (primeiro... segundo... terceiro...)
		const listPatterns = this.settings.language.startsWith('pt')
			? [/primeiro[,.]?\s+.*segundo[,.]?\s+.*terceiro/gi, /em primeiro lugar.*em segundo.*em terceiro/gi]
			: [/first[,.]?\s+.*second[,.]?\s+.*third/gi, /firstly.*secondly.*thirdly/gi];

		for (const pattern of listPatterns) {
			if (pattern.test(content)) {
				artifacts.push(this.createArtifact('B4', [{
					location: 'Multiple',
					excerpt: 'Estrutura de lista implícita detectada',
					chapterIndex: 0,
				}]));
				break;
			}
		}

		return artifacts;
	}

	private async analyzeSample(sample: string, index: number): Promise<SampleAnalysis> {
		// Use LLM for qualitative analysis of the sample
		const prompt = this.buildAnalysisPrompt(sample);

		try {
			const response = await this.llmService.complete({
				prompt,
				systemPrompt: this.getDetectionSystemPrompt(),
				maxTokens: 500,
				temperature: 0.3,
			});

			const artifactsFound = this.parseArtifactsFromResponse(response.content);
			const localIul = this.estimateLocalIUL(artifactsFound);

			return {
				sampleIndex: index,
				location: `Sample ${index + 1}`,
				wordCount: sample.split(/\s+/).length,
				artifactsFound,
				localIul,
			};
		} catch (error) {
			console.error('Sample analysis failed:', error);
			return {
				sampleIndex: index,
				location: `Sample ${index + 1}`,
				wordCount: sample.split(/\s+/).length,
				artifactsFound: [],
				localIul: 0,
			};
		}
	}

	private buildAnalysisPrompt(sample: string): string {
		return `Analise o seguinte trecho de texto e identifique artefatos que sugerem geração por IA.

Procure por:
- Frases padronizadas ou clichês de LLM
- Uniformidade excessiva no comprimento das frases
- Vocabulário artificialmente elevado
- Ausência de coloquialismos ou marcas pessoais
- Descrições genéricas sem detalhes idiossincráticos
- Transições mecânicas entre ideias

TEXTO:
"""
${sample}
"""

Responda APENAS com uma lista de códigos de artefatos encontrados (A1, B2, C3, etc.) e uma breve justificativa para cada. Se nenhum artefato for encontrado, responda "NENHUM".`;
	}

	private getDetectionSystemPrompt(): string {
		return `Você é um especialista em análise forense de textos, treinado para identificar padrões de geração por modelos de linguagem (LLMs).

Seu trabalho é identificar artefatos textuais que indicam uso de IA, usando os seguintes códigos:

CATEGORIA A - Padrões Lexicais:
A1: Sinônimos excessivos
A2: Vocabulário elevado uniforme
A3: Frases de ênfase padronizadas
A4: Advérbios de intensificação em excesso
A5: Conectivos formais excessivos
A6: Hedging excessivo

CATEGORIA B - Padrões Estruturais:
B1: Uniformidade frasal
B2: Parágrafos simétricos
B3: Transições mecânicas
B4: Listas implícitas
B5: Ausência de fragmentos
B6: Estrutura abertura-corpo-conclusão rígida

CATEGORIA C - Padrões Narrativos:
C1: Diálogos equilibrados demais
C2: Tags de diálogo repetitivas
C3: Descrições sensoriais genéricas
C4: Emoções nomeadas (telling)
C5: Backstory expositivo
C6: Ausência de coloquialismos
C7: Metáforas convencionais
C8: Vozes de personagens indistintas

Seja objetivo e específico. Não faça julgamentos morais.`;
	}

	private parseArtifactsFromResponse(response: string): string[] {
		const artifactCodes = Object.keys(ARTIFACT_MARKERS);
		const found: string[] = [];

		for (const code of artifactCodes) {
			if (response.includes(code)) {
				found.push(code);
			}
		}

		return found;
	}

	private estimateLocalIUL(artifactCodes: string[]): number {
		if (artifactCodes.length === 0) return 0;

		let totalWeight = 0;
		for (const code of artifactCodes) {
			const marker = ARTIFACT_MARKERS[code as keyof typeof ARTIFACT_MARKERS];
			if (marker) {
				totalWeight += marker.weight === 'high' ? 3 : marker.weight === 'medium' ? 2 : 1;
			}
		}

		// Normalize to 0-100 scale (max ~30 points if all high markers found)
		return Math.min(100, (totalWeight / 15) * 100);
	}

	private calculateIUL(artifacts: AIArtifact[], samples: SampleAnalysis[]): number {
		// Weight from computational artifacts
		let artifactScore = 0;
		for (const artifact of artifacts) {
			const weight = artifact.weight === 'high' ? 3 : artifact.weight === 'medium' ? 2 : 1;
			artifactScore += weight * artifact.instances.length;
		}

		// Weight from sample analysis
		const avgSampleIUL = samples.length > 0
			? samples.reduce((sum, s) => sum + s.localIul, 0) / samples.length
			: 0;

		// Combined score (60% samples, 40% computational)
		const combinedScore = (avgSampleIUL * 0.6) + (Math.min(100, artifactScore * 2) * 0.4);

		return Math.round(Math.min(100, combinedScore));
	}

	private classifyIUL(iul: number): AIDetectionResult['classification'] {
		if (iul <= 15) return 'authentic';
		if (iul <= 35) return 'assisted';
		if (iul <= 60) return 'hybrid';
		if (iul <= 85) return 'predominantly-ai';
		return 'ai-generated';
	}

	private createArtifact(code: string, instances: ArtifactInstance[]): AIArtifact {
		const marker = ARTIFACT_MARKERS[code as keyof typeof ARTIFACT_MARKERS];
		return {
			code,
			category: marker.category,
			marker: marker.name,
			description: marker.name,
			weight: marker.weight,
			instances,
		};
	}

	private calculateBurstiness(lengths: number[]): number {
		if (lengths.length < 2) return 0;
		const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
		const variance = this.calculateVariance(lengths);
		const stdDev = Math.sqrt(variance);
		if (mean + stdDev === 0) return 0;
		return (stdDev - mean) / (stdDev + mean);
	}

	private calculateVariance(values: number[]): number {
		if (values.length === 0) return 0;
		const mean = values.reduce((a, b) => a + b, 0) / values.length;
		return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
	}

	private findRepetitiveNgrams(words: string[], n: number): Array<{ ngram: string; count: number }> {
		const ngrams = new Map<string, number>();

		for (let i = 0; i <= words.length - n; i++) {
			const ngram = words.slice(i, i + n).join(' ');
			ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
		}

		return Array.from(ngrams.entries())
			.filter(([_, count]) => count > 3)
			.map(([ngram, count]) => ({ ngram, count }))
			.sort((a, b) => b.count - a.count);
	}
}
