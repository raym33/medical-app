"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePatientContext } from "@/hooks/use-patient-context";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function PatientDataSummary() {
  const { selectedPatient, isLoading } = usePatientContext();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!selectedPatient) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Patient Summary</h2>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="space-y-1 text-sm">
                <p>Name: {selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p>DOB: {formatDate(selectedPatient.date_of_birth)}</p>
                <p>Gender: {selectedPatient.gender}</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Medical History</h3>
              <p className="text-sm">{selectedPatient.medical_history || "No medical history recorded"}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Recent Voice Notes</h3>
              <div className="space-y-2">
                {selectedPatient.voiceNotes?.map((note) => (
                  <div key={note.id} className="text-sm">
                    <p className="text-muted-foreground">{formatDate(note.created_at)}</p>
                    <p>{note.transcription}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Medications</h3>
              <div className="space-y-1 text-sm">
                {selectedPatient.medications?.map((med) => (
                  <div key={med.id}>
                    <p>{med.name} - {med.dosage}</p>
                    <p className="text-muted-foreground">{med.instructions}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}