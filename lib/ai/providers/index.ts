import { AnthropicProvider } from './anthropic';
import { PerplexityProvider } from './perplexity';
import { GrokProvider } from './grok';
import { OpenAIProvider } from './openai';

export const aiProviders = {
  anthropic: new AnthropicProvider(),
  perplexity: new PerplexityProvider(),
  grok: new GrokProvider(),
  openai: new OpenAIProvider(),
} as const;

export type AIProvider = keyof typeof aiProviders;

export type { BaseAIProvider } from './base';
export { AnthropicProvider } from './anthropic';
export { PerplexityProvider } from './perplexity';
export { GrokProvider } from './grok';
export { OpenAIProvider } from './openai';