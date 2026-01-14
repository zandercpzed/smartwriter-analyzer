// src/analyzers/readability.ts
// Computational readability analysis

import { ReadabilityMetrics } from '../types';

export class ReadabilityAnalyzer {
	private language: string;

	// Syllable patterns for Portuguese
	private static readonly PT_VOWELS = /[aáàâãeéêiíoóôõuú]/gi;
	private static readonly PT_DIPHTHONGS = /[aeiou][iuo]/gi;

	// Syllable patterns for English
	private static readonly EN_VOWELS = /[aeiouy]+/gi;

	constructor(language: string = 'pt-BR') {
		this.language = language;
	}

	analyze(text: string): ReadabilityMetrics {
		const sentences = this.extractSentences(text);
		const words = this.extractWords(text);
		const paragraphs = this.extractParagraphs(text);

		const totalSentences = sentences.length;
		const totalWords = words.length;
		const totalSyllables = this.countTotalSyllables(words);
		const complexWords = this.countComplexWords(words);

		const avgSentenceLength = totalWords / Math.max(totalSentences, 1);
		const avgSyllablesPerWord = totalSyllables / Math.max(totalWords, 1);
		const avgParagraphLength = totalWords / Math.max(paragraphs.length, 1);
		const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(totalWords, 1);

		return {
			fleschKincaid: this.calculateFleschKincaid(avgSentenceLength, avgSyllablesPerWord),
			smog: this.calculateSMOG(complexWords, totalSentences),
			gunningFog: this.calculateGunningFog(avgSentenceLength, complexWords, totalWords),
			ari: this.calculateARI(totalWords, totalSentences, text.length),
			avgSentenceLength,
			avgParagraphLength,
			avgWordLength,
			complexWordRatio: complexWords / Math.max(totalWords, 1),
		};
	}

	/**
	 * Flesch-Kincaid Grade Level
	 * Higher = more difficult to read
	 */
	private calculateFleschKincaid(avgSentenceLength: number, avgSyllablesPerWord: number): number {
		// Standard formula: 0.39 × ASL + 11.8 × ASW − 15.59
		// Adjusted for Portuguese: slight modification for syllable patterns
		const factor = this.language.startsWith('pt') ? 1.05 : 1.0;
		return Math.max(0, 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord * factor - 15.59);
	}

	/**
	 * SMOG Index (Simple Measure of Gobbledygook)
	 * Estimates years of education needed
	 */
	private calculateSMOG(complexWords: number, totalSentences: number): number {
		if (totalSentences < 30) {
			// For shorter texts, adjust the formula
			const adjustedComplex = complexWords * (30 / Math.max(totalSentences, 1));
			return 1.0430 * Math.sqrt(adjustedComplex) + 3.1291;
		}
		return 1.0430 * Math.sqrt(complexWords * (30 / totalSentences)) + 3.1291;
	}

	/**
	 * Gunning Fog Index
	 * Estimates years of formal education needed
	 */
	private calculateGunningFog(
		avgSentenceLength: number,
		complexWords: number,
		totalWords: number
	): number {
		const complexRatio = complexWords / Math.max(totalWords, 1);
		return 0.4 * (avgSentenceLength + 100 * complexRatio);
	}

	/**
	 * Automated Readability Index
	 * Based on characters per word and words per sentence
	 */
	private calculateARI(totalWords: number, totalSentences: number, totalChars: number): number {
		const charsPerWord = totalChars / Math.max(totalWords, 1);
		const wordsPerSentence = totalWords / Math.max(totalSentences, 1);
		return 4.71 * charsPerWord + 0.5 * wordsPerSentence - 21.43;
	}

	private extractSentences(text: string): string[] {
		// Split on sentence-ending punctuation
		return text
			.split(/[.!?…]+/)
			.map(s => s.trim())
			.filter(s => s.length > 0);
	}

	private extractWords(text: string): string[] {
		// Remove punctuation and split on whitespace
		return text
			.replace(/[^\w\sáàâãéêíóôõúç]/gi, ' ')
			.split(/\s+/)
			.filter(w => w.length > 0);
	}

	private extractParagraphs(text: string): string[] {
		return text
			.split(/\n\s*\n/)
			.map(p => p.trim())
			.filter(p => p.length > 0);
	}

	private countTotalSyllables(words: string[]): number {
		return words.reduce((total, word) => total + this.countSyllables(word), 0);
	}

	private countSyllables(word: string): number {
		word = word.toLowerCase();

		if (word.length <= 2) return 1;

		if (this.language.startsWith('pt')) {
			return this.countSyllablesPortuguese(word);
		}

		return this.countSyllablesEnglish(word);
	}

	private countSyllablesPortuguese(word: string): number {
		// Count vowel groups, adjusting for diphthongs
		const vowelMatches = word.match(ReadabilityAnalyzer.PT_VOWELS) || [];
		const diphthongMatches = word.match(ReadabilityAnalyzer.PT_DIPHTHONGS) || [];

		// Each vowel is potentially a syllable, but diphthongs count as one
		let count = vowelMatches.length - diphthongMatches.length;

		// Hiatus adjustments (common in Portuguese)
		const hiatusPatterns = /[aeo][aeo]/gi;
		const hiatusMatches = word.match(hiatusPatterns) || [];
		count += hiatusMatches.length;

		return Math.max(1, count);
	}

	private countSyllablesEnglish(word: string): number {
		// Remove silent e at end
		word = word.replace(/e$/, '');

		const matches = word.match(ReadabilityAnalyzer.EN_VOWELS) || [];
		let count = matches.length;

		// Adjust for common patterns
		if (word.endsWith('le') && word.length > 2) count++;
		if (word.endsWith('es') || word.endsWith('ed')) count--;

		return Math.max(1, count);
	}

	/**
	 * Complex words = words with 3+ syllables
	 * Excluding common suffixes and compound words
	 */
	private countComplexWords(words: string[]): number {
		return words.filter(word => {
			if (word.length < 6) return false;

			const syllables = this.countSyllables(word);
			if (syllables < 3) return false;

			// Exclude words with common suffixes that add syllables
			const commonSuffixes = this.language.startsWith('pt')
				? ['mente', 'ção', 'ções', 'dade', 'mento', 'ando', 'endo', 'indo']
				: ['ing', 'ed', 'es', 'ly', 'tion', 'ness'];

			for (const suffix of commonSuffixes) {
				if (word.endsWith(suffix)) {
					const base = word.slice(0, -suffix.length);
					if (this.countSyllables(base) >= 2) return false;
				}
			}

			return true;
		}).length;
	}

	/**
	 * Get readability interpretation
	 */
	interpret(metrics: ReadabilityMetrics): {
		level: string;
		audience: string;
		suggestion: string;
	} {
		const fk = metrics.fleschKincaid;

		if (fk <= 6) {
			return {
				level: 'Muito Fácil',
				audience: 'Ensino Fundamental I',
				suggestion: 'Apropriado para leitores jovens ou textos introdutórios',
			};
		} else if (fk <= 8) {
			return {
				level: 'Fácil',
				audience: 'Ensino Fundamental II',
				suggestion: 'Bom para público geral e ficção comercial',
			};
		} else if (fk <= 10) {
			return {
				level: 'Moderado',
				audience: 'Ensino Médio',
				suggestion: 'Ideal para ficção adulta e não-ficção acessível',
			};
		} else if (fk <= 12) {
			return {
				level: 'Moderadamente Difícil',
				audience: 'Ensino Médio Superior',
				suggestion: 'Apropriado para ficção literária e não-ficção especializada',
			};
		} else if (fk <= 14) {
			return {
				level: 'Difícil',
				audience: 'Universitário',
				suggestion: 'Considere simplificar para públicos mais amplos',
			};
		} else {
			return {
				level: 'Muito Difícil',
				audience: 'Pós-graduação / Acadêmico',
				suggestion: 'Texto muito complexo; simplificação recomendada',
			};
		}
	}
}
