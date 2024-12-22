"use client";

import { useState } from "react";
import { useToast } from "./use-toast";
import { generateDiagnosis } from "@/lib/api/ai-service";
import { getPatientFullData } from "@/lib/patients";

export function useAIDiagnosis() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const { toast } = useToast();

  const generateAIDiagnosis = async (data: {
    patientId: string;
    model: "openai" | "ollama";
    additionalNotes?: string;
  }) => {
    try {
      setIsLoading(true);
      const patientData = await getPatientFullData(data.patientId);
      const result = await generateDiagnosis({
        ...data,
        patientData,
      });
      setDiagnosis(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating diagnosis",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    diagnosis,
    isLoading,
    generateAIDiagnosis,
  };
}