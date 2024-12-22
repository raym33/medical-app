"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoCall } from "./video-call";

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  doctorId: string;
}

export function VideoCallDialog({
  open,
  onOpenChange,
  patientId,
  doctorId,
}: VideoCallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Video Consultation</DialogTitle>
        </DialogHeader>
        <VideoCall
          patientId={patientId}
          doctorId={doctorId}
          onEndCall={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}