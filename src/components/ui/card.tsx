// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

// Card Component
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border bg-white p-4 shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

// CardHeader Component
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b pb-2 mb-2 text-xl font-semibold", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// CardTitle Component
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-bold text-gray-900", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// CardContent Component
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-2 text-sm text-gray-700", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"


