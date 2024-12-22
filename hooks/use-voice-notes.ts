"use client";

import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { getVoiceNotes, saveVoiceNote } from "@/lib/voice/voice-notes-service";
import { usePatients } from "@/hooks/use-patients";
import { getCurrentDoctor } from "@/lib/auth";

export function useVoiceNotes() {
  const [transcription, setTranscription] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { patients } = usePatients();
  const { toast } = useToast();

  useEffect(() => {
    loadVoiceNotes();
  }, []);

  const loadVoiceNotes = async () => {
    try {
      setIsLoading(true);
      const doctor = await getCurrentDoctor();
      if (doctor) {
        const notes = await getVoiceNotes(doctor.id);
        setVoiceNotes(notes);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading voice notes",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  const handlePatientChange = (id: string) => {
    setSelectedPatientId(id);
  };

  const handleTranscriptionChange = (text: string) => {
    setTranscription(text);
  };

  const handleSave = async () => {
    if (!transcription || !selectedPatientId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a patient and provide transcription.",
      });
      return;
    }

    try {
      const doctor = await getCurrentDoctor();
      if (!doctor) throw new Error("Not authenticated");

      await saveVoiceNote({
        patientId: selectedPatientId,
        doctorId: doctor.id,
        transcription,
      });

      await loadVoiceNotes();

      setTranscription("");
      setSelectedPatientId("");

      toast({
        title: "Success",
        description: "Voice notes have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving notes",
        description: "Please try again later.",
      });
    }
  };

  return {
    transcription,
    selectedPatientId,
    voiceNotes,
    isLoading,
    patients,
    handleTranscriptionComplete,
    handlePatientChange,
    handleTranscriptionChange,
    handleSave,
  };
}