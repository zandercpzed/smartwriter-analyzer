// src/main.ts
// SmartWriter Analyzer - Main Plugin Entry Point

import { App, Plugin, PluginSettingTab, Setting, Notice, TFile, Modal, MarkdownView } from 'obsidian';
import { SmartWriterSettings, DEFAULT_SETTINGS, ReportType, AnalysisProgress } from './types';
import { ManuscriptParser } from './parsers/manuscript-parser';
import { ChunkManager } from './core/chunk-manager';
import { CacheManager } from './core/cache-manager';
import { LLMService } from './llm/llm-service';
import { AnalysisOrchestrator } from './core/analysis-orchestrator';
import { ReportGenerator } from './reports/report-generator';
import { AnalysisModal } from './ui/analysis-modal';

export default class SmartWriterPlugin extends Plugin {
	settings: SmartWriterSettings;
	cacheManager: CacheManager;
	llmService: LLMService;
	orchestrator: AnalysisOrchestrator;

	async onload() {
		await this.loadSettings();

		// Initialize services
		this.cacheManager = new CacheManager(this);
		this.llmService = new LLMService(this.settings);
		this.orchestrator = new AnalysisOrchestrator(
			this.settings,
			this.llmService,
			this.cacheManager
		);

		// Add ribbon icon
		this.addRibbonIcon('book-open', 'SmartWriter Analyzer', () => {
			this.openAnalysisModal();
		});

		// Register commands
		this.addCommand({
			id: 'analyze-manuscript',
			name: 'Analyze manuscript',
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile && activeFile.extension === 'md') {
					if (!checking) {
						this.openAnalysisModal();
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: 'quick-readability',
			name: 'Quick readability check',
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile && activeFile.extension === 'md') {
					if (!checking) {
						this.runQuickAnalysis(['readability']);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: 'detect-ai',
			name: 'Detect AI artifacts',
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile && activeFile.extension === 'md') {
					if (!checking) {
						this.runQuickAnalysis(['ai-detection']);
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: 'clear-cache',
			name: 'Clear analysis cache',
			callback: () => {
				this.cacheManager.clearAll();
				new Notice('SmartWriter: Cache cleared');
			},
		});

		// Add settings tab
		this.addSettingTab(new SmartWriterSettingTab(this.app, this));

		// Status bar
		this.addStatusBarItem().setText('SmartWriter Ready');

		console.log('SmartWriter Analyzer loaded');
	}

	onunload() {
		console.log('SmartWriter Analyzer unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Update LLM service with new settings
		this.llmService?.updateSettings(this.settings);
	}

	private openAnalysisModal() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('No file open');
			return;
		}

		new AnalysisModal(this.app, this, activeFile).open();
	}

	private async runQuickAnalysis(reportTypes: ReportType[]) {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice('No file open');
			return;
		}

		const statusBar = this.addStatusBarItem();
		statusBar.setText('SmartWriter: Analyzing...');

		try {
			const content = await this.app.vault.read(activeFile);
			const report = await this.orchestrator.analyze(
				{
					manuscriptPath: activeFile.path,
					manuscriptContent: content,
					wordCount: this.countWords(content),
					selectedReports: reportTypes,
				},
				(progress: AnalysisProgress) => {
					statusBar.setText(`SmartWriter: ${progress.message} (${progress.percentage}%)`);
				}
			);

			// Generate and save report
			const generator = new ReportGenerator(this.settings);
			const reportContent = generator.generate(report);
			await this.saveReport(activeFile.basename, reportContent);

			statusBar.setText('SmartWriter: Complete');
			new Notice('Analysis complete! Report saved.');

		} catch (error) {
			console.error('Analysis failed:', error);
			statusBar.setText('SmartWriter: Error');
			new Notice(`Analysis failed: ${error.message}`);
		}
	}

	async runFullAnalysis(
		file: TFile,
		reportTypes: ReportType[],
		progressCallback: (progress: AnalysisProgress) => void
	) {
		const content = await this.app.vault.read(file);

		const report = await this.orchestrator.analyze(
			{
				manuscriptPath: file.path,
				manuscriptContent: content,
				wordCount: this.countWords(content),
				selectedReports: reportTypes,
				persona: 'helena-vasconcelos',
			},
			progressCallback
		);

		// Generate and save report
		const generator = new ReportGenerator(this.settings);
		const reportContent = generator.generate(report);
		const reportPath = await this.saveReport(file.basename, reportContent);

		return reportPath;
	}

	private async saveReport(manuscriptName: string, content: string): Promise<string> {
		const folder = this.settings.reportOutputFolder;
		const timestamp = new Date().toISOString().split('T')[0];
		const fileName = `${manuscriptName}_Analysis_${timestamp}.md`;
		const path = `${folder}/${fileName}`;

		// Ensure folder exists
		if (!await this.app.vault.adapter.exists(folder)) {
			await this.app.vault.createFolder(folder);
		}

		// Create or overwrite report file
		const existingFile = this.app.vault.getAbstractFileByPath(path);
		if (existingFile instanceof TFile) {
			await this.app.vault.modify(existingFile, content);
		} else {
			await this.app.vault.create(path, content);
		}

		return path;
	}

	private countWords(text: string): number {
		return text.split(/\s+/).filter(word => word.length > 0).length;
	}
}

// Settings Tab
class SmartWriterSettingTab extends PluginSettingTab {
	plugin: SmartWriterPlugin;

	constructor(app: App, plugin: SmartWriterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// LLM Provider Section
		containerEl.createEl('h2', { text: 'LLM configuration' });

		new Setting(containerEl)
			.setName('Provider')
			.setDesc('Select the LLM provider for analysis')
			.addDropdown(dropdown => dropdown
				.addOption('ollama', 'Ollama (Local)')
				.addOption('claude', 'Claude (Anthropic)')
				.addOption('openai', 'OpenAI')
				.addOption('gemini', 'Gemini (Google)')
				.setValue(this.plugin.settings.llmProvider)
				.onChange(async (value: string) => {
					this.plugin.settings.llmProvider = value as 'ollama' | 'claude' | 'openai' | 'gemini';
					await this.plugin.saveSettings();
					this.display(); // Refresh to show relevant settings
				}));

		// Provider-specific settings
		if (this.plugin.settings.llmProvider === 'ollama') {
			new Setting(containerEl)
				.setName('Ollama endpoint')
				.setDesc('URL of your Ollama server')
				.addText(text => text
					.setPlaceholder('http://localhost:11434')
					.setValue(this.plugin.settings.ollamaEndpoint)
					.onChange(async (value) => {
						this.plugin.settings.ollamaEndpoint = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Model')
				.setDesc('Ollama model to use (e.g., llama3.1, mistral)')
				.addText(text => text
					.setPlaceholder('llama3.1')
					.setValue(this.plugin.settings.ollamaModel)
					.onChange(async (value) => {
						this.plugin.settings.ollamaModel = value;
						await this.plugin.saveSettings();
					}));
		}

		if (this.plugin.settings.llmProvider === 'claude') {
			new Setting(containerEl)
				.setName('API key')
				.setDesc('Your Anthropic API key')
				.addText(text => text
					.setPlaceholder('sk-ant-...')
					.setValue(this.plugin.settings.claudeApiKey)
					.onChange(async (value) => {
						this.plugin.settings.claudeApiKey = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Model')
				.setDesc('Claude model to use')
				.addDropdown(dropdown => dropdown
					.addOption('claude-sonnet-4-20250514', 'Claude Sonnet 4')
					.addOption('claude-3-5-sonnet-20241022', 'Claude 3.5 Sonnet')
					.addOption('claude-3-opus-20240229', 'Claude 3 Opus')
					.setValue(this.plugin.settings.claudeModel)
					.onChange(async (value) => {
						this.plugin.settings.claudeModel = value;
						await this.plugin.saveSettings();
					}));
		}

		if (this.plugin.settings.llmProvider === 'openai') {
			new Setting(containerEl)
				.setName('API key')
				.setDesc('Your OpenAI API key')
				.addText(text => text
					.setPlaceholder('sk-...')
					.setValue(this.plugin.settings.openaiApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openaiApiKey = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Model')
				.setDesc('OpenAI model to use')
				.addDropdown(dropdown => dropdown
					.addOption('gpt-4o', 'GPT-4o')
					.addOption('gpt-4-turbo', 'GPT-4 Turbo')
					.addOption('gpt-4', 'GPT-4')
					.setValue(this.plugin.settings.openaiModel)
					.onChange(async (value) => {
						this.plugin.settings.openaiModel = value;
						await this.plugin.saveSettings();
					}));
		}

		if (this.plugin.settings.llmProvider === 'gemini') {
			new Setting(containerEl)
				.setName('API key')
				.setDesc('Your Google Gemini API key')
				.addText(text => text
					.setPlaceholder('AIz...')
					.setValue(this.plugin.settings.geminiApiKey)
					.onChange(async (value) => {
						this.plugin.settings.geminiApiKey = value;
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Model')
				.setDesc('Gemini model to use')
				.addDropdown(dropdown => dropdown
					.addOption('gemini-2.0-flash', 'Gemini 2.0 Flash')
					.addOption('gemini-1.5-pro', 'Gemini 1.5 Pro')
					.addOption('gemini-1.5-flash', 'Gemini 1.5 Flash')
					.setValue(this.plugin.settings.geminiModel)
					.onChange(async (value) => {
						this.plugin.settings.geminiModel = value;
						await this.plugin.saveSettings();
					}));
		}

		// Analysis Settings
		containerEl.createEl('h2', { text: 'Analysis configuration' });

		new Setting(containerEl)
			.setName('Chunk size')
			.setDesc('Words per analysis chunk (larger = more context, slower)')
			.addSlider(slider => slider
				.setLimits(5000, 50000, 1000)
				.setValue(this.plugin.settings.chunkSize)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.chunkSize = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Cache duration')
			.setDesc('Days to keep cached analysis results')
			.addSlider(slider => slider
				.setLimits(1, 90, 1)
				.setValue(this.plugin.settings.cacheDurationDays)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.cacheDurationDays = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Language')
			.setDesc('Primary language for analysis')
			.addDropdown(dropdown => dropdown
				.addOption('pt-BR', 'Português (Brasil)')
				.addOption('en-US', 'English (US)')
				.addOption('es-ES', 'Español')
				.setValue(this.plugin.settings.language)
				.onChange(async (value: string) => {
					this.plugin.settings.language = value as 'pt-BR' | 'en-US' | 'es-ES';
					await this.plugin.saveSettings();
				}));

		// Features
		containerEl.createEl('h2', { text: 'Features' });

		new Setting(containerEl)
			.setName('AI detection')
			.setDesc('Enable DETECT-AI protocol for artifact detection')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableAIDetection)
				.onChange(async (value) => {
					this.plugin.settings.enableAIDetection = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('ABNT formatting')
			.setDesc('Enable ABNT academic formatting option')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableABNTFormatting)
				.onChange(async (value) => {
					this.plugin.settings.enableABNTFormatting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Auto-save reports')
			.setDesc('Automatically save generated reports')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoSaveReports)
				.onChange(async (value) => {
					this.plugin.settings.autoSaveReports = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Report folder')
			.setDesc('Folder for saved reports')
			.addText(text => text
				.setPlaceholder('SmartWriter Reports')
				.setValue(this.plugin.settings.reportOutputFolder)
				.onChange(async (value) => {
					this.plugin.settings.reportOutputFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}
