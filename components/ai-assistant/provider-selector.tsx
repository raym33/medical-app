"use client";

import { AIProvider } from '@/lib/ai/providers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProviderSelectorProps {
  value: AIProvider;
  onChange: (value: AIProvider) => void;
}

export function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="ai-provider">AI Provider</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select AI provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="anthropic">Anthropic Claude</SelectItem>
          <SelectItem value="perplexity">Perplexity AI</SelectItem>
          <SelectItem value="grok">Grok AI</SelectItem>
          <SelectItem value="openai">OpenAI GPT-4</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}