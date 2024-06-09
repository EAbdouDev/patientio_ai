// utils/schemas.ts
import { z } from "zod";

export const basicInfoSchema = z.object({
  name: z.string().optional(),
  age: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ required_error: "Age is required" })
      .min(0, "Age must be a positive number")
  ),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be either male or female" }),
  }),
  occupation: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  pastMedicalHistory: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  surgicalHistory: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  socialHistory: z.string().optional(),
});

// Add other schemas for each step...
