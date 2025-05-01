import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useToast } from "./use-toast"

// Variants definition
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[100%] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=move]:will-change-transform",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-warning bg-warning text-warning-foreground",
        info: "border-info bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ToastProps = React.ComponentPropsWithoutRef<"div"> & 
  VariantProps<typeof toastVariants> & {
    duration?: number
    onDismiss?: () => void
  }

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, children, duration = 5000, onDismiss, ...props }, ref) => {
    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss?.()
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onDismiss])

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === "destructive" ? "assertive" : "polite"}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Toast.displayName = "Toast"

type ToastTitleProps = React.ComponentPropsWithoutRef<"div">

const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-sm font-semibold [&+div]:mt-1", className)} 
      {...props} 
    />
  )
)
ToastTitle.displayName = "ToastTitle"

type ToastDescriptionProps = React.ComponentPropsWithoutRef<"div">

const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-sm opacity-90", className)} 
      {...props} 
    />
  )
)
ToastDescription.displayName = "ToastDescription"

type ToastCloseProps = React.ComponentPropsWithoutRef<"button">

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const { dismiss } = useToast()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      dismiss()
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Close toast"
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <X className="h-4 w-4" />
      </button>
    )
  }
)
ToastClose.displayName = "ToastClose"

type ToastActionProps = React.ComponentPropsWithoutRef<"button">

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
ToastAction.displayName = "ToastAction"

type ToastProviderProps = React.ComponentPropsWithoutRef<"div"> & {
  swipeDirection?: "up" | "down" | "left" | "right"
  swipeThreshold?: number
}

const ToastProvider = React.forwardRef<HTMLDivElement, ToastProviderProps>(
  ({ className, swipeDirection = "right", swipeThreshold = 50, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4",
        className
      )}
      data-swipe-direction={swipeDirection}
      data-swipe-threshold={swipeThreshold}
      {...props}
    />
  )
)
ToastProvider.displayName = "ToastProvider"

type ToastViewportProps = React.ComponentPropsWithoutRef<"div">

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 max-sm:w-full max-sm:px-2",
        className
      )}
      {...props}
    />
  )
)
ToastViewport.displayName = "ToastViewport"

export {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastClose,
  ToastViewport,
  ToastAction,
}
export type {
  ToastProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToastActionProps,
  ToastProviderProps,
  ToastViewportProps,
}