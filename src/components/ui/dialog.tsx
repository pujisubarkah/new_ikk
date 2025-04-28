import * as React from "react"
import {
  Dialog as RadixDialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent as RadixDialogContent,
  DialogTitle as RadixDialogTitle,
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

// Custom DialogContent with centering, overlay and scroll
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixDialogContent>
>(({ children, className = "", ...props }, ref) => (
  <DialogPortal>
    {/* Overlay */}
    <DialogOverlay className="fixed inset-0 bg-black/50" />
    {/* Content */}
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

const DialogTitle = RadixDialogTitle

export { Dialog, DialogTrigger, DialogContent, DialogTitle }
