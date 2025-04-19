import * as React from "react"
import { Dialog as RadixDialog } from "@radix-ui/react-dialog"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(({ open, onOpenChange, children }, ref) => {
  return (
    <RadixDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog>
  )
})

Dialog.displayName = "Dialog"

export { Dialog }
