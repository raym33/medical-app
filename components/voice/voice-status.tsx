"use client";

import { Loader2 } from "lucide-react";

interface VoiceStatusProps {
  isProcessing: boolean;
  recordingTime: number;
}

export function VoiceStatus({ isProcessing, recordingTime }: VoiceStatusProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
      {isProcessing ? (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </div>
      ) : recordingTime > 0 && (
        <div className="flex items-center">
          <span className="animate-pulse text-red-500 mr-2">●</span>
          Recording: {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
}