import * as React from 'react'

import { cn } from '@/shared/lib'

export type CheckboxFieldProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label: React.ReactNode
  helperText?: React.ReactNode
  error?: React.ReactNode
  containerClassName?: string
  labelClassName?: string
  descriptionClassName?: string
}

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      className,
      containerClassName,
      labelClassName,
      descriptionClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const describedById = error || helperText ? `${inputId}-description` : undefined

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={cn(
              'peer h-4 w-4 rounded border border-input text-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describedById}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none',
              disabled && 'cursor-not-allowed opacity-70',
              labelClassName,
            )}
          >
            {label}
          </label>
        </div>
        {(error || helperText) && (
          <p
            id={describedById}
            aria-live={error ? 'assertive' : 'polite'}
            className={cn(
              'text-xs',
              error ? 'text-destructive' : 'text-muted-foreground',
              descriptionClassName,
            )}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    )
  },
)

CheckboxField.displayName = 'CheckboxField'
