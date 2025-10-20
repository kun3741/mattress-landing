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
        className="sm:max-w-[800px] max-h-[85vh] p-0"
        aria-describedby="info-dialog-description"
      >
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <p id="info-dialog-description" className="sr-only">
              {title} - інформаційне вікно з деталями
            </p>
          </DialogHeader>
          <div className="prose prose-sm max-w-none px-6 pb-6 overflow-y-auto">
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
