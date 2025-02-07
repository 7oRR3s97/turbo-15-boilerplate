"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

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
import { VerifyEmailSchema } from "@packages/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { verifyEmail as verifyEmailAction } from "~/actions/auth/verifyEmail";
import { verifyEmailToken as verifyEmailTokenAction } from "~/actions/auth/verifyEmailToken";

export default function NewVerificationForm({ t }: { t: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    execute: verifyEmail,
    result,
    hasErrored,
  } = useAction(verifyEmailAction, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success);
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });
  const { execute: verifyEmailToken, isPending: isPendingToken } = useAction(
    verifyEmailTokenAction,
    {
      onSuccess: (data) => {
        if (data.data?.success) {
          toast.success(data.data.success);
        }
      },
      onError: (error) => {
        toast.error(error.error.serverError);
      },
    },
  );

  const token = searchParams.get("token") ?? undefined;
  const email = searchParams.get("email") ?? undefined;

  const form = useForm({
    schema: VerifyEmailSchema,
    defaultValues: {
      token: "",
    },
  });

  const onSubmitToken = form.handleSubmit((data) => {
    verifyEmailToken({ ...data, email });
    router.push("/home");
  });

  const onSubmit = useCallback(() => {
    verifyEmail({ token });
  }, [token, verifyEmail]);

  useEffect(() => {
    if (token) {
      onSubmit();
      router.push("/home");
    }
  }, [onSubmit, router, token]);
  return (
    <>
      {token && !result.data?.success && !hasErrored && <BeatLoader />}
      {
        <Form {...form}>
          <form onSubmit={onSubmitToken} className="space-y-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.signIn.verifyEmailCode}</FormLabel>
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
            <Button type="submit" className="w-full" disabled={isPendingToken}>
              {t.signIn.verifyEmail}
            </Button>
          </form>
        </Form>
      }
    </>
  );
}
