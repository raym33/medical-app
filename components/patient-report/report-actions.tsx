"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportActionsProps {
  report: string;
  patientName: string;
  doctorEmail: string;
}

export function ReportActions({
  report,
  patientName,
  doctorEmail
}: ReportActionsProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patientName.replace(/\s+/g, '_')}_medical_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleEmailReport = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: doctorEmail,
          subject: `Medical Report - ${patientName}`,
          text: report
        })
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast({
        title: "Email Sent",
        description: "The report has been sent successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: "Please try again later"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-4">Generated Report</h3>
        <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
          {report}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={handleEmailReport} disabled={isSending}>
          {isSending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          {isSending ? "Sending..." : "Send via Email"}
        </Button>
      </div>
    </Card>
  );
}