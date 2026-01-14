// src/core/analysis-orchestrator.ts
// Coordinates the full analysis pipeline

import { 
	SmartWriterSettings, 
	AnalysisRequest, 
	FullReport, 
	AnalysisProgress, 
	ProgressCallback,
	ReadabilityMetrics,
	CadenceMetrics,
	AIDetectionResult,
	StructureAnalysis,
	LiteraryQualityReport,
	ExecutiveSummary,
	ReportType,
} from '../types';
import { ManuscriptParser, ManuscriptStructure } from '../parsers/manuscript-parser';
import { ChunkManager } from './chunk-manager';
import { CacheManager } from './cache-manager';
import { LLMService } from '../llm/llm-service';
import { ReadabilityAnalyzer } from '../analyzers/readability';
import { CadenceAnalyzer } from '../analyzers/cadence';
import { AIDetectionAnalyzer } from '../analyzers/ai-detection';
import { HelenaVasconcelosPersona } from '../personas/helena-vasconcelos';

export class AnalysisOrchestrator {
	private settings: SmartWriterSettings;
	private llmService: LLMService;
	private cacheManager: CacheManager;
	private parser: ManuscriptParser;
	private chunkManager: ChunkManager;

	// Analyzers
	private readabilityAnalyzer: ReadabilityAnalyzer;
	private cadenceAnalyzer: CadenceAnalyzer;
	private aiDetectionAnalyzer: AIDetectionAnalyzer;

	// Personas
	private helenaPersona: HelenaVasconcelosPersona;

	constructor(
		settings: SmartWriterSettings,
		llmService: LLMService,
		cacheManager: CacheManager
	) {
		this.settings = settings;
		this.llmService = llmService;
		this.cacheManager = cacheManager;
		this.parser = new ManuscriptParser();
		this.chunkManager = new ChunkManager(settings);

		// Initialize analyzers
		this.readabilityAnalyzer = new ReadabilityAnalyzer(settings.language);
		this.cadenceAnalyzer = new CadenceAnalyzer();
		this.aiDetectionAnalyzer = new AIDetectionAnalyzer(llmService, settings);

		// Initialize personas
		this.helenaPersona = new HelenaVasconcelosPersona(llmService, settings);
	}

	async analyze(
		request: AnalysisRequest,
		onProgress?: ProgressCallback
	): Promise<FullReport> {
		const progress = this.createProgressTracker(onProgress);

		// Phase 1: Parsing
		progress.update('parsing', 0, 5, 'Parsing manuscript structure...');
		const structure = this.parser.parse(request.manuscriptContent, request.manuscriptPath);
		progress.update('parsing', 1, 5, 'Structure parsed');

		// Phase 2: Chunking (for large manuscripts)
		progress.update('chunking', 2, 5, 'Preparing analysis chunks...');
		const chunks = this.chunkManager.chunkManuscript(
			request.manuscriptContent,
			structure.chapters
		);
		progress.update('chunking', 2, 5, `Created ${chunks.totalChunks} analysis chunks`);

		// Phase 3: Run analyses
		const totalAnalyses = request.selectedReports.length;
		let completedAnalyses = 0;

		const report: Partial<FullReport> = {
			metadata: {
				manuscriptTitle: structure.title,
				manuscriptPath: request.manuscriptPath,
				wordCount: structure.totalWords,
				chapterCount: structure.chapters.length,
				analysisDate: new Date().toISOString(),
				persona: request.persona || 'none',
				version: '0.1.0',
			},
		};

		// Run selected analyses
		const contentHash = this.cacheManager.hashContent(request.manuscriptContent);

		for (const reportType of request.selectedReports) {
			try {
				progress.update(
					'analyzing',
					3,
					5,
					`Running ${reportType} analysis... (${completedAnalyses + 1}/${totalAnalyses})`
				);

				// Check cache first
				const cached = this.cacheManager.get(
					request.manuscriptPath,
					reportType,
					contentHash
				);

				if (cached) {
					this.assignAnalysisResult(report, reportType, cached);
					completedAnalyses++;
					continue;
				}

				// Run fresh analysis
				const result = await this.runAnalysis(
					reportType,
					request.manuscriptContent,
					structure,
					chunks,
					(subProgress) => {
						progress.update(
							'analyzing',
							3,
							5,
							`${reportType}: ${subProgress}`
						);
					}
				);

				// Cache result
				await this.cacheManager.set(
					request.manuscriptPath,
					reportType,
					contentHash,
					result,
					this.settings.cacheDurationDays
				);

				this.assignAnalysisResult(report, reportType, result);
			} catch (error) {
				console.error(`Analysis ${reportType} failed:`, error);
				// We don't throw here to allow other analyses to continue
				// but we might want to flag the failure in the report
				this.handleAnalysisFailure(report, reportType, error);
			} finally {
				completedAnalyses++;
			}
		}

		// Phase 4: Generate executive summary
		progress.update('synthesizing', 4, 5, 'Generating executive summary...');
		report.executiveSummary = await this.generateExecutiveSummary(report, structure);

		progress.update('generating', 5, 5, 'Analysis complete');

		return report as FullReport;
	}

	private async runAnalysis(
		type: ReportType,
		content: string,
		structure: ManuscriptStructure,
		chunks: ReturnType<ChunkManager['chunkManuscript']>,
		onSubProgress: (message: string) => void
	): Promise<unknown> {
		switch (type) {
			case 'readability':
				onSubProgress('Calculating readability metrics...');
				return this.readabilityAnalyzer.analyze(content);

			case 'cadence':
				onSubProgress('Analyzing rhythm and cadence...');
				return this.cadenceAnalyzer.analyze(content, structure.chapters);

			case 'ai-detection':
				onSubProgress('Running DETECT-AI protocol...');
				return this.aiDetectionAnalyzer.analyze(content, structure.chapters, onSubProgress);

			case 'literary-quality':
				onSubProgress('Performing literary quality analysis...');
				return this.helenaPersona.analyzeLiteraryQuality(
					content,
					structure,
					chunks,
					onSubProgress
				);

			case 'structure':
				onSubProgress('Analyzing narrative structure...');
				return this.helenaPersona.analyzeStructure(
					content,
					structure,
					onSubProgress
				);

			case 'coherence':
				onSubProgress('Checking coherence and consistency...');
				return this.helenaPersona.analyzeCoherence(
					content,
					structure,
					onSubProgress
				);

			default:
				throw new Error(`Unknown analysis type: ${type}`);
		}
	}

	private assignAnalysisResult(
		report: Partial<FullReport>,
		type: ReportType,
		result: unknown
	): void {
		switch (type) {
			case 'readability':
				report.readability = result as ReadabilityMetrics;
				break;
			case 'cadence':
				report.cadence = result as CadenceMetrics;
				break;
			case 'ai-detection':
				report.aiDetection = result as AIDetectionResult;
				break;
			case 'literary-quality':
				report.literaryQuality = result as LiteraryQualityReport;
				break;
			case 'structure':
				report.structure = result as StructureAnalysis;
				break;
		}
	}

	private handleAnalysisFailure(
		report: Partial<FullReport>,
		type: ReportType,
		error: any
	): void {
		// Initialize metadata errors if not present
		if (!report.metadata) {
			report.metadata = {
				manuscriptTitle: 'Unknown',
				manuscriptPath: '',
				wordCount: 0,
				chapterCount: 0,
				analysisDate: new Date().toISOString(),
				persona: 'none',
				version: '0.1.0',
			};
		}
		
		if (!report.metadata.errors) {
			report.metadata.errors = [];
		}

		report.metadata.errors.push({
			type,
			message: error.message || String(error),
			timestamp: new Date().toISOString(),
		});
	}

	private async generateExecutiveSummary(
		report: Partial<FullReport>,
		structure: ManuscriptStructure
	): Promise<ExecutiveSummary> {
		const strengths: string[] = [];
		const improvements: ExecutiveSummary['improvements'] = [];
		const scores: Record<string, number> = {};

		// Collect from readability
		if (report.readability) {
			const fk = report.readability.fleschKincaid;
			if (fk >= 8 && fk <= 12) {
				strengths.push('Readability level appropriate for general audience');
			} else if (fk > 14) {
				improvements.push({
					priority: 'medium',
					area: 'Readability',
					description: 'Text may be too complex for target audience',
					suggestion: 'Consider simplifying sentence structures and vocabulary',
				});
			}
			scores['readability'] = this.readabilityToScore(fk);
		}

		// Collect from cadence
		if (report.cadence) {
			if (report.cadence.rhythmPattern === 'varied') {
				strengths.push('Good sentence rhythm variation');
			} else if (report.cadence.rhythmPattern === 'uniform') {
				improvements.push({
					priority: 'low',
					area: 'Cadence',
					description: 'Sentence rhythm is monotonous',
					suggestion: 'Vary sentence lengths for better flow',
				});
			}
			scores['cadence'] = report.cadence.burstiness >= 0.3 ? 4 : 3;
		}

		// Collect from AI detection
		if (report.aiDetection) {
			const iul = report.aiDetection.iul;
			if (iul <= 15) {
				strengths.push('Text shows authentic human voice');
			} else if (iul > 35) {
				improvements.push({
					priority: 'high',
					area: 'Authenticity',
					description: `High AI artifact index (${iul}%)`,
					suggestion: 'Review and humanize flagged sections',
				});
			}
			scores['authenticity'] = iul <= 15 ? 5 : iul <= 35 ? 4 : iul <= 60 ? 3 : 2;
		}

		// Collect from literary quality
		if (report.literaryQuality) {
			scores['structure'] = report.literaryQuality.structureScore;
			scores['characters'] = report.literaryQuality.charactersScore;
			scores['voice'] = report.literaryQuality.voiceScore;
			scores['pacing'] = report.literaryQuality.pacingScore;
			scores['theme'] = report.literaryQuality.themeScore;

			strengths.push(...report.literaryQuality.strengths);
			improvements.push(...report.literaryQuality.improvements);
		}

		// Calculate overall and recommendation
		const avgScore = Object.values(scores).length > 0
			? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
			: 3;

		let recommendation: ExecutiveSummary['recommendation'];
		if (avgScore >= 4.5) {
			recommendation = 'ready-for-submission';
		} else if (avgScore >= 4) {
			recommendation = 'copyediting';
		} else if (avgScore >= 3.5) {
			recommendation = 'line-editing';
		} else if (avgScore >= 3) {
			recommendation = 'developmental-editing';
		} else {
			recommendation = 'structural-revision';
		}

		return {
			strengths,
			improvements: improvements.sort((a, b) => {
				const priority = { high: 0, medium: 1, low: 2 };
				return priority[a.priority] - priority[b.priority];
			}),
			scores,
			recommendation,
			notes: `Analysis based on ${structure.totalWords.toLocaleString()} words across ${structure.chapters.length} chapters.`,
		};
	}

	private readabilityToScore(fleschKincaid: number): number {
		if (fleschKincaid >= 6 && fleschKincaid <= 10) return 5;
		if (fleschKincaid >= 4 && fleschKincaid <= 12) return 4;
		if (fleschKincaid >= 2 && fleschKincaid <= 14) return 3;
		return 2;
	}

	private createProgressTracker(onProgress?: ProgressCallback) {
		return {
			update: (
				phase: AnalysisProgress['phase'],
				currentStep: number,
				totalSteps: number,
				message: string
			) => {
				if (onProgress) {
					onProgress({
						phase,
						currentStep,
						totalSteps,
						message,
						percentage: Math.round((currentStep / totalSteps) * 100),
					});
				}
			},
		};
	}
}
