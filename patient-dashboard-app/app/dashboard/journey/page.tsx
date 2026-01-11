"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Share2, Key, Database, Activity, CheckCircle2 } from "lucide-react"

export default function JourneyPage() {
    const steps = [
        {
            icon: Activity,
            title: "1. Device Connection",
            desc: "Wearables & Sensors connect to the Gateway.",
            detail: "Data: Heart Rate, O2, Activity Leves"
        },
        {
            icon: Shield,
            title: "2. Identity Verification",
            desc: "Automated authentication via Blockchain.",
            detail: "Zero-Knowledge Proofs ensure privacy."
        },
        {
            icon: Database,
            title: "3. Secure Storage",
            desc: "Data is encrypted and stored in IPFS.",
            detail: "Distributed storage ensures no central point of failure."
        },
        {
            icon: Lock,
            title: "4. Access Control",
            desc: "Patient holds the Master Key.",
            detail: "You decide who sees what."
        },
        {
            icon: Share2,
            title: "5. Granular Sharing",
            desc: "Share specific files with Doctors.",
            detail: "Time-limited, verifiable access grants."
        }
    ]

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    The User Journey
                </h1>
                <p className="text-xl text-muted-foreground">
                    From sensor to secure storage, track how your health data travels safely.
                </p>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <div key={i} className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Node Icon */}
                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                <step.icon className="w-8 h-8 text-primary" />
                                <div className="absolute -bottom-2 bg-background px-2 text-xs font-bold text-primary border rounded-full">
                                    {i + 1}
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="ml-24 md:ml-0 md:w-1/2 p-4">
                                <Card className="glass-card hover:bg-primary/5 transition-colors border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{step.title}</CardTitle>
                                        <CardDescription>{step.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                            {step.detail}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Spacer for alternate side */}
                            <div className="hidden md:block md:w-1/2" />
                        </div>
                    ))}
                </div>

                {/* Final Step */}
                <div className="flex flex-col items-center mt-12 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-green-500">Secure & Complete</h3>
                </div>
            </div>
        </div>
    )
}
