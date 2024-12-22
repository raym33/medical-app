"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date-formatter";
import { Patient } from "@/types/patient";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          {patient.first_name} {patient.last_name}
        </h3>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Date of Birth:</span>{" "}
          {formatDate(patient.date_of_birth)}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Gender:</span>{" "}
          {patient.gender}
        </div>
        {patient.email && (
          <div className="text-sm">
            <span className="text-muted-foreground">Email:</span>{" "}
            {patient.email}
          </div>
        )}
        {patient.phone && (
          <div className="text-sm">
            <span className="text-muted-foreground">Phone:</span>{" "}
            {patient.phone}
          </div>
        )}
      </CardContent>
    </Card>
  );
}