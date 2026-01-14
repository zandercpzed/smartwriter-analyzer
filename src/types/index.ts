// src/types/index.ts
// Core types for SmartWriter Analyzer

export interface SmartWriterSettings {
	// LLM Configuration
	llmProvider: 'ollama' | 'claude' | 'openai';
	ollamaEndpoint: string;
	ollamaModel: string;
	claudeApiKey: string;
	claudeModel: string;
	openaiApiKey: string;
	openaiModel: string;

	// Analysis Configuration
	chunkSize: number;
	maxContextTokens: number;
	cacheDurationDays: number;
	language: 'pt-BR' | 'en-US' | 'es-ES';

	// Feature Flags
	enableABNTFormatting: boolean;
	enableAIDetection: boolean;
	autoSaveReports: boolean;
	reportOutputFolder: string;
}

export const DEFAULT_SETTINGS: SmartWriterSettings = {
	llmProvider: 'ollama',
	ollamaEndpoint: 'http://localhost:11434',
	ollamaModel: 'llama3.1',
	claudeApiKey: '',
	claudeModel: 'claude-sonnet-4-20250514',
	openaiApiKey: '',
	openaiModel: 'gpt-4o',

	chunkSize: 10000,
	maxContextTokens: 100000,
	cacheDurationDays: 30,
	language: 'pt-BR',

	enableABNTFormatting: false,
	enableAIDetection: true,
	autoSaveReports: true,
	reportOutputFolder: 'SmartWriter Reports',
};

// Analysis Types
export interface AnalysisRequest {
	manuscriptPath: string;
	manuscriptContent: string;
	wordCount: number;
	selectedReports: ReportType[];
	persona?: PersonaType;
}

export type ReportType = 
	| 'readability'
	| 'cadence'
	| 'coherence'
	| 'literary-quality'
	| 'ai-detection'
	| 'structure';

export type PersonaType = 'helena-vasconcelos';

// Readability Metrics
export interface ReadabilityMetrics {
	fleschKincaid: number;
	smog: number;
	gunningFog: number;
	ari: number;
	avgSentenceLength: number;
	avgParagraphLength: number;
	avgWordLength: number;
	complexWordRatio: number;
}

// Cadence Metrics
export interface CadenceMetrics {
	burstiness: number;
	sentenceLengthVariance: number;
	paragraphLengthVariance: number;
	rhythmPattern: 'uniform' | 'varied' | 'chaotic';
	pacingByChapter: ChapterPacing[];
}

export interface ChapterPacing {
	chapter: number;
	avgSentenceLength: number;
	burstiness: number;
	paceCategory: 'slow' | 'moderate' | 'fast';
}

// AI Detection (DETECT-AI Protocol)
export interface AIDetectionResult {
	iul: number; // Índice de Uso de LLM (0-100)
	classification: 'authentic' | 'assisted' | 'hybrid' | 'predominantly-ai' | 'ai-generated';
	artifacts: AIArtifact[];
	sampleAnalysis: SampleAnalysis[];
}

export interface AIArtifact {
	code: string;
	category: 'A' | 'B' | 'C' | 'D' | 'E';
	marker: string;
	description: string;
	weight: 'high' | 'medium' | 'low';
	instances: ArtifactInstance[];
}

export interface ArtifactInstance {
	location: string;
	excerpt: string;
	chapterIndex: number;
}

export interface SampleAnalysis {
	sampleIndex: number;
	location: string;
	wordCount: number;
	artifactsFound: string[];
	localIul: number;
}

// Structure Analysis
export interface StructureAnalysis {
	acts: ActAnalysis;
	beats: BeatAnalysis[];
	turningPoints: TurningPoint[];
	causalityScore: number;
}

export interface ActAnalysis {
	act1Percentage: number;
	act2Percentage: number;
	act3Percentage: number;
	balanceScore: number;
}

export interface BeatAnalysis {
	name: string;
	present: boolean;
	position: number; // percentage
	chapter: number;
	efficacy: number; // 1-5
}

export interface TurningPoint {
	name: string;
	chapter: number;
	position: number;
	strength: number; // 1-5
}

// Character Analysis
export interface CharacterAnalysis {
	name: string;
	role: 'protagonist' | 'antagonist' | 'supporting';
	type: 'flat' | 'round';
	dynamic: boolean;
	want: string;
	need: string;
	flaw: string;
	ghost: string;
	lie: string;
	arcScore: number;
}

// Full Report
export interface FullReport {
	metadata: ReportMetadata;
	readability?: ReadabilityMetrics;
	cadence?: CadenceMetrics;
	aiDetection?: AIDetectionResult;
	structure?: StructureAnalysis;
	characters?: CharacterAnalysis[];
	literaryQuality?: LiteraryQualityReport;
	executiveSummary: ExecutiveSummary;
}

export interface ReportMetadata {
	manuscriptTitle: string;
	manuscriptPath: string;
	wordCount: number;
	chapterCount: number;
	analysisDate: string;
	persona: string;
	version: string;
	errors?: AnalysisError[];
}

export interface AnalysisError {
	type: string;
	message: string;
	timestamp: string;
}

export interface LiteraryQualityReport {
	synopsis: string;
	structureScore: number;
	coherenceScore: number;
	charactersScore: number;
	voiceScore: number;
	pacingScore: number;
	worldbuildingScore: number;
	themeScore: number;
	genreConformityScore: number;
	overallScore: number;
	strengths: string[];
	improvements: PrioritizedImprovement[];
}

export interface PrioritizedImprovement {
	priority: 'high' | 'medium' | 'low';
	area: string;
	description: string;
	suggestion: string;
}

export interface ExecutiveSummary {
	strengths: string[];
	improvements: PrioritizedImprovement[];
	scores: Record<string, number>;
	recommendation: 'structural-revision' | 'developmental-editing' | 'line-editing' | 'copyediting' | 'ready-for-submission';
	notes: string;
}

// Cache Types
export interface CacheEntry {
	key: string;
	timestamp: number;
	expiresAt: number;
	data: unknown;
	manuscriptHash: string; // Hash of the content when this was cached
}

export interface AnalysisCache {
	manuscriptHash: string;
	entries: Record<string, CacheEntry>;
}

// Chunk Management
export interface Chunk {
	index: number;
	content: string;
	startPosition: number;
	endPosition: number;
	wordCount: number;
	chapterIndices: number[];
}

export interface ChunkingResult {
	chunks: Chunk[];
	totalChunks: number;
	totalWords: number;
	chapterBoundaries: number[];
}

// LLM Types
export interface LLMRequest {
	prompt: string;
	systemPrompt?: string;
	maxTokens?: number;
	temperature?: number;
}

export interface LLMResponse {
	content: string;
	tokensUsed: number;
	model: string;
	finishReason: string;
}

// Progress Tracking
export interface AnalysisProgress {
	phase: 'parsing' | 'chunking' | 'analyzing' | 'synthesizing' | 'generating';
	currentStep: number;
	totalSteps: number;
	message: string;
	percentage: number;
}

export type ProgressCallback = (progress: AnalysisProgress) => void;
