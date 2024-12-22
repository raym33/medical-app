"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MedicalRecordsList } from "@/components/records/medical-records-list";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePatientRecords } from "@/lib/hooks/use-patient-records";

export default function PatientRecordsPage() {
  const { user } = useAuth();
  const { records, isLoading } = usePatientRecords(user?.id);

  return (
    <DashboardLayout title="My Medical Records">
      <MedicalRecordsList 
        records={records}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}