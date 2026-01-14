// src/core/cache-manager.ts
// Manages caching of analysis results

import { Plugin } from 'obsidian';
import { CacheEntry, AnalysisCache } from '../types';

const CACHE_KEY = 'smartwriter-cache';

export class CacheManager {
	private plugin: Plugin;
	private cache: Map<string, AnalysisCache> = new Map();
	private loaded = false;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		this.loadCache();
	}

	private async loadCache(): Promise<void> {
		try {
			const data = await this.plugin.loadData();
			if (data && data[CACHE_KEY]) {
				const cacheData = data[CACHE_KEY] as Record<string, AnalysisCache>;
				this.cache = new Map(Object.entries(cacheData));
				this.cleanExpiredEntries();
			}
			this.loaded = true;
		} catch (error) {
			console.error('Failed to load cache:', error);
			this.loaded = true;
		}
	}

	private async saveCache(): Promise<void> {
		try {
			const currentData = await this.plugin.loadData() || {};
			currentData[CACHE_KEY] = Object.fromEntries(this.cache);
			await this.plugin.saveData(currentData);
		} catch (error) {
			console.error('Failed to save cache:', error);
		}
	}

	/**
	 * Gets cached analysis.
	 */
	get<T>(manuscriptPath: string, analysisType: string, contentHash: string): T | null {
		const cache = this.cache.get(manuscriptPath);

		if (!cache) {
			return null;
		}

		const entry = cache.entries[analysisType];
		if (!entry || entry.manuscriptHash !== contentHash) {
			return null;
		}

		// Check expiration
		if (Date.now() > entry.expiresAt) {
			delete cache.entries[analysisType];
			this.saveCache();
			return null;
		}

		return entry.data as T;
	}

	/**
	 * Stores analysis result in cache.
	 */
	async set<T>(
		manuscriptPath: string,
		analysisType: string,
		contentHash: string,
		data: T,
		ttlDays: number = 30
	): Promise<void> {
		const now = Date.now();
		const expiresAt = now + (ttlDays * 24 * 60 * 60 * 1000);

		let cache = this.cache.get(manuscriptPath);

		if (!cache) {
			cache = {
				manuscriptHash: '', // Deprecated in favor of per-entry hash
				entries: {},
			};
		}

		cache.entries[analysisType] = {
			key: analysisType,
			timestamp: now,
			expiresAt,
			data,
			manuscriptHash: contentHash, // Re-using this field for content hash
		};

		this.cache.set(manuscriptPath, cache);
		await this.saveCache();
	}

	/**
	 * Generates a hash for content.
	 */
	hashContent(content: string): string {
		// Simple hash function (djb2)
		let hash = 5381;
		for (let i = 0; i < content.length; i++) {
			hash = ((hash << 5) + hash) + content.charCodeAt(i);
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash.toString(16);
	}

	/**
	 * Invalidates cache for a specific manuscript.
	 */
	async invalidate(manuscriptPath: string): Promise<void> {
		this.cache.delete(manuscriptPath);
		await this.saveCache();
	}

	/**
	 * Invalidates specific analysis type for a manuscript.
	 */
	async invalidateAnalysis(manuscriptPath: string, analysisType: string): Promise<void> {
		const cache = this.cache.get(manuscriptPath);
		if (cache && cache.entries[analysisType]) {
			delete cache.entries[analysisType];
			await this.saveCache();
		}
	}

	/**
	 * Clears all cached data.
	 */
	async clearAll(): Promise<void> {
		this.cache.clear();
		await this.saveCache();
	}

	/**
	 * Gets cache statistics.
	 */
	getStats(): { manuscripts: number; entries: number; size: string } {
		let totalEntries = 0;
		let estimatedSize = 0;

		for (const cache of this.cache.values()) {
			totalEntries += Object.keys(cache.entries).length;
			estimatedSize += JSON.stringify(cache).length;
		}

		return {
			manuscripts: this.cache.size,
			entries: totalEntries,
			size: this.formatBytes(estimatedSize),
		};
	}

	private formatBytes(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	/**
	 * Removes expired entries from cache.
	 */
	private cleanExpiredEntries(): void {
		const now = Date.now();
		let cleaned = false;

		for (const [path, cache] of this.cache.entries()) {
			for (const [type, entry] of Object.entries(cache.entries)) {
				if (now > entry.expiresAt) {
					delete cache.entries[type];
					cleaned = true;
				}
			}

			// Remove manuscript entry if all analyses expired
			if (Object.keys(cache.entries).length === 0) {
				this.cache.delete(path);
				cleaned = true;
			}
		}

		if (cleaned) {
			this.saveCache();
		}
	}

	/**
	 * Checks if analysis is cached and valid.
	 */
	has(manuscriptPath: string, analysisType: string, contentHash: string): boolean {
		return this.get(manuscriptPath, analysisType, contentHash) !== null;
	}

	/**
	 * Gets all cached analysis types for a manuscript that match the current content hash.
	 */
	getCachedTypes(manuscriptPath: string, contentHash: string): string[] {
		const cache = this.cache.get(manuscriptPath);

		if (!cache) {
			return [];
		}

		const now = Date.now();
		return Object.entries(cache.entries)
			.filter(([_, entry]) => now <= entry.expiresAt && entry.manuscriptHash === contentHash)
			.map(([type, _]) => type);
	}
}
