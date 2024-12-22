"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { validateAudioFile } from "@/lib/validation/audio-validation";
import { useToast } from "@/hooks/use-toast";

interface AudioUploadProps {
  onFileAccepted: (file: File) => void;
}

export function AudioUpload({ onFileAccepted }: AudioUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const validation = validateAudioFile(file);
    
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: validation.error,
      });
      return;
    }

    setFile(file);
    onFileAccepted(file);
  }, [onFileAccepted, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.mp4', '.ogg']
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Upload Audio</h2>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {file ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-600">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the audio file here"
                : "Drag and drop an audio file, or click to select"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}