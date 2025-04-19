import * as React from "react"
import { Dialog as RadixDialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const { open, onOpenChange, children } = props

  return (
    <RadixDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog>
  )
})

Dialog.displayName = "Dialog"

export { Dialog, DialogTrigger, DialogContent, DialogTitle }
