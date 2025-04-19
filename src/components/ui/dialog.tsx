import * as React from "react"
import { Dialog as RadixDialog, DialogTrigger, DialogContent, DialogTitle } from "@radix-ui/react-dialog"

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

export { Dialog, DialogTrigger, DialogContent, DialogTitle }
