"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Key, Shield, Activity } from "lucide-react"

export function StatsCards({ totalRecords = 0, activeKeys = 0 }: { totalRecords?: number, activeKeys?: number }) {
  const stats = [
    {
      label: "Medical Records",
      value: totalRecords.toString(),
      change: "On Blockchain",
      icon: FileText,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Active Access Keys",
      value: activeKeys.toString(),
      change: "Authorized Users",
      icon: Key,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Security Score",
      value: "98%",
      change: "Excellent",
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Health Score",
      value: "85",
      change: "Stable",
      icon: Activity,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className={`text-xs mt-2 ${stat.color}`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
