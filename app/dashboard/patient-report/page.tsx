"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PatientReportWindow } from "@/components/patient-report/patient-report-window";

export default function PatientReportPage() {
  return (
    <DashboardLayout title="Patient Report Generator">
      <PatientReportWindow />
    </DashboardLayout>
  );
}