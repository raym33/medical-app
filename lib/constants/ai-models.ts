import { AIModel } from "@/types/ai";

export const AI_MODELS: AIModel[] = [
  {
    id: "openai",
    name: "OpenAI GPT-3.5",
    description: "Advanced cloud-based AI model with broad medical knowledge"
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    description: "Privacy-focused local AI model for sensitive medical data"
  }
];