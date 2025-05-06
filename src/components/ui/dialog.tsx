import * as React from "react"
import {
  Dialog as RadixDialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
  DialogDescription as RadixDialogDescription,
} from "@radix-ui/react-dialog"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props) => {
  const { open, onOpenChange, children } = props
  return (
    <RadixDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog>
  )
})

Dialog.displayName = "Dialog"

// DialogContent with overlay and scroll
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixDialogContent>
>(({ children, className = "", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 bg-black/50" />
    <RadixDialogContent
      ref={ref}
      {...props}
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto ${className}`}
    >
      {children}
    </RadixDialogContent>
  </DialogPortal>
))

DialogContent.displayName = "DialogContent"

// DialogTitle
const DialogTitle = RadixDialogTitle

// DialogDescription with default styling
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof RadixDialogDescription>
>(({ children, className = "", ...props }, ref) => (
  <RadixDialogDescription
    ref={ref}
    {...props}
    className={`text-sm text-gray-600 ${className}`}
  >
    {children}
  </RadixDialogDescription>
))

DialogDescription.displayName = "DialogDescription"

// DialogHeader wrapper for title & description
const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 space-y-1">{children}</div>
)

DialogHeader.displayName = "DialogHeader"

// DialogFooter wrapper for action buttons
const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 flex justify-end gap-2">{children}</div>
)

DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
}
