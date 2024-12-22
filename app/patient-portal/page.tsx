"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PatientRecordsList } from '@/components/patient-portal/patient-records-list';
import { usePatientRecords } from '@/hooks/use-patient-records';
import { useAuth } from '@/lib/hooks/use-auth';

export default function PatientPortalPage() {
  const { user } = useAuth();
  const { records, isLoading } = usePatientRecords(user?.id);

  return (
    <DashboardLayout title="Patient Portal">
      <div className="max-w-4xl mx-auto">
        <PatientRecordsList 
          records={records}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}