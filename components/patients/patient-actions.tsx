"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { VideoCallDialog } from "@/components/video/video-call-dialog";
import { useAuth } from "@/lib/hooks/use-auth";

interface PatientActionsProps {
  patientId: string;
}

export function PatientActions({ patientId }: PatientActionsProps) {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsCallOpen(true)}
      >
        <Video className="h-4 w-4 mr-2" />
        Start Video Call
      </Button>

      <VideoCallDialog
        open={isCallOpen}
        onOpenChange={setIsCallOpen}
        patientId={patientId}
        doctorId={user.id}
      />
    </>
  );
}