# Gemini LLM Integration Guide

This guide explains how to configure and use Google Gemini as the LLM provider for SmartWriter Analyzer.

## Getting Your Gemini API Key

1. **Visit Google AI Studio**: Go to [https://aistudio.google.com](https://aistudio.google.com)
2. **Sign in**: Use your Google account
3. **Get API Key**: Click "Get API key" in the sidebar
4. **Create new key**: Click "Create new API key" → "Create API key in new project"
5. **Copy the key**: Your API key will be displayed in the format `AIz...`

## Configuring SmartWriter Analyzer

### In Obsidian Plugin Settings

1. **Open Settings**: 
   - Click the gear icon in the SmartWriter Analyzer ribbon
   - Or use: Settings → Community Plugins → SmartWriter Analyzer → Options

2. **Configure LLM Provider**:
   - Select "Gemini (Google)" from the Provider dropdown
   - Paste your API key in the "API key" field
   - Select a model from the dropdown:
     - **Gemini 2.0 Flash** (recommended) - Fast, capable, latest
     - **Gemini 1.5 Pro** - More powerful, slightly slower
     - **Gemini 1.5 Flash** - Lightweight alternative

3. **Save Settings**: Changes are saved automatically

### Direct Configuration (data.json)

You can also edit `.obsidian/plugins/smartwriter-analyzer/data.json`:

```json
{
  "llmProvider": "gemini",
  "geminiApiKey": "YOUR_API_KEY_HERE",
  "geminiModel": "gemini-2.0-flash",
  "chunkSize": 10000,
  "cacheDuration": 30,
  "language": "pt-BR",
  "enableAIDetection": true,
  "enableReadability": true,
  "enableCadence": true,
  "enableCoherence": true,
  "enableLiteraryQuality": true
}
```

## Using Gemini for Analysis

Once configured, Gemini will be used for:

- **Literary Quality Analysis**: Helena Vasconcelos persona analysis
- **AI Detection**: DETECT-AI protocol analysis
- **Custom Prompts**: Any analysis requiring LLM capabilities

Computational analyses (readability, cadence, coherence) run locally without needing Gemini.

## Supported Models

| Model | Speed | Capability | Input Tokens | Cost |
|-------|-------|-----------|--------------|------|
| gemini-2.0-flash | Very Fast | High | 1,000,000 | Low |
| gemini-1.5-pro | Fast | Very High | 1,000,000 | Medium |
| gemini-1.5-flash | Medium | Medium | 1,000,000 | Low |

## Testing the Connection

1. **Run a quick analysis**: Use "Detect AI artifacts" command
2. **Check console**: If errors occur, check browser console (F12) for details
3. **Verify API key**: Ensure the key is correct and has proper permissions

## Troubleshooting

### "Invalid API Key" Error
- Verify the API key is correct
- Check it hasn't exceeded usage limits
- Regenerate the key if needed at [https://aistudio.google.com](https://aistudio.google.com)

### "Rate limit exceeded"
- Gemini has usage quotas
- Wait a few minutes before retrying
- Consider upgrading to a paid plan for higher limits

### "Model not found"
- Verify the model name is correct
- New models are added regularly; check Google's documentation

### Plugin doesn't use Gemini
- Confirm "gemini" is selected in settings
- Restart Obsidian after changing providers
- Check that API key field isn't empty

## Switching Between Providers

You can easily switch between Ollama, Claude, OpenAI, and Gemini:

1. Open plugin settings
2. Change "Provider" dropdown
3. Configure the relevant credentials
4. Save (automatic)

No code changes needed - the plugin routes to the correct LLM provider automatically.

## Privacy Considerations

- **Gemini**: Text is sent to Google's servers. Review [Google's AI Privacy Policy](https://policies.google.com/privacy)
- **Ollama**: Text stays local on your machine (no internet required)
- **Claude/OpenAI**: Text is sent to Anthropic/OpenAI servers

Choose based on your privacy requirements.

## Cost Estimation

Gemini 2.0 Flash is **free** for light usage (1000 requests/day limit).

For heavy usage, costs are approximately:
- Input: ~$0.075 per 1M tokens
- Output: ~$0.30 per 1M tokens

A typical manuscript analysis costs a few cents.

## API Documentation

For more information, visit:
- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Models & Pricing](https://ai.google.dev/pricing)
