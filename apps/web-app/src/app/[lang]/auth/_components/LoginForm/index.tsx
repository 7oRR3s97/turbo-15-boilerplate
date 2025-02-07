"use client";

import { useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Link } from "@packages/ui/base/components/link";
import { PasswordInput } from "@packages/ui/base/components/password-input";
import { Button } from "@packages/ui/base/ui/button";
import { Input } from "@packages/ui/base/ui/input";
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
import { LoginSchema } from "@packages/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { login } from "~/actions/auth/login";

export default function LoginForm({ t }: { t: Dictionary }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      login({ ...data, callbackUrl })
        .then((data) => {
          if (data?.data?.success) {
            form.reset();
            toast.success("Confirmation email sent!");
          }
          if (data?.data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch((error: Error) => {
          if (!isRedirectError(error)) {
            if (error.message) {
              if (error.message.includes("credentialssignin")) {
                toast.error(t.signIn.invalidCredentials);
              } else {
                toast.error(t.signIn.somethingWentWrong);
              }
            }
          }
        });
    });
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {showTwoFactor && (
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signIn.twoFactorCode}</FormLabel>
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

          {!showTwoFactor && (
            <>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.signIn.email}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          inputMode="email"
                          placeholder={t.signIn.emailPlaceholder}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center">
                          {t.signIn.password}
                          <Link
                            href="/auth/forgot-password"
                            className="ml-auto inline-block text-sm underline"
                            prefetch={true}
                          >
                            {t.signIn.forgotPassword}
                          </Link>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} id="password" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {t.signIn.login}
          </Button>
        </form>
      </Form>
    </>
  );
}
