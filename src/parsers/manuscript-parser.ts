// src/parsers/manuscript-parser.ts
// Parser for manuscript structure and content extraction

export interface ManuscriptStructure {
	title: string;
	chapters: Chapter[];
	totalWords: number;
	totalParagraphs: number;
	totalSentences: number;
	metadata: ManuscriptMetadata;
}

export interface Chapter {
	index: number;
	title: string;
	content: string;
	startPosition: number;
	endPosition: number;
	wordCount: number;
	paragraphCount: number;
	sentenceCount: number;
}

export interface ManuscriptMetadata {
	frontMatter: Record<string, unknown>;
	hasTableOfContents: boolean;
	estimatedReadingTime: number; // minutes
}

export class ManuscriptParser {
	private static readonly CHAPTER_PATTERNS = [
		/^#{1,2}\s+(?:Capítulo|Chapter|Cap\.?)\s*(\d+)/im,
		/^#{1,2}\s+(\d+)\s*[-–—:.]?\s*(.+)?$/im,
		/^(?:Capítulo|Chapter|Cap\.?)\s*(\d+)/im,
		/^#{1,2}\s+(.+)$/im, // Generic heading
	];

	private static readonly SENTENCE_END = /[.!?…]+[\s\n]+/g;
	private static readonly PARAGRAPH_SPLIT = /\n\s*\n/g;

	parse(content: string, fileName: string): ManuscriptStructure {
		// Extract front matter if present
		const { frontMatter, body } = this.extractFrontMatter(content);

		// Detect and parse chapters
		const chapters = this.parseChapters(body);

		// Calculate totals efficiently
		const totalWords = this.countWords(body);
		const totalParagraphs = this.countParagraphs(body);
		const totalSentences = this.countSentences(body);

		return {
			title: this.extractTitle(frontMatter, fileName),
			chapters,
			totalWords,
			totalParagraphs,
			totalSentences,
			metadata: {
				frontMatter,
				hasTableOfContents: this.detectTableOfContents(body),
				estimatedReadingTime: Math.ceil(totalWords / 200), // ~200 wpm reading speed
			},
		};
	}

	private extractFrontMatter(content: string): { frontMatter: Record<string, unknown>; body: string } {
		const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
		const match = content.match(frontMatterRegex);

		if (!match) {
			return { frontMatter: {}, body: content };
		}

		try {
			// Simple YAML-like parsing (key: value)
			const frontMatter: Record<string, unknown> = {};
			const lines = match[1].split('\n');

			for (const line of lines) {
				const colonIndex = line.indexOf(':');
				if (colonIndex > 0) {
					const key = line.substring(0, colonIndex).trim();
					const value = line.substring(colonIndex + 1).trim();
					frontMatter[key] = value;
				}
			}

			return {
				frontMatter,
				body: content.substring(match[0].length),
			};
		} catch {
			return { frontMatter: {}, body: content };
		}
	}

	private parseChapters(content: string): Chapter[] {
		const chapters: Chapter[] = [];
		const chapterHeadingRegex = /^(?:#{1,2}\s+(?:Capítulo|Chapter|Cap\.?)\s*\d+|#{1,2}\s+\d+\s*[-–—:.]?\s*.+|(?:Capítulo|Chapter|Cap\.?)\s*\d+|#{1,2}\s+.+)$/gim;
		
		let match;
		let lastIndex = 0;
		let chapterIndex = 0;

		while ((match = chapterHeadingRegex.exec(content)) !== null) {
			const currentMatchIndex = match.index;

			// If we have content before this chapter heading, it's the content of the previous chapter
			if (currentMatchIndex > lastIndex) {
				const previousContent = content.substring(lastIndex, currentMatchIndex);
				
				if (chapters.length > 0) {
					const lastChapter = chapters[chapters.length - 1];
					lastChapter.content = previousContent.trim();
					lastChapter.endPosition = currentMatchIndex;
					lastChapter.wordCount = this.countWords(lastChapter.content);
					lastChapter.paragraphCount = this.countParagraphs(lastChapter.content);
					lastChapter.sentenceCount = this.countSentences(lastChapter.content);
				} else if (previousContent.trim()) {
					// Prologue or content before first chapter
					chapterIndex++;
					chapters.push({
						index: chapterIndex,
						title: 'Prologue',
						content: previousContent.trim(),
						startPosition: lastIndex,
						endPosition: currentMatchIndex,
						wordCount: this.countWords(previousContent.trim()),
						paragraphCount: this.countParagraphs(previousContent.trim()),
						sentenceCount: this.countSentences(previousContent.trim()),
					});
				}
			}

			// Prepare new chapter
			chapterIndex++;
			chapters.push({
				index: chapterIndex,
				title: this.extractChapterTitle(match[0]),
				content: '', // Will be filled in next iteration or at the end
				startPosition: currentMatchIndex,
				endPosition: content.length,
				wordCount: 0,
				paragraphCount: 0,
				sentenceCount: 0,
			} as Chapter);

			lastIndex = currentMatchIndex + match[0].length;
		}

		// Handle last chapter content
		if (chapters.length > 0) {
			const lastChapter = chapters[chapters.length - 1];
			const finalContent = content.substring(lastIndex);
			lastChapter.content = finalContent.trim();
			lastChapter.endPosition = content.length;
			lastChapter.wordCount = this.countWords(lastChapter.content);
			lastChapter.paragraphCount = this.countParagraphs(lastChapter.content);
			lastChapter.sentenceCount = this.countSentences(lastChapter.content);
		}

		// If no chapters detected, treat entire content as one chapter
		if (chapters.length === 0) {
			chapters.push({
				index: 1,
				title: 'Content',
				content: content.trim(),
				startPosition: 0,
				endPosition: content.length,
				wordCount: this.countWords(content),
				paragraphCount: this.countParagraphs(content),
				sentenceCount: this.countSentences(content),
			});
		}

		return chapters;
	}

	private isChapterHeading(line: string): boolean {
		for (const pattern of ManuscriptParser.CHAPTER_PATTERNS) {
			if (pattern.test(line.trim())) {
				return true;
			}
		}
		return false;
	}

	private extractChapterTitle(line: string): string {
		// Remove markdown heading markers
		let title = line.replace(/^#+\s*/, '').trim();

		// Remove "Capítulo X" prefix if present
		title = title.replace(/^(?:Capítulo|Chapter|Cap\.?)\s*\d+\s*[-–—:.]?\s*/i, '').trim();

		return title || `Chapter`;
	}

	private extractTitle(frontMatter: Record<string, unknown>, fileName: string): string {
		if (frontMatter.title && typeof frontMatter.title === 'string') {
			return frontMatter.title;
		}
		// Use filename without extension
		return fileName.replace(/\.md$/i, '');
	}

	private detectTableOfContents(content: string): boolean {
		const tocPatterns = [
			/sumário/i,
			/table of contents/i,
			/índice/i,
			/contents/i,
		];

		const first2000Chars = content.substring(0, 2000);
		return tocPatterns.some(pattern => pattern.test(first2000Chars));
	}

	countWords(text: string): number {
		if (!text) return 0;
		const matches = text.match(/\S+/g);
		return matches ? matches.length : 0;
	}

	countSentences(text: string): number {
		if (!text) return 0;
		const matches = text.match(/[.!?…]+[\s\n]+/g);
		return (matches ? matches.length : 0) + 1; // +1 for the last sentence if it doesn't end with punctuation
	}

	countParagraphs(text: string): number {
		if (!text) return 0;
		const matches = text.match(/\n\s*\n/g);
		return (matches ? matches.length : 0) + 1;
	}

	// Extract sentences for analysis
	extractSentences(text: string): string[] {
		return text
			.split(ManuscriptParser.SENTENCE_END)
			.map(s => s.trim())
			.filter(s => s.length > 0);
	}

	// Extract paragraphs for analysis
	extractParagraphs(text: string): string[] {
		return text
			.split(ManuscriptParser.PARAGRAPH_SPLIT)
			.map(p => p.trim())
			.filter(p => p.length > 0);
	}

	// Get text samples for AI detection
	getSamples(content: string, sampleSize: number = 500, sampleCount: number = 10): string[] {
		const words = content.split(/\s+/);
		const totalWords = words.length;

		if (totalWords <= sampleSize * sampleCount) {
			// Content is small enough, return evenly distributed samples
			return this.splitIntoChunks(content, Math.ceil(totalWords / sampleCount))
				.map(chunk => chunk.slice(0, sampleSize));
		}

		// Distribute samples across the document
		const samples: string[] = [];
		const interval = Math.floor(totalWords / (sampleCount + 1));

		for (let i = 1; i <= sampleCount; i++) {
			const startIndex = interval * i;
			const sampleWords = words.slice(startIndex, startIndex + sampleSize);
			samples.push(sampleWords.join(' '));
		}

		return samples;
	}

	private splitIntoChunks(content: string, wordsPerChunk: number): string[] {
		const words = content.split(/\s+/);
		const chunks: string[] = [];

		for (let i = 0; i < words.length; i += wordsPerChunk) {
			chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
		}

		return chunks;
	}
}
