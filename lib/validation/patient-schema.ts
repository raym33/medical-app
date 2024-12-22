import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0).max(150, "Please enter a valid age"),
  gender: z.enum(["male", "female", "other", "prefer not to say"]),
  history: z.string().min(10, "Medical history must be at least 10 characters"),
});

export type PatientFormData = z.infer<typeof patientSchema>;