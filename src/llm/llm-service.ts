// src/llm/llm-service.ts
// Unified LLM Service supporting Ollama, Claude, and OpenAI

import { SmartWriterSettings, LLMRequest, LLMResponse } from '../types';
import { requestUrl, RequestUrlParam } from 'obsidian';

export class LLMService {
	private settings: SmartWriterSettings;

	constructor(settings: SmartWriterSettings) {
		this.settings = settings;
	}

	updateSettings(settings: SmartWriterSettings) {
		this.settings = settings;
	}

	async complete(request: LLMRequest): Promise<LLMResponse> {
		const maxRetries = 3;
		let lastError: Error | null = null;

		for (let i = 0; i < maxRetries; i++) {
			try {
				switch (this.settings.llmProvider) {
					case 'ollama':
						return await this.completeOllama(request);
					case 'claude':
						return await this.completeClaude(request);
					case 'openai':
						return await this.completeOpenAI(request);
					case 'gemini':
						return await this.completeGemini(request);
					default:
						throw new Error(`Unknown LLM provider: ${this.settings.llmProvider}`);
				}
			} catch (error) {
				lastError = error;
				console.warn(`LLM request attempt ${i + 1} failed:`, error);
				
				// Don't retry on certain errors (e.g. 401 Unauthorized)
				if (this.isNonRetriableError(error)) {
					throw error;
				}

				if (i < maxRetries - 1) {
					// Wait with exponential backoff
					const delay = Math.pow(2, i) * 1000;
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		}

		throw lastError || new Error('LLM request failed after retries');
	}

	private isNonRetriableError(error: any): boolean {
		// If it's an obsidian requestUrl error, check status
		if (error.status) {
			const status = error.status;
			// 400 Bad Request, 401 Unauthorized, 403 Forbidden are typically not retriable
			return status >= 400 && status < 500 && status !== 429;
		}
		return false;
	}

	async testConnection(): Promise<boolean> {
		try {
			const response = await this.complete({
				prompt: 'Say "OK" if you can read this.',
				maxTokens: 10,
			});
			return response.content.toLowerCase().includes('ok');
		} catch (error) {
			console.error('LLM connection test failed:', error);
			return false;
		}
	}

	private async completeOllama(request: LLMRequest): Promise<LLMResponse> {
		const endpoint = `${this.settings.ollamaEndpoint}/api/generate`;

		const body = {
			model: this.settings.ollamaModel,
			prompt: request.prompt,
			system: request.systemPrompt || '',
			stream: false,
			options: {
				num_predict: request.maxTokens || 4096,
				temperature: request.temperature || 0.7,
			},
		};

		const response = await requestUrl({
			url: endpoint,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		const data = response.json;

		return {
			content: data.response,
			tokensUsed: data.eval_count || 0,
			model: this.settings.ollamaModel,
			finishReason: data.done ? 'stop' : 'unknown',
		};
	}

	private async completeClaude(request: LLMRequest): Promise<LLMResponse> {
		const endpoint = 'https://api.anthropic.com/v1/messages';

		const messages = [
			{ role: 'user', content: request.prompt }
		];

		const body: Record<string, unknown> = {
			model: this.settings.claudeModel,
			max_tokens: request.maxTokens || 4096,
			messages,
		};

		if (request.systemPrompt) {
			body.system = request.systemPrompt;
		}

		const response = await requestUrl({
			url: endpoint,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.settings.claudeApiKey,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify(body),
		});

		const data = response.json;

		return {
			content: data.content[0].text,
			tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0,
			model: this.settings.claudeModel,
			finishReason: data.stop_reason || 'unknown',
		};
	}

	private async completeOpenAI(request: LLMRequest): Promise<LLMResponse> {
		const endpoint = 'https://api.openai.com/v1/chat/completions';

		const messages: Array<{ role: string; content: string }> = [];

		if (request.systemPrompt) {
			messages.push({ role: 'system', content: request.systemPrompt });
		}

		messages.push({ role: 'user', content: request.prompt });

		const body = {
			model: this.settings.openaiModel,
			messages,
			max_tokens: request.maxTokens || 4096,
			temperature: request.temperature || 0.7,
		};

		const response = await requestUrl({
			url: endpoint,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.settings.openaiApiKey}`,
			},
			body: JSON.stringify(body),
		});

		const data = response.json;

		return {
			content: data.choices[0].message.content,
			tokensUsed: data.usage?.total_tokens || 0,
			model: this.settings.openaiModel,
			finishReason: data.choices[0].finish_reason || 'unknown',
		};
	}

	private async completeGemini(request: LLMRequest): Promise<LLMResponse> {
		const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.settings.geminiModel}:generateContent?key=${this.settings.geminiApiKey}`;

		const body = {
			contents: [
				{
					role: 'user',
					parts: [
						{
							text: request.systemPrompt ? `${request.systemPrompt}\n\n${request.prompt}` : request.prompt,
						},
					],
				},
			],
			generationConfig: {
				maxOutputTokens: request.maxTokens || 4096,
				temperature: request.temperature || 0.7,
			},
		};

		const response = await requestUrl({
			url: endpoint,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const data = response.json;

		if (data.error) {
			throw new Error(`Gemini API error: ${data.error.message}`);
		}

		const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

		return {
			content,
			tokensUsed: data.usageMetadata?.totalTokenCount || 0,
			model: this.settings.geminiModel,
			finishReason: data.candidates?.[0]?.finishReason || 'unknown',
		};
	}

	// Batch processing for large manuscripts
	async completeBatch(
		requests: LLMRequest[],
		concurrency: number = 3,
		onProgress?: (completed: number, total: number) => void
	): Promise<LLMResponse[]> {
		const results: LLMResponse[] = [];
		const queue = [...requests];
		let completed = 0;

		const processNext = async (): Promise<void> => {
			while (queue.length > 0) {
				const request = queue.shift();
				if (!request) break;

				try {
					const result = await this.complete(request);
					results.push(result);
					completed++;
					onProgress?.(completed, requests.length);
				} catch (error) {
					console.error('Batch request failed:', error);
					results.push({
						content: '',
						tokensUsed: 0,
						model: '',
						finishReason: 'error',
					});
					completed++;
					onProgress?.(completed, requests.length);
				}
			}
		};

		// Run with concurrency limit
		const workers = Array(Math.min(concurrency, requests.length))
			.fill(null)
			.map(() => processNext());

		await Promise.all(workers);

		return results;
	}
}
