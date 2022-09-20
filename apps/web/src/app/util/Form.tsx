import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";

export type FormProps<T> = {
  form: UseFormReturn<T>;
}

export function withForm<T>(Component){
  return props => <Component {...props} form={useForm<T>()} />;
}
