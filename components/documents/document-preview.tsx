"use client";

import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DocumentPreviewProps {
  content: string;
}

export function DocumentPreview({ content }: DocumentPreviewProps) {
  const downloadDocument = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-document.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Preview</h2>
        {content && (
          <Button variant="outline" size="sm" onClick={downloadDocument}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {content ? (
          <div className="prose max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-8">
            Generated document will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
}