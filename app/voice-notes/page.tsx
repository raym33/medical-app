"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { VoiceRecorder } from '@/components/voice/voice-recorder';
import { TranscriptionEditor } from '@/components/voice/transcription-editor';
import { VoiceNotesList } from '@/components/voice/voice-notes-list';
import { useVoiceNotes } from '@/hooks/use-voice-notes';

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
    <DashboardLayout title="Voice Notes">
      <div className="max-w-4xl mx-auto space-y-6">
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
          isLoading={isLoading}
          onViewNote={(note) => {
            handleTranscriptionChange(note.transcription);
            handlePatientChange(note.patients.id);
          }}
        />
      </div>
    </DashboardLayout>
  );
}