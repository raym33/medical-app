"use client";

import { useState } from 'react';
import { useToast } from './use-toast';
import { sendMedicalReport } from '@/lib/email/email-service';
import { PatientFullData } from '@/types/patient';

export function useEmail() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendReport = async (
    patient: PatientFullData,
    diagnosis: string,
    doctorEmail: string
  ) => {
    try {
      setIsSending(true);
      await sendMedicalReport(patient, diagnosis, doctorEmail);
      toast({
        title: "Report sent",
        description: "Medical report has been sent successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send report",
        description: "Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendReport,
    isSending
  };
}