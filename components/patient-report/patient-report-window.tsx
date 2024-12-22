"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PatientInfoForm } from "./patient-info-form";
import { AIReportGenerator } from "./ai-report-generator";
import { ReportActions } from "./report-actions";
import { Brain } from "lucide-react";
import { PatientData } from "@/types/patient";
import { AIProvider } from "@/lib/ai/providers";

export function PatientReportWindow() {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [report, setReport] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>("anthropic");
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePatientDataSubmit = (data: PatientData) => {
    setPatientData(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Patient Report Generator</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <PatientInfoForm onSubmit={handlePatientDataSubmit} />
          
          <AIReportGenerator
            patientData={patientData}
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            onReportGenerated={setReport}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />

          {report && (
            <ReportActions
              report={report}
              patientName={patientData?.fullName || "Patient"}
              doctorEmail="doctor@example.com"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}