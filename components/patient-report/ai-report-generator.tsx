"use client";

import { Button } from "@/components/ui/button";
import { AIProvider } from "@/lib/ai/providers";
import { ProviderSelector } from "@/components/ai-assistant/provider-selector";
import { DiagnosisService } from "@/lib/ai/diagnosis-service";
import { PatientData } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";

interface AIReportGeneratorProps {
  patientData: PatientData | null;
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  onReportGenerated: (report: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export function AIReportGenerator({
  patientData,
  selectedProvider,
  onProviderChange,
  onReportGenerated,
  isGenerating,
  setIsGenerating
}: AIReportGeneratorProps) {
  const { toast } = useToast();
  const diagnosisService = DiagnosisService.getInstance();

  const handleGenerateReport = async () => {
    if (!patientData) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in patient information first."
      });
      return;
    }

    try {
      setIsGenerating(true);
      const mockPatientForAI = {
        id: '1',
        first_name: patientData.fullName.split(' ')[0],
        last_name: patientData.fullName.split(' ')[1] || '',
        date_of_birth: patientData.dateOfBirth,
        gender: patientData.gender,
        medical_history: patientData.medicalHistory,
        voiceNotes: [],
        medications: []
      };

      const report = await diagnosisService.generateDiagnosis(
        mockPatientForAI,
        selectedProvider,
        `Additional Information:
         Symptoms: ${patientData.symptoms}
         Vital Signs: ${patientData.vitalSigns}
         Current Medications: ${patientData.currentMedications}
         Notes: ${patientData.notes}`
      );

      onReportGenerated(report);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate the report. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <ProviderSelector
        value={selectedProvider}
        onChange={onProviderChange}
      />
      
      <Button
        onClick={handleGenerateReport}
        disabled={isGenerating || !patientData}
        className="w-full"
      >
        {isGenerating ? "Generating Report..." : "Generate AI Report"}
      </Button>
    </div>
  );
}