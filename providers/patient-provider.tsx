"use client";

import { useState, useEffect, ReactNode } from 'react';
import { PatientContext } from '@/hooks/use-patient-context';
import { PatientFullData } from '@/types/patient';
import { getPatientFullData } from '@/lib/patients';
import { useToast } from '@/hooks/use-toast';

export function PatientProvider({ children }: { children: ReactNode }) {
  const [selectedPatient, setSelectedPatient] = useState<PatientFullData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateSelectedPatient = async (patientId: string | null) => {
    if (!patientId) {
      setSelectedPatient(null);
      return;
    }

    try {
      setIsLoading(true);
      const patientData = await getPatientFullData(patientId);
      setSelectedPatient(patientData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading patient data",
        description: "Please try again later.",
      });
      setSelectedPatient(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientContext.Provider 
      value={{ 
        selectedPatient, 
        setSelectedPatient: (patient) => {
          if (patient?.id) {
            updateSelectedPatient(patient.id);
          } else {
            setSelectedPatient(null);
          }
        },
        isLoading 
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}