"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  content: React.ReactNode
}

export function InfoDialog({ open, onOpenChange, title, content }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px]"
        aria-describedby="info-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <p id="info-dialog-description" className="sr-only">
            {title} - інформаційне вікно з деталями
          </p>
        </DialogHeader>
        <div className="prose prose-sm max-w-none">{content}</div>
      </DialogContent>
    </Dialog>
  )
}
