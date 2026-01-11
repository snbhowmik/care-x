"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Shield, CheckCircle2, Trash2 } from "lucide-react"

export function RecentAccessLogs({ accessList = [], onRevoke }: { accessList?: string[], onRevoke?: (addr: string) => void }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg">Authorized Users</CardTitle>
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
            <Shield className="w-3 h-3" />
            Blockchain Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Wallet Address</th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {accessList.length === 0 ? (
                <tr><td colSpan={3} className="py-4 text-center text-muted-foreground">No active authorizations.</td></tr>
              ) : (
                accessList.map((addr, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-4">
                      <span className="font-mono text-sm">{addr}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      {onRevoke && (
                        <Button variant="destructive" size="sm" onClick={() => onRevoke(addr)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
