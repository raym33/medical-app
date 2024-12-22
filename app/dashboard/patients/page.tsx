"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientList } from "@/components/patients/patient-list";
import { NewPatientDialog } from "@/components/patients/new-patient-dialog";
import { PatientSearch } from "@/components/patients/patient-search";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function PatientsPage() {
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const actions = (
    <Button onClick={() => setIsNewPatientOpen(true)}>
      <Plus className="h-4 w-4 mr-2" />
      New Patient
    </Button>
  );

  return (
    <DashboardLayout title="Patients" actions={actions}>
      <PatientSearch 
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <PatientList searchQuery={searchQuery} />
      
      <NewPatientDialog
        open={isNewPatientOpen}
        onOpenChange={setIsNewPatientOpen}
      />
    </DashboardLayout>
  );
}