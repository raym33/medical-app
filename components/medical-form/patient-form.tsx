"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { patientSchema, type PatientFormData } from "@/lib/validation/patient-schema";
import { RichTextEditor } from "./rich-text-editor";

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  defaultValues?: Partial<PatientFormData>;
}

export function PatientForm({ onSubmit, defaultValues }: PatientFormProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  });

  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Patient Details</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
            />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">Medical History</Label>
            <RichTextEditor
              id="history"
              {...register("history")}
              error={errors.history?.message}
            />
          </div>

          <Button type="submit" className="w-full">Save Patient Details</Button>
        </form>
      </CardContent>
    </Card>
  );
}