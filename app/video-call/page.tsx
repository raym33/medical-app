"use client";

import { VideoCallContainer } from '@/components/video-call/video-call-container';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function VideoCallPage() {
  return (
    <DashboardLayout title="Video Consultation">
      <VideoCallContainer />
    </DashboardLayout>
  );
}