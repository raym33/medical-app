import { z } from "zod";

export const patientValidation = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Invalid phone number").optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  gender: z.enum(["male", "female", "other", "prefer not to say"]),
  medicalHistory: z.string().optional(),
};

export const voiceNoteValidation = {
  transcription: z.string().min(1, "Transcription cannot be empty"),
  patientId: z.string().uuid("Invalid patient ID"),
};

export const medicationValidation = {
  name: z.string().min(2, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  instructions: z.string().optional(),
};