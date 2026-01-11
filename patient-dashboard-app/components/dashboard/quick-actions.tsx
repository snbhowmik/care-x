"use client"

import { Button } from "@/components/ui/button"
import { Plus, Share2, FileUp } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <FileUp className="w-4 h-4" />
        <span className="hidden sm:inline">Upload Record</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share Access</span>
      </Button>
      <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Key</span>
      </Button>
    </div>
  )
}
