import * as React from 'react'

import { cn } from '@/shared/lib'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

export type SelectFieldOption = {
  value: string
  label: string
}

export type SelectFieldProps = {
  label?: React.ReactNode
  value?: string
  onValueChange: (value: string) => void
  options: SelectFieldOption[]
  placeholder?: string
  disabled?: boolean
  error?: React.ReactNode
  helperText?: React.ReactNode
  id?: string
  containerClassName?: string
  descriptionClassName?: string
}

export const SelectField = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  error,
  helperText,
  id,
  containerClassName,
  descriptionClassName,
}: SelectFieldProps) => {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const labelId = `${fieldId}-label`
  const describedById = error || helperText ? `${fieldId}-description` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label id={labelId} htmlFor={fieldId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={fieldId}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={describedById}
          aria-invalid={Boolean(error) || undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
}
