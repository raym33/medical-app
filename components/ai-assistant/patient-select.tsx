"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatients } from "@/hooks/use-patients";

interface PatientSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PatientSelect({ value, onChange, error }: PatientSelectProps) {
  const { patients } = usePatients();

  return (
    <div className="space-y-2">
      <Label htmlFor="patient">Select Patient</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a patient" />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}