// src/core/chunk-manager.ts
// Manages chunking of large manuscripts for LLM processing

import { Chunk, ChunkingResult, SmartWriterSettings } from '../types';
import { Chapter } from '../parsers/manuscript-parser';

export class ChunkManager {
	private settings: SmartWriterSettings;

	constructor(settings: SmartWriterSettings) {
		this.settings = settings;
	}

	updateSettings(settings: SmartWriterSettings) {
		this.settings = settings;
	}

	/**
	 * Chunks a manuscript into processable segments.
	 * Attempts to respect chapter boundaries when possible.
	 */
	chunkManuscript(content: string, chapters: Chapter[]): ChunkingResult {
		const chunkSize = this.settings.chunkSize;
		const chunks: Chunk[] = [];
		const chapterBoundaries: number[] = [];

		// If chapters are small enough, use them as natural boundaries
		if (this.canUseChapterBoundaries(chapters, chunkSize)) {
			return this.chunkByChapters(chapters, chunkSize);
		}

		// Otherwise, chunk by word count with paragraph boundary respect
		return this.chunkBySize(content, chunkSize);
	}

	private canUseChapterBoundaries(chapters: Chapter[], chunkSize: number): boolean {
		// Check if all chapters fit within chunk size or can be combined efficiently
		const avgChapterSize = chapters.reduce((sum, c) => sum + c.wordCount, 0) / chapters.length;
		return avgChapterSize <= chunkSize * 0.8; // 80% of chunk size threshold
	}

	private chunkByChapters(chapters: Chapter[], maxChunkSize: number): ChunkingResult {
		const chunks: Chunk[] = [];
		const chapterBoundaries: number[] = [];
		let totalWords = 0;

		let currentChunk: { content: string[]; chapters: number[]; wordCount: number } = {
			content: [],
			chapters: [],
			wordCount: 0,
		};
		let position = 0;

		for (const chapter of chapters) {
			// If adding this chapter exceeds limit, save current chunk and start new
			if (currentChunk.wordCount + chapter.wordCount > maxChunkSize && currentChunk.content.length > 0) {
				chunks.push({
					index: chunks.length,
					content: currentChunk.content.join('\n\n'),
					startPosition: position - currentChunk.content.join('\n\n').length,
					endPosition: position,
					wordCount: currentChunk.wordCount,
					chapterIndices: currentChunk.chapters,
				});
				chapterBoundaries.push(chunks.length - 1);
				currentChunk = { content: [], chapters: [], wordCount: 0 };
			}

			// If single chapter exceeds limit, split it
			if (chapter.wordCount > maxChunkSize) {
				// Save any pending content first
				if (currentChunk.content.length > 0) {
					chunks.push({
						index: chunks.length,
						content: currentChunk.content.join('\n\n'),
						startPosition: position - currentChunk.content.join('\n\n').length,
						endPosition: position,
						wordCount: currentChunk.wordCount,
						chapterIndices: currentChunk.chapters,
					});
					currentChunk = { content: [], chapters: [], wordCount: 0 };
				}

				// Split large chapter
				const subChunks = this.splitLargeChapter(chapter, maxChunkSize, chunks.length);
				chunks.push(...subChunks);
				position += chapter.content.length;
			} else {
				currentChunk.content.push(chapter.content);
				currentChunk.chapters.push(chapter.index);
				currentChunk.wordCount += chapter.wordCount;
				position += chapter.content.length + 2; // +2 for paragraph separator
			}

			totalWords += chapter.wordCount;
		}

		// Don't forget the last chunk
		if (currentChunk.content.length > 0) {
			chunks.push({
				index: chunks.length,
				content: currentChunk.content.join('\n\n'),
				startPosition: position - currentChunk.content.join('\n\n').length,
				endPosition: position,
				wordCount: currentChunk.wordCount,
				chapterIndices: currentChunk.chapters,
			});
		}

		return {
			chunks,
			totalChunks: chunks.length,
			totalWords,
			chapterBoundaries,
		};
	}

	private splitLargeChapter(chapter: Chapter, maxChunkSize: number, startIndex: number): Chunk[] {
		const chunks: Chunk[] = [];
		const paragraphs = chapter.content.split(/\n\s*\n/).filter(p => p.trim());

		let currentContent: string[] = [];
		let currentWordCount = 0;
		let position = chapter.startPosition;

		for (const paragraph of paragraphs) {
			const paragraphWords = this.countWords(paragraph);

			if (currentWordCount + paragraphWords > maxChunkSize && currentContent.length > 0) {
				chunks.push({
					index: startIndex + chunks.length,
					content: currentContent.join('\n\n'),
					startPosition: position,
					endPosition: position + currentContent.join('\n\n').length,
					wordCount: currentWordCount,
					chapterIndices: [chapter.index],
				});
				position += currentContent.join('\n\n').length + 2;
				currentContent = [];
				currentWordCount = 0;
			}

			currentContent.push(paragraph);
			currentWordCount += paragraphWords;
		}

		// Last chunk from chapter
		if (currentContent.length > 0) {
			chunks.push({
				index: startIndex + chunks.length,
				content: currentContent.join('\n\n'),
				startPosition: position,
				endPosition: position + currentContent.join('\n\n').length,
				wordCount: currentWordCount,
				chapterIndices: [chapter.index],
			});
		}

		return chunks;
	}

	private chunkBySize(content: string, maxChunkSize: number): ChunkingResult {
		const chunks: Chunk[] = [];
		const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

		let currentContent: string[] = [];
		let currentWordCount = 0;
		let position = 0;
		let totalWords = 0;

		for (const paragraph of paragraphs) {
			const paragraphWords = this.countWords(paragraph);

			if (currentWordCount + paragraphWords > maxChunkSize && currentContent.length > 0) {
				chunks.push({
					index: chunks.length,
					content: currentContent.join('\n\n'),
					startPosition: position - currentContent.join('\n\n').length,
					endPosition: position,
					wordCount: currentWordCount,
					chapterIndices: [], // Unknown without chapter parsing
				});
				currentContent = [];
				currentWordCount = 0;
			}

			currentContent.push(paragraph);
			currentWordCount += paragraphWords;
			totalWords += paragraphWords;
			position += paragraph.length + 2;
		}

		// Final chunk
		if (currentContent.length > 0) {
			chunks.push({
				index: chunks.length,
				content: currentContent.join('\n\n'),
				startPosition: position - currentContent.join('\n\n').length,
				endPosition: position,
				wordCount: currentWordCount,
				chapterIndices: [],
			});
		}

		return {
			chunks,
			totalChunks: chunks.length,
			totalWords,
			chapterBoundaries: [],
		};
	}

	private countWords(text: string): number {
		return text.split(/\s+/).filter(w => w.length > 0).length;
	}

	/**
	 * Estimates token count for a chunk.
	 * Rough approximation: ~1.3 tokens per word for English,
	 * ~1.5 for Portuguese due to longer words.
	 */
	estimateTokens(wordCount: number, language: string = 'pt-BR'): number {
		const multiplier = language.startsWith('pt') ? 1.5 : 1.3;
		return Math.ceil(wordCount * multiplier);
	}

	/**
	 * Creates a summary context from multiple chunks for global analysis.
	 * Useful for maintaining coherence across chunk boundaries.
	 */
	createSummaryContext(chunks: Chunk[], summaryWordLimit: number = 500): string {
		const summaries: string[] = [];
		const wordsPerChunk = Math.floor(summaryWordLimit / chunks.length);

		for (const chunk of chunks) {
			const words = chunk.content.split(/\s+/);
			const summary = words.slice(0, Math.min(wordsPerChunk, words.length)).join(' ');
			summaries.push(`[Chunk ${chunk.index + 1}]: ${summary}...`);
		}

		return summaries.join('\n\n');
	}

	/**
	 * Merges chunk analysis results into a coherent whole.
	 */
	mergeAnalysisResults<T>(results: T[], merger: (results: T[]) => T): T {
		return merger(results);
	}
}
