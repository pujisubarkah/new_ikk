"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  children: React.ReactNode
}

function Pagination({ children }: PaginationProps) {
  return <nav role="navigation" aria-label="pagination" className="flex w-full justify-center">{children}</nav>
}

function PaginationContent({ children }: PaginationProps) {
  return <ul className="flex items-center gap-1">{children}</ul>
}

function PaginationItem({ children }: PaginationProps) {
  return <li>{children}</li>
}

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean
  isDisabled?: boolean
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, isDisabled, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground",
          isDisabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
PaginationLink.displayName = "PaginationLink"

function PaginationPrevious({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      Sebelumnya
    </a>
  )
}

function PaginationNext({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      Berikutnya
    </a>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
}
