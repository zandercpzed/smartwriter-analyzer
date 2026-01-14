// src/analyzers/cadence.ts
// Analyzes rhythm and cadence of prose

import { CadenceMetrics, ChapterPacing } from '../types';
import { Chapter } from '../parsers/manuscript-parser';

export class CadenceAnalyzer {
	/**
	 * Analyzes the cadence and rhythm of the text.
	 */
	analyze(content: string, chapters: Chapter[]): CadenceMetrics {
		const sentences = this.extractSentences(content);
		const sentenceLengths = sentences.map(s => this.countWords(s));
		const paragraphs = this.extractParagraphs(content);
		const paragraphLengths = paragraphs.map(p => this.countWords(p));

		const burstiness = this.calculateBurstiness(sentenceLengths);
		const sentenceLengthVariance = this.calculateVariance(sentenceLengths);
		const paragraphLengthVariance = this.calculateVariance(paragraphLengths);
		const rhythmPattern = this.classifyRhythm(burstiness, sentenceLengthVariance);

		const pacingByChapter = chapters.map(chapter => this.analyzeChapterPacing(chapter));

		return {
			burstiness,
			sentenceLengthVariance,
			paragraphLengthVariance,
			rhythmPattern,
			pacingByChapter,
		};
	}

	/**
	 * Burstiness measures the variation in consecutive sentence lengths.
	 * Higher burstiness = more natural, varied prose.
	 * AI-generated text often has lower burstiness (more uniform).
	 * 
	 * Formula: (σ - μ) / (σ + μ) where σ = std dev, μ = mean
	 * Range: -1 to 1 (higher is more "bursty")
	 */
	private calculateBurstiness(lengths: number[]): number {
		if (lengths.length < 2) return 0;

		const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
		const variance = lengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / lengths.length;
		const stdDev = Math.sqrt(variance);

		if (mean + stdDev === 0) return 0;

		return (stdDev - mean) / (stdDev + mean);
	}

	/**
	 * Calculates statistical variance.
	 */
	private calculateVariance(values: number[]): number {
		if (values.length === 0) return 0;

		const mean = values.reduce((a, b) => a + b, 0) / values.length;
		return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
	}

	/**
	 * Classifies the overall rhythm pattern.
	 */
	private classifyRhythm(
		burstiness: number,
		sentenceVariance: number
	): 'uniform' | 'varied' | 'chaotic' {
		// Normalize variance to a comparable scale
		const normalizedVariance = Math.sqrt(sentenceVariance);

		if (burstiness < -0.2 && normalizedVariance < 5) {
			return 'uniform'; // Low variation, mechanical feel
		} else if (burstiness > 0.3 || normalizedVariance > 15) {
			return 'chaotic'; // Very high variation, potentially disjointed
		} else {
			return 'varied'; // Good balance
		}
	}

	/**
	 * Analyzes pacing for a single chapter.
	 */
	private analyzeChapterPacing(chapter: Chapter): ChapterPacing {
		const sentences = this.extractSentences(chapter.content);
		const sentenceLengths = sentences.map(s => this.countWords(s));

		const avgSentenceLength = sentenceLengths.length > 0
			? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
			: 0;

		const burstiness = this.calculateBurstiness(sentenceLengths);

		// Classify pace based on average sentence length
		let paceCategory: 'slow' | 'moderate' | 'fast';
		if (avgSentenceLength < 12) {
			paceCategory = 'fast'; // Short sentences = quicker pace
		} else if (avgSentenceLength > 20) {
			paceCategory = 'slow'; // Long sentences = slower pace
		} else {
			paceCategory = 'moderate';
		}

		return {
			chapter: chapter.index,
			avgSentenceLength,
			burstiness,
			paceCategory,
		};
	}

	/**
	 * Analyzes rhythm patterns within a passage.
	 * Returns sequence of short (S), medium (M), long (L) sentences.
	 */
	analyzeRhythmSequence(text: string): string {
		const sentences = this.extractSentences(text);
		const lengths = sentences.map(s => this.countWords(s));

		return lengths.map(len => {
			if (len <= 8) return 'S';
			if (len <= 20) return 'M';
			return 'L';
		}).join('');
	}

	/**
	 * Detects rhythm repetition patterns.
	 * Returns patterns that repeat more than expected.
	 */
	detectRepetitivePatterns(text: string, patternLength: number = 3): Map<string, number> {
		const sequence = this.analyzeRhythmSequence(text);
		const patterns = new Map<string, number>();

		for (let i = 0; i <= sequence.length - patternLength; i++) {
			const pattern = sequence.substring(i, i + patternLength);
			patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
		}

		// Filter to patterns that appear more than random chance would suggest
		const threshold = Math.max(3, sequence.length / (Math.pow(3, patternLength) * 2));
		const repetitive = new Map<string, number>();

		for (const [pattern, count] of patterns) {
			if (count >= threshold) {
				repetitive.set(pattern, count);
			}
		}

		return repetitive;
	}

	/**
	 * Calculates the "momentum" of a passage.
	 * Momentum increases with shorter sentences and decreases with longer ones.
	 */
	calculateMomentum(text: string): number[] {
		const sentences = this.extractSentences(text);
		const momentum: number[] = [];
		let currentMomentum = 50; // Start at neutral

		for (const sentence of sentences) {
			const words = this.countWords(sentence);

			// Short sentences increase momentum, long ones decrease it
			if (words <= 8) {
				currentMomentum = Math.min(100, currentMomentum + 10);
			} else if (words <= 15) {
				currentMomentum = Math.min(100, currentMomentum + 3);
			} else if (words <= 25) {
				currentMomentum = Math.max(0, currentMomentum - 3);
			} else {
				currentMomentum = Math.max(0, currentMomentum - 10);
			}

			momentum.push(currentMomentum);
		}

		return momentum;
	}

	/**
	 * Identifies "white space" usage (short paragraphs, dialogue breaks).
	 */
	analyzeWhiteSpace(text: string): {
		shortParagraphRatio: number;
		dialogueRatio: number;
		avgParagraphGap: number;
	} {
		const paragraphs = this.extractParagraphs(text);
		const shortParagraphs = paragraphs.filter(p => this.countWords(p) <= 30);
		const dialogueParagraphs = paragraphs.filter(p => 
			p.trim().startsWith('—') || 
			p.trim().startsWith('"') || 
			p.trim().startsWith('–') ||
			p.trim().startsWith('-')
		);

		return {
			shortParagraphRatio: shortParagraphs.length / Math.max(paragraphs.length, 1),
			dialogueRatio: dialogueParagraphs.length / Math.max(paragraphs.length, 1),
			avgParagraphGap: paragraphs.length > 0 
				? text.length / paragraphs.length 
				: 0,
		};
	}

	private extractSentences(text: string): string[] {
		return text
			.split(/[.!?…]+/)
			.map(s => s.trim())
			.filter(s => s.length > 0);
	}

	private extractParagraphs(text: string): string[] {
		return text
			.split(/\n\s*\n/)
			.map(p => p.trim())
			.filter(p => p.length > 0);
	}

	private countWords(text: string): number {
		return text.split(/\s+/).filter(w => w.length > 0).length;
	}

	/**
	 * Generates a cadence interpretation report.
	 */
	interpret(metrics: CadenceMetrics): {
		summary: string;
		strengths: string[];
		suggestions: string[];
	} {
		const strengths: string[] = [];
		const suggestions: string[] = [];

		// Burstiness interpretation
		if (metrics.burstiness >= 0.2) {
			strengths.push('Boa variação no ritmo das frases, prosa natural');
		} else if (metrics.burstiness <= -0.1) {
			suggestions.push('Considere variar mais o comprimento das frases para melhor ritmo');
		}

		// Rhythm pattern
		if (metrics.rhythmPattern === 'varied') {
			strengths.push('Padrão rítmico equilibrado');
		} else if (metrics.rhythmPattern === 'uniform') {
			suggestions.push('Ritmo muito uniforme; adicione mais variação para engajamento');
		} else if (metrics.rhythmPattern === 'chaotic') {
			suggestions.push('Ritmo irregular demais; considere suavizar transições');
		}

		// Chapter pacing analysis
		const fastChapters = metrics.pacingByChapter.filter(c => c.paceCategory === 'fast');
		const slowChapters = metrics.pacingByChapter.filter(c => c.paceCategory === 'slow');

		if (fastChapters.length > 0 && slowChapters.length > 0) {
			strengths.push('Boa variação de ritmo entre capítulos');
		}

		let summary = `Ritmo ${metrics.rhythmPattern === 'varied' ? 'balanceado' : 
			metrics.rhythmPattern === 'uniform' ? 'uniforme' : 'variado'} `;
		summary += `com burstiness de ${(metrics.burstiness * 100).toFixed(0)}%.`;

		return { summary, strengths, suggestions };
	}
}
