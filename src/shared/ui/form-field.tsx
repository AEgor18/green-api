import type { ComponentProps, ComponentType, ReactNode } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { Input } from './input';

type InputProps = ComponentProps<'input'>;

interface FormFieldProps extends InputProps {
  id: string;
  label: ReactNode;
  error?: { message?: string };
  description?: ReactNode;
  component?: ComponentType<InputProps>;
}

export function FormField({
  id,
  label,
  error,
  description,
  component: Control = Input,
  ...inputProps
}: FormFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Control id={id} aria-invalid={!!error} {...inputProps} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error]} />
    </Field>
  );
}
