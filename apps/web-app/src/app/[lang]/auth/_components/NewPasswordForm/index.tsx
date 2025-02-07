"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";

import { PasswordInput } from "@packages/ui/base/components/password-input";
import { Button } from "@packages/ui/base/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@packages/ui/base/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@packages/ui/components/form";
import { ChangePasswordEmailSchema } from "@packages/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { changePasswordEmail as changePasswordEmailAction } from "~/actions/auth/changePasswordEmail";
import { changePasswordEmailToken as changePasswordEmailTokenAction } from "~/actions/auth/changePasswordEmailToken";

export default function NewPasswordForm({
  t,
  tokenConfirmation,
}: {
  t: Dictionary;
  tokenConfirmation: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const email = searchParams.get("email") ?? undefined;

  const {
    execute: changePasswordEmail,
    isPending: changePasswordEmailIsPending,
  } = useAction(changePasswordEmailAction, {
    onSuccess: (data) => {
      toast.success(data.data?.success);
      router.push("/home");
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const { execute: changePasswordEmailToken, isPending: tokenIsPending } =
    useAction(changePasswordEmailTokenAction, {
      onSuccess: (data) => {
        toast.success(data.data?.success);
        router.push("/home");
      },
      onError: (error) => {
        toast.error(error.error.serverError);
      },
    });

  const NewPasswordFormSchema = ChangePasswordEmailSchema.extend({
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.signIn.errorPassword,
    path: ["confirmPassword"],
  });

  const form = useForm({
    schema: NewPasswordFormSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const onSubmit = handleSubmit((data) => {
    if (tokenConfirmation) {
      changePasswordEmailToken({
        password: data.password,
        token: data.token,
        email,
      });
    } else {
      changePasswordEmail({ password: data.password, token });
    }
  });

  const isFormValid =
    watch("password").length >= 6 &&
    !errors.password &&
    !errors.confirmPassword &&
    watch("password") === watch("confirmPassword");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center">{t.signIn.password}</div>
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} id="password" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center">
                    {t.signIn.confirmPassword}
                  </div>
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} id="confirmPassword" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {tokenConfirmation && (
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.signIn.resetPasswordCode}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={
            !isFormValid || changePasswordEmailIsPending || tokenIsPending
          }
        >
          {t.signIn.changePassword}
        </Button>
      </form>
    </Form>
  );
}
