"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, Lock, Key, FileCheck } from "lucide-react"

export function TrustScore({ recordCount = 0, keyCount = 0 }: { recordCount?: number, keyCount?: number }) {
  const verifications = [
    { label: "Identity Verified", icon: CheckCircle2, status: true },
    { label: "Records Encrypted", icon: Lock, status: recordCount > 0 },
    { label: "Keys Secured", icon: Key, status: keyCount > 0 },
    { label: "Documents Signed", icon: FileCheck, status: recordCount > 0 },
  ]

  const activeChecks = verifications.filter(v => v.status).length;
  const score = Math.round((activeChecks / verifications.length) * 100);
  const circumference = 2 * Math.PI * 45

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Trust Score</CardTitle>
        <Badge className="bg-success/20 text-success border-success/30">Excellent</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-secondary"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (score / 100) * circumference}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Shield className="w-6 h-6 text-primary mb-1" />
              <span className="text-2xl font-bold">{score}%</span>
            </div>
          </div>

          {/* Verification List */}
          <div className="w-full mt-6 space-y-3">
            {verifications.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.status ? "text-green-500" : "text-muted-foreground"}`} />
                  <span className={`text-sm ${item.status ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${item.status ? "bg-green-500" : "bg-muted"}`} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
