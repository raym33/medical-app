"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DocumentForm } from "@/components/documents/document-form";
import { DocumentPreview } from "@/components/documents/document-preview";
import { generateWithOpenAI, generateWithOllama } from "@/lib/ai";

export default function DocumentsPage() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm();

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    try {
      const content = data.model === "openai" 
        ? await generateWithOpenAI(data)
        : await generateWithOllama(data);
      setGeneratedContent(content || "");
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Generate Documents</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DocumentForm 
            form={form}
            isGenerating={isGenerating}
            onSubmit={onSubmit}
          />
          <DocumentPreview content={generatedContent} />
        </div>
      </div>
    </div>
  );
}