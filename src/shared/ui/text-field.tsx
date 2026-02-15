import * as React from 'react'

import { cn } from '@/shared/lib'
import { Input } from './input'

export type TextFieldProps = React.ComponentProps<'input'> & {
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  containerClassName?: string
  descriptionClassName?: string
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      className,
      containerClassName,
      descriptionClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const describedById = error || helperText ? `${inputId}-description` : undefined

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4"
            >
              {startIcon}
            </span>
          )}
          <Input
            id={inputId}
            ref={ref}
            className={cn(startIcon && 'pl-9', endIcon && 'pr-9', className)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describedById}
            {...props}
          />
          {endIcon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4"
            >
              {endIcon}
            </span>
          )}
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

TextField.displayName = 'TextField'
