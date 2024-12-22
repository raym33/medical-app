"use client";

import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function VoiceControls({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
}: VoiceControlsProps) {
  return (
    <div className="flex justify-center space-x-4">
      {!isRecording ? (
        <Button
          onClick={onStartRecording}
          className="bg-red-500 hover:bg-red-600"
          disabled={isProcessing}
        >
          <Mic className="h-4 w-4 mr-2" />
          Start Recording
        </Button>
      ) : (
        <Button
          onClick={onStopRecording}
          variant="destructive"
          disabled={isProcessing}
        >
          <Square className="h-4 w-4 mr-2" />
          Stop Recording
        </Button>
      )}
      
      {isProcessing && (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </div>
      )}
    </div>
  );
}