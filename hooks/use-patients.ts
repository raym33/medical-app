"use client";

import { useState, useEffect } from 'react';
import { getPatients } from '@/lib/patients';
import { Patient } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading patients",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    patients,
    isLoading,
    refreshPatients: loadPatients
  };
}