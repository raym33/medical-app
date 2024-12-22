"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface VoiceNote {
  id: string;
  transcription: string;
  created_at: string;
  patients: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface VoiceNotesListProps {
  notes: VoiceNote[];
  onViewNote: (note: VoiceNote) => void;
}

export function VoiceNotesList({ notes, onViewNote }: VoiceNotesListProps) {
  if (!notes?.length) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Voice Notes</h3>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No voice notes yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Voice Notes</h3>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>
                  {format(new Date(note.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {note.patients.first_name} {note.patients.last_name}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {note.transcription}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewNote(note)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}