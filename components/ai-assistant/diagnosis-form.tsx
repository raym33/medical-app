"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { PatientSelect } from "./patient-select";
import { ModelSelect } from "./model-select";
import { validateRequired } from "@/lib/utils/validation";

interface DiagnosisFormProps {
  onSubmit: (data: {
    patientId: string;
    model: "openai" | "ollama";
    additionalNotes?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function DiagnosisForm({ onSubmit, isLoading }: DiagnosisFormProps) {
  const [patientId, setPatientId] = useState("");
  const [model, setModel] = useState<"openai" | "ollama">("openai");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    const patientError = validateRequired(patientId, "Patient");
    if (patientError) newErrors.patient = patientError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({ patientId, model, additionalNotes });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Generate AI Diagnosis</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PatientSelect
            value={patientId}
            onChange={setPatientId}
            error={errors.patient}
          />

          <ModelSelect
            value={model}
            onChange={(value) => setModel(value as "openai" | "ollama")}
          />

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any additional observations or notes..."
              className="h-32"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!patientId || isLoading}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isLoading ? "Generating Diagnosis..." : "Generate AI Diagnosis"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}