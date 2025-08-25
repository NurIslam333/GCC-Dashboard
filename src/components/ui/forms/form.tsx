import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type {
  SubmitHandler,
  UseFormReturn,
  UseFormProps,
  FieldValues,
} from 'react-hook-form';
import type { SchemaOf } from 'yup';

type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  useFormProps?: UseFormProps<TFormValues>;
  validationSchema?: SchemaOf<TFormValues> | any; // Allow any schema type for flexibility
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

export const Form = <
  TFormValues extends FieldValues = Record<string, any>
>({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  ...formProps
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({
    ...useFormProps,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      {...formProps}
    >
      <FormProvider {...methods}>{children(methods)}</FormProvider>
    </form>
  );
};
