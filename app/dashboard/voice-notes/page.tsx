"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { TranscriptionEditor } from "@/components/voice/transcription-editor";
import { VoiceNotesList } from "@/components/voice/voice-notes-list";
import { useVoiceNotes } from "@/hooks/use-voice-notes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function VoiceNotesPage() {
  const {
    transcription,
    selectedPatientId,
    voiceNotes,
    isLoading,
    handleTranscriptionComplete,
    handlePatientChange,
    handleTranscriptionChange,
    handleSave,
    patients
  } = useVoiceNotes();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Voice Notes</h1>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid gap-6">
              <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
              
              <TranscriptionEditor
                transcription={transcription}
                patientId={selectedPatientId}
                onTranscriptionChange={handleTranscriptionChange}
                onPatientChange={handlePatientChange}
                onSave={handleSave}
                patients={patients.map(p => ({
                  id: p.id,
                  name: `${p.first_name} ${p.last_name}`
                }))}
              />

              <VoiceNotesList 
                notes={voiceNotes}
                onViewNote={(note) => {
                  handleTranscriptionChange(note.transcription);
                  handlePatientChange(note.patients.id);
                }}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}