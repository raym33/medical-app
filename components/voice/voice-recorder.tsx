"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { VoiceControls } from './voice-controls';
import { VoiceStatus } from './voice-status';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();
  
  const { isSupported, startRecording, stopRecording } = useSpeechRecognition({
    onTranscriptionComplete: (text) => {
      setIsProcessing(false);
      onTranscriptionComplete(text);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Recording error",
        description: error
      });
      handleStopRecording();
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: "Browser not supported",
        description: "Your browser doesn't support speech recognition."
      });
      return;
    }

    setIsRecording(true);
    setRecordingTime(0);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    stopRecording();
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Voice Recording</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <VoiceControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
        <VoiceStatus
          isProcessing={isProcessing}
          recordingTime={recordingTime}
        />
      </CardContent>
    </Card>
  );
}