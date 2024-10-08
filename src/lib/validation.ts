import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required.");

export const signUpSchema = z
  .object({
    email: requiredString.email("Invalid email address."),
    userName: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, - and _ allowed.",
    ),
    displayName: requiredString,
    password: requiredString.min(8, "Must be at least 8 characters."),
    confirmPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password must match.",
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  userName: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed.",
  ),
  password: requiredString.min(8, "Must be at least 8 characters."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z
    .array(z.string())
    .max(10, "Cannot have more than 10 attachments."),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
  gender: requiredString,
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createCommentSchema = z.object({
  content: requiredString,
});
