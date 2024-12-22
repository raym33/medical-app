"use client";

import { DiagnosisForm } from "@/components/ai-assistant/diagnosis-form";
import { AIAssistantOutput } from "@/components/ai-assistant/ai-assistant-output";
import { PatientDataSummary } from "@/components/ai-assistant/patient-data-summary";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAIDiagnosis } from "@/hooks/use-ai-diagnosis";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AIAssistantPage() {
  const { diagnosis, isLoading, generateAIDiagnosis } = useAIDiagnosis();

  return (
    <DashboardLayout title="AI Diagnostic Assistant">
      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <DiagnosisForm
              onSubmit={generateAIDiagnosis}
              isLoading={isLoading}
            />
            <PatientDataSummary />
          </div>
          
          <AIAssistantOutput 
            diagnosis={diagnosis}
            isLoading={isLoading}
          />
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
}