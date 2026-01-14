// src/ui/analysis-modal.ts
// Modal for selecting and running analysis

import { App, Modal, Setting, TFile, Notice, ButtonComponent } from 'obsidian';
import SmartWriterPlugin from '../main';
import { ReportType, AnalysisProgress } from '../types';

export class AnalysisModal extends Modal {
	private plugin: SmartWriterPlugin;
	private file: TFile;
	private selectedReports: Set<ReportType> = new Set(['readability', 'cadence']);
	private isAnalyzing = false;
	private progressEl: HTMLElement | null = null;
	private progressBarEl: HTMLElement | null = null;
	private progressTextEl: HTMLElement | null = null;
	private analyzeButton: ButtonComponent | null = null;

	constructor(app: App, plugin: SmartWriterPlugin, file: TFile) {
		super(app);
		this.plugin = plugin;
		this.file = file;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('swa-modal');

		// Header
		contentEl.createEl('h2', { text: 'SmartWriter Analyzer', cls: 'swa-modal-title' });

		// File info
		const fileInfo = contentEl.createDiv({ cls: 'swa-file-info' });
		fileInfo.createEl('p', { text: `Arquivo: ${this.file.basename}` });

		// Estimate word count
		this.app.vault.read(this.file).then(content => {
			const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
			fileInfo.createEl('p', { 
				text: `Palavras: ~${wordCount.toLocaleString()}`,
				cls: 'swa-word-count'
			});

			if (wordCount > 100000) {
				fileInfo.createEl('p', {
					text: '⚠️ Manuscrito grande - análise pode demorar alguns minutos',
					cls: 'swa-warning'
				});
			}
		});

		// Report selection
		contentEl.createEl('h3', { text: 'Selecione as análises' });

		const reportOptions = contentEl.createDiv({ cls: 'swa-report-options' });

		this.createReportOption(reportOptions, 'readability', 'Legibilidade', 
			'Flesch-Kincaid, SMOG, Gunning Fog, ARI');

		this.createReportOption(reportOptions, 'cadence', 'Cadência', 
			'Burstiness, ritmo, variação de frases');

		this.createReportOption(reportOptions, 'ai-detection', 'Detecção de IA', 
			'Protocolo DETECT-AI, IUL (Índice de Uso de LLM)');

		this.createReportOption(reportOptions, 'structure', 'Estrutura Narrativa', 
			'Save the Cat beats, proporção de atos, turning points');

		this.createReportOption(reportOptions, 'literary-quality', 'Qualidade Literária (Helena)', 
			'Análise completa: personagens, voz, tema, worldbuilding');

		// Progress section (hidden initially)
		this.progressEl = contentEl.createDiv({ cls: 'swa-progress-container' });
		this.progressEl.style.display = 'none';

		const progressBar = this.progressEl.createDiv({ cls: 'swa-progress-bar' });
		this.progressBarEl = progressBar.createDiv({ cls: 'swa-progress-fill' });
		this.progressBarEl.style.width = '0%';

		this.progressTextEl = this.progressEl.createDiv({ cls: 'swa-progress-text' });
		this.progressTextEl.setText('Preparando análise...');

		// Buttons
		const buttonContainer = contentEl.createDiv({ cls: 'swa-button-container' });
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '10px';
		buttonContainer.style.marginTop = '20px';

		new Setting(buttonContainer)
			.addButton(btn => {
				this.analyzeButton = btn;
				btn.setButtonText('Analisar')
					.setCta()
					.onClick(() => this.runAnalysis());
			})
			.addButton(btn => btn
				.setButtonText('Cancelar')
				.onClick(() => this.close())
			);
	}

	private createReportOption(
		container: HTMLElement,
		type: ReportType,
		label: string,
		description: string
	) {
		const option = container.createDiv({ cls: 'swa-report-option' });

		const checkbox = option.createEl('input', {
			type: 'checkbox',
			attr: { id: `swa-${type}` }
		});

		if (this.selectedReports.has(type)) {
			checkbox.checked = true;
			option.addClass('selected');
		}

		checkbox.addEventListener('change', () => {
			if (checkbox.checked) {
				this.selectedReports.add(type);
				option.addClass('selected');
			} else {
				this.selectedReports.delete(type);
				option.removeClass('selected');
			}
		});

		const labelContainer = option.createDiv({ cls: 'swa-option-label' });
		labelContainer.createEl('label', { 
			text: label, 
			attr: { for: `swa-${type}` },
			cls: 'swa-option-title'
		});
		labelContainer.createEl('small', { 
			text: description,
			cls: 'swa-option-desc'
		});

		option.addEventListener('click', (e) => {
			if (e.target !== checkbox) {
				checkbox.checked = !checkbox.checked;
				checkbox.dispatchEvent(new Event('change'));
			}
		});
	}

	private async runAnalysis() {
		if (this.isAnalyzing) return;

		if (this.selectedReports.size === 0) {
			new Notice('Selecione pelo menos uma análise');
			return;
		}

		this.isAnalyzing = true;
		this.analyzeButton?.setDisabled(true);
		this.analyzeButton?.setButtonText('Analisando...');

		// Show progress
		if (this.progressEl) {
			this.progressEl.style.display = 'block';
		}

		try {
			const reportPath = await this.plugin.runFullAnalysis(
				this.file,
				Array.from(this.selectedReports),
				(progress: AnalysisProgress) => this.updateProgress(progress)
			);

			new Notice('Análise concluída! Relatório salvo.');

			// Open the report
			const reportFile = this.app.vault.getAbstractFileByPath(reportPath);
			if (reportFile instanceof TFile) {
				await this.app.workspace.getLeaf().openFile(reportFile);
			}

			this.close();

		} catch (error) {
			console.error('Analysis failed:', error);
			new Notice(`Erro na análise: ${error.message}`);

			this.isAnalyzing = false;
			this.analyzeButton?.setDisabled(false);
			this.analyzeButton?.setButtonText('Tentar Novamente');

			if (this.progressTextEl) {
				this.progressTextEl.setText(`Erro: ${error.message}`);
				this.progressTextEl.style.color = 'var(--text-error)';
			}
		}
	}

	private updateProgress(progress: AnalysisProgress) {
		if (this.progressBarEl) {
			this.progressBarEl.style.width = `${progress.percentage}%`;
		}

		if (this.progressTextEl) {
			this.progressTextEl.setText(progress.message);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// Quick Analysis Modal for single-type analysis
export class QuickAnalysisModal extends Modal {
	private plugin: SmartWriterPlugin;
	private file: TFile;
	private reportType: ReportType;

	constructor(app: App, plugin: SmartWriterPlugin, file: TFile, reportType: ReportType) {
		super(app);
		this.plugin = plugin;
		this.file = file;
		this.reportType = reportType;
	}

	onOpen() {
		const { contentEl } = this;

		const reportNames: Record<ReportType, string> = {
			'readability': 'Legibilidade',
			'cadence': 'Cadência',
			'ai-detection': 'Detecção de IA',
			'structure': 'Estrutura',
			'literary-quality': 'Qualidade Literária',
			'coherence': 'Coerência',
		};

		contentEl.createEl('h2', { text: `Análise Rápida: ${reportNames[this.reportType]}` });
		contentEl.createEl('p', { text: `Analisando: ${this.file.basename}` });

		const progressEl = contentEl.createDiv({ cls: 'swa-progress-container' });
		const progressBar = progressEl.createDiv({ cls: 'swa-progress-bar' });
		const progressFill = progressBar.createDiv({ cls: 'swa-progress-fill' });
		const progressText = progressEl.createDiv({ cls: 'swa-progress-text' });

		progressText.setText('Iniciando análise...');

		this.plugin.runFullAnalysis(
			this.file,
			[this.reportType],
			(progress) => {
				progressFill.style.width = `${progress.percentage}%`;
				progressText.setText(progress.message);
			}
		).then(reportPath => {
			new Notice('Análise concluída!');
			const reportFile = this.app.vault.getAbstractFileByPath(reportPath);
			if (reportFile instanceof TFile) {
				this.app.workspace.getLeaf().openFile(reportFile);
			}
			this.close();
		}).catch(error => {
			progressText.setText(`Erro: ${error.message}`);
			progressText.style.color = 'var(--text-error)';
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}
