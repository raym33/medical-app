"use client";

import { AI_MODELS } from "@/lib/constants/ai-models";
import { AIModel } from "@/types/ai";

export function useAIModels() {
  const getModelById = (id: AIModel["id"]): AIModel | undefined => {
    return AI_MODELS.find(model => model.id === id);
  };

  return {
    models: AI_MODELS,
    getModelById
  };
}