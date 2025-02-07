"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "@packages/ui/base/ui/button";
import { Input } from "@packages/ui/base/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@packages/ui/components/form";
import { ResetPasswordSchema } from "@packages/validators/auth";

import type { Dictionary } from "~/utils/getDictionary";
import { resetPassword } from "~/actions/auth/resetPassword";

export default function ResetForm({
  t,
  tokenConfirmation,
}: {
  t: Dictionary;
  tokenConfirmation: boolean;
}) {
  const router = useRouter();
  const { execute: reset, isPending } = useAction(resetPassword, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success("Reset email sent!");
      }
      if (tokenConfirmation) {
        router.push(`/auth/new-password?email=${data.data?.email}`);
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const form = useForm({
    schema: ResetPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    reset(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {t.signIn.sendResetEmail}
        </Button>
      </form>
    </Form>
  );
}
