"use client";

import { useRef, useCallback, useState } from 'react';

interface UseSpeechRecognitionProps {
  onTranscriptionComplete: (text: string) => void;
  onError: (error: string) => void;
}

export function useSpeechRecognition({
  onTranscriptionComplete,
  onError
}: UseSpeechRecognitionProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>('');

  const initialize = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
      return false;
    }

    if (!recognitionRef.current) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          transcriptRef.current += ' ' + finalTranscript;
        }
      };

      recognition.onerror = () => {
        onError("An error occurred during recording");
        stopRecording();
      };

      recognitionRef.current = recognition;
    }

    setIsSupported(true);
    return true;
  }, [onError]);

  const startRecording = useCallback(() => {
    if (initialize()) {
      transcriptRef.current = '';
      recognitionRef.current?.start();
    }
  }, [initialize]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      onTranscriptionComplete(transcriptRef.current.trim());
    }
  }, [onTranscriptionComplete]);

  return {
    isSupported,
    startRecording,
    stopRecording
  };
}