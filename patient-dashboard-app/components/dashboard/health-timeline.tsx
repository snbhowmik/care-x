"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Pill, Stethoscope, TestTube, FileCheck, File, FileText, Download, Lock } from "lucide-react"

export function HealthTimeline({ records = [], dbRecords = [] }: { records?: any[], dbRecords?: any[] }) {

  const handleOpenFile = (filename: string) => {
    window.open(`/api/files/${filename}`, '_blank');
  }

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Health Records</CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs border-success/50 text-success">
            {dbRecords.length} Files
          </Badge>
          <Badge variant="outline" className="text-xs border-primary/50 text-primary">
            {records.length} On-Chain
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* SECTION 1: DATABASE FILES */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">My Documents</h3>
          {dbRecords.length === 0 ? (
            <div className="p-4 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
              No documents uploaded.
            </div>
          ) : (
            <div className="grid gap-3">
              {dbRecords.map((doc: any, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => handleOpenFile(doc.file_name)}>
                    <Download className="w-4 h-4 mr-2" /> Open
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: BLOCKCHAIN */}
        <div className="relative">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Blockchain Audit Trail</h3>

          {/* Timeline line */}
          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {records.length === 0 ? (
              <div className="pl-10 text-sm text-muted-foreground">No records found on chain.</div>
            ) : (
              records.map((rec, index) => (
                <div key={index} className="relative flex gap-4">
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full ${rec.isCritical ? "bg-red-500/20" : "bg-cyan-500/20"} flex items-center justify-center shrink-0 border border-border`}
                  >
                    <Lock className={`w-4 h-4 ${rec.isCritical ? "text-red-500" : "text-cyan-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">Immutable Record Log</p>
                        <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px] bg-black/30 p-1 rounded mt-1">
                          {rec.ipfsHash}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">{new Date(rec.timestamp * 1000).toLocaleDateString()}</p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] mt-1 ${rec.isCritical
                            ? "border-destructive text-destructive"
                            : "border-primary text-primary"
                            }`}
                        >
                          {rec.isCritical ? "CRITICAL" : "ROUTINE"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
