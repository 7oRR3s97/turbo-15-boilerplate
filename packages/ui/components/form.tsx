"use client";

import type { UseFormProps } from "react-hook-form";
import type { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as __useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "../base/ui/form";

const useForm = <TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) => {
  const form = __useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
};

export {
  useForm,
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};

export { useFieldArray } from "react-hook-form";
