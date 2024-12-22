"use client";

import { AIModel } from "@/types/ai";
import { useAIModels } from "@/hooks/use-ai-models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ModelSelectorProps {
  value: AIModel["id"];
  onChange: (value: AIModel["id"]) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const { models } = useAIModels();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor="model">AI Model</Label>
        <InfoTooltip content="Choose between cloud-based or local AI processing" />
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <span>{model.name}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}