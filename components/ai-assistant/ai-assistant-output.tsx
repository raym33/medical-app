"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Mail } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useEmail } from "@/hooks/use-email";
import { usePatientContext } from "@/hooks/use-patient-context";

interface AIAssistantOutputProps {
  diagnosis: string;
  isLoading: boolean;
}

export function AIAssistantOutput({ diagnosis, isLoading }: AIAssistantOutputProps) {
  const { sendReport, isSending } = useEmail();
  const { selectedPatient } = usePatientContext();

  const handleDownload = () => {
    const blob = new Blob([diagnosis], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-diagnosis.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    if (!selectedPatient) return;
    await sendReport(
      selectedPatient,
      diagnosis,
      'doctor@example.com' // In production, get from doctor's profile
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">AI Diagnosis</h2>
        {diagnosis && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSendEmail}
              disabled={isSending}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : "Send Report"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : diagnosis ? (
          <div className="prose max-w-none">
            <ReactMarkdown>{diagnosis}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center text-muted-foreground h-64 flex items-center justify-center">
            Generated diagnosis will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
}