"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatients } from "@/hooks/use-patients";
import { Brain } from "lucide-react";

interface AIAssistantFormProps {
  onSubmit: (data: {
    patientId: string;
    model: "openai" | "ollama";
    additionalNotes?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function AIAssistantForm({ onSubmit, isLoading }: AIAssistantFormProps) {
  const [patientId, setPatientId] = useState("");
  const [model, setModel] = useState<"openai" | "ollama">("openai");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const { patients } = usePatients();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ patientId, model, additionalNotes });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Generate AI Diagnosis</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={model} onValueChange={(value: "openai" | "ollama") => setModel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI GPT-3.5</SelectItem>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
              </SelectContent>
            </Select>
          </div>

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