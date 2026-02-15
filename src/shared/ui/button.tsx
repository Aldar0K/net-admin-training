import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib'
import { buttonVariants } from './buttonVariants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = Boolean(disabled || loading)

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && 'pointer-events-none',
        )}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={asChild ? isDisabled : undefined}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button }
