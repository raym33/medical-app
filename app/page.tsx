"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Send, Video, Brain, Mic, FileText, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { VideoCallContainer } from "@/components/video-call/video-call-container";
import { ProviderSelector } from "@/components/ai-assistant/provider-selector";
import { AIProvider } from "@/lib/ai/providers";
import { DiagnosisService } from "@/lib/ai/diagnosis-service";
import { ROUTES } from "@/lib/constants/routes";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("patient");
  const [aiProvider, setAIProvider] = useState<AIProvider>("anthropic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const diagnosisService = DiagnosisService.getInstance();

  const handleGenerateDiagnosis = async () => {
    try {
      setIsGenerating(true);
      const mockPatient = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1990-01-01',
        gender: 'male',
        medical_history: 'No significant medical history',
        voiceNotes: [],
        medications: []
      };

      const result = await diagnosisService.generateDiagnosis(
        mockPatient,
        aiProvider,
        "Additional notes for diagnosis"
      );
      setDiagnosis(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate diagnosis. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold">Medical Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push(ROUTES.PATIENT_REPORT)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Patient Report
              </Button>
              <span className="text-sm text-gray-500">Dr. Sarah Mitchell</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
            <TabsTrigger value="patient" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Patient Details
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Voice Notes
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Video Call
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* Rest of the component remains the same */}
          {/* ... existing tab content ... */}
        </Tabs>
      </main>
    </div>
  );
}