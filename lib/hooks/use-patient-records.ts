"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/db/supabase";
import { toast } from "@/lib/utils/toast";

export function usePatientRecords(patientId?: string) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    loadRecords();
  }, [patientId]);

  const loadRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select(`
          id,
          doctor_profiles (
            full_name
          ),
          created_at,
          diagnosis,
          prescription,
          blockchain_hash
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecords(data.map(record => ({
        ...record,
        doctor_name: record.doctor_profiles.full_name
      })));
    } catch (error) {
      toast({
        title: "Failed to load records",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    records,
    isLoading,
    refreshRecords: loadRecords
  };
}