"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, ChevronRight, User, Building2, FlaskConical, Ambulance } from "lucide-react"
import Link from "next/link"

export function KeyHierarchyPreview({ doctorCount = 0 }: { doctorCount?: number }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Key Hierarchy</CardTitle>
        <Link href="/dashboard/keys">
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Master Key */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse-glow">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <p className="mt-2 font-semibold text-sm">Master Key</p>
            <Badge variant="outline" className="mt-1 text-[10px] border-primary text-primary">
              Patient Owner
            </Badge>
          </div>

          {/* Connection lines */}
          <div className="flex justify-center mb-4">
            <div className="w-0.5 h-8 bg-border" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-3/4 h-0.5 bg-border relative">
              <div className="absolute left-0 top-0 w-0.5 h-4 bg-border" />
              <div className="absolute left-1/3 top-0 w-0.5 h-4 bg-border" />
              <div className="absolute left-2/3 top-0 w-0.5 h-4 bg-border" />
              <div className="absolute right-0 top-0 w-0.5 h-4 bg-border" />
            </div>
          </div>

          {/* Sub Keys */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: User, label: "Doctor", count: doctorCount, color: "bg-chart-1" },
              { icon: Building2, label: "Hospital", count: 2, color: "bg-chart-2" },
              { icon: FlaskConical, label: "Lab", count: 1, color: "bg-chart-4" },
              { icon: Ambulance, label: "Emergency", count: 1, color: "bg-chart-5" },
            ].map((key, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl ${key.color}/20 border border-${key.color.replace("bg-", "")}/30 flex items-center justify-center`}
                >
                  <key.icon className={`w-5 h-5 ${key.color.replace("bg-", "text-")}`} />
                </div>
                <p className="mt-2 text-xs font-medium text-center">{key.label}</p>
                <p className="text-[10px] text-muted-foreground">{key.count} keys</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
