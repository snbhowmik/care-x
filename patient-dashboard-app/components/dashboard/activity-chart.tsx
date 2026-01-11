"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
    { month: "Jul", visits: 2, reports: 3, updates: 5 },
    { month: "Aug", visits: 1, reports: 2, updates: 8 },
    { month: "Sep", visits: 3, reports: 4, updates: 6 },
    { month: "Oct", visits: 2, reports: 5, updates: 10 },
    { month: "Nov", visits: 1, reports: 3, updates: 7 },
    { month: "Dec", visits: 4, reports: 6, updates: 12 },
    { month: "Jan", visits: 2, reports: 4, updates: 9 },
]

export function ActivityChart() {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Healthcare Activity</CardTitle>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-1" />
                        <span className="text-xs text-muted-foreground">Visits</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-2" />
                        <span className="text-xs text-muted-foreground">Reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-4" />
                        <span className="text-xs text-muted-foreground">Updates</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.75 0.15 180)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="oklch(0.75 0.15 180)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 240)" />
                            <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(0.16 0.01 240)",
                                    border: "1px solid oklch(0.28 0.02 240)",
                                    borderRadius: "8px",
                                    color: "oklch(0.95 0 0)",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="visits"
                                stroke="oklch(0.75 0.15 180)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorVisits)"
                            />
                            <Area
                                type="monotone"
                                dataKey="reports"
                                stroke="oklch(0.65 0.18 160)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorReports)"
                            />
                            <Area
                                type="monotone"
                                dataKey="updates"
                                stroke="oklch(0.75 0.18 85)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorUpdates)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
