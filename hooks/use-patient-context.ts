"use client";

import { createContext, useContext } from 'react';
import { PatientFullData } from '@/types/patient';

interface PatientContextType {
  selectedPatient: PatientFullData | null;
  setSelectedPatient: (patient: PatientFullData | null) => void;
  isLoading: boolean;
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function usePatientContext() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  return context;
}