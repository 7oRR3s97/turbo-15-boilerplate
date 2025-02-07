import { z } from "zod";

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
  callbackUrl: z.optional(z.string()),
});

export const SocialLoginSchema = z.object({
  provider: z.enum(["google"]),
  callbackUrl: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const VerifyEmailSchema = z.object({
  token: z.string().optional(),
});

export const ChangePasswordEmailSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  token: z.string().optional(),
});

export const ChangePasswordEmailTokenSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  token: z.string().optional(),
  email: z.string().optional(),
});

export const VerifyEmailTokenSchema = z.object({
  email: z.string().optional(),
  token: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({
    message: "Email is required",
  }),
  isTwoFactorEnabled: z.boolean().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  newPassword: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});
