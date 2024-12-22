"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentFormProps {
  form: ReturnType<typeof useForm>;
  isGenerating: boolean;
  onSubmit: (data: any) => Promise<void>;
}

export function DocumentForm({ form, isGenerating, onSubmit }: DocumentFormProps) {
  const { control, handleSubmit } = form;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Document Details</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Controller
              name="patientName"
              control={control}
              render={({ field }) => (
                <Input id="patientName" {...field} required />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Controller
              name="documentType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="referral">Referral Letter</SelectItem>
                    <SelectItem value="medicalReport">Medical Report</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI GPT-3.5</SelectItem>
                    <SelectItem value="ollama">Ollama (Local)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Medical Details</Label>
            <Controller
              name="details"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="details"
                  {...field}
                  placeholder="Enter relevant medical information..."
                  className="h-32"
                  required
                />
              )}
            />
          </div>

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Document"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}