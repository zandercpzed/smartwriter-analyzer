import { ManuscriptParser } from '../manuscript-parser';

describe('ManuscriptParser', () => {
	let parser: ManuscriptParser;

	beforeEach(() => {
		parser = new ManuscriptParser();
	});

	it('should parse a simple manuscript with chapters', () => {
		const content = `---
title: My Book
---
# Chapter 1
Hello world.

# Chapter 2
This is the second chapter.
`;
		const structure = parser.parse(content, 'test.md');

		expect(structure.title).toBe('My Book');
		expect(structure.chapters).toHaveLength(2);
		expect(structure.chapters[0].title).toBe('Chapter 1');
		expect(structure.chapters[1].title).toBe('Chapter 2');
	});

	it('should count words correctly', () => {
		const content = 'One two three four five.';
		expect(parser.countWords(content)).toBe(5);
	});

	it('should count sentences correctly', () => {
		const content = 'First sentence. Second sentence! Third sentence?';
		expect(parser.countSentences(content)).toBe(3);
	});

	it('should count paragraphs correctly', () => {
		const content = 'Paragraph 1.\n\nParagraph 2.';
		expect(parser.countParagraphs(content)).toBe(2);
	});

	it('should detect chapters with different patterns', () => {
		const content = `
## Capítulo 1
Content 1

# 2. The Return
Content 2

Chapter 3
Content 3
`;
		const structure = parser.parse(content, 'test.md');
		expect(structure.chapters).toHaveLength(3);
		expect(structure.chapters[0].title).toBe('Capítulo 1');
		expect(structure.chapters[1].title).toBe('The Return');
		expect(structure.chapters[2].title).toBe('Chapter 3');
	});
});
