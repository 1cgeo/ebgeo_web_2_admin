// Path: hooks\useForm.ts
import { useCallback, useState } from 'react';

export interface FormState<T> {
  values: T;
  errors: Partial<T>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
}

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Partial<T>;
}

export function useForm<T extends Record<string, string>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: Object.keys(initialValues).reduce(
      (acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      },
      {} as Record<keyof T, boolean>,
    ),
    isSubmitting: false,
  });

  const setErrors = useCallback((errors: Partial<T>) => {
    setState(prev => ({ ...prev, errors }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (validate) {
        const validationErrors = validate(state.values);
        if (Object.keys(validationErrors).length > 0) {
          setState(prev => ({ ...prev, errors: validationErrors }));
          return;
        }
      }

      setState(prev => ({ ...prev, isSubmitting: true, errors: {} }));
      try {
        await onSubmit(state.values);
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.values, validate, onSubmit],
  );

  return {
    ...state,
    setErrors,
    handleChange,
    handleSubmit,
  };
}
