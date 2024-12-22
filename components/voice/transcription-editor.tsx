"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TranscriptionEditorProps {
  transcription: string;
  patientId: string;
  onTranscriptionChange: (text: string) => void;
  onPatientChange: (id: string) => void;
  onSave: () => void;
  patients: Array<{ id: string; name: string }>;
}

export function TranscriptionEditor({
  transcription,
  patientId,
  onTranscriptionChange,
  onPatientChange,
  onSave,
  patients,
}: TranscriptionEditorProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Transcription</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patient">Patient</Label>
          <Select value={patientId} onValueChange={onPatientChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transcription">Notes</Label>
          <Textarea
            id="transcription"
            value={transcription}
            onChange={(e) => onTranscriptionChange(e.target.value)}
            className="min-h-[200px]"
            placeholder="Transcribed text will appear here..."
          />
        </div>
        
        <Button 
          onClick={onSave} 
          disabled={!transcription || !patientId}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Notes
        </Button>
      </CardContent>
    </Card>
  );
}