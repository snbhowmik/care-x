"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Pill,
  Stethoscope,
  TestTube,
  FileCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  Building2,
  Download,
  Filter,
} from "lucide-react"

interface TimelineEvent {
  id: string
  date: string
  time: string
  title: string
  description: string
  type: "checkup" | "lab" | "medication" | "document" | "specialist"
  icon: React.ComponentType<{ className?: string }>
  color: string
  status: "completed" | "verified" | "active" | "pending"
  provider: string
  location: string
  details?: string[]
  attachments?: { name: string; type: string }[]
}

const allEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "Jan 8, 2026",
    time: "10:30 AM",
    title: "Annual Physical Examination",
    description: "Comprehensive health checkup including vitals, blood pressure, and general assessment.",
    type: "checkup",
    icon: Stethoscope,
    color: "bg-chart-1",
    status: "completed",
    provider: "Dr. Emily Chen",
    location: "UCSF Medical Center",
    details: [
      "Blood pressure: 118/76 mmHg (Normal)",
      "Heart rate: 72 bpm",
      "Temperature: 98.4°F",
      "BMI: 22.8 (Healthy)",
      "Reflexes: Normal",
    ],
    attachments: [{ name: "Physical_Exam_Report_2026.pdf", type: "PDF" }],
  },
  {
    id: "2",
    date: "Jan 5, 2026",
    time: "8:00 AM",
    title: "Complete Blood Count (CBC) Results",
    description: "Routine blood work analysis including RBC, WBC, hemoglobin, and platelet counts.",
    type: "lab",
    icon: TestTube,
    color: "bg-chart-2",
    status: "verified",
    provider: "LabCorp Diagnostics",
    location: "Downtown SF Lab",
    details: [
      "Hemoglobin: 13.8 g/dL (Normal)",
      "WBC: 6,500/μL (Normal)",
      "RBC: 4.7 million/μL (Normal)",
      "Platelets: 250,000/μL (Normal)",
    ],
    attachments: [{ name: "CBC_Results_Jan2026.pdf", type: "PDF" }],
  },
  {
    id: "3",
    date: "Dec 28, 2025",
    time: "2:15 PM",
    title: "Prescription Renewal - Lisinopril",
    description: "Blood pressure medication renewed for 90-day supply.",
    type: "medication",
    icon: Pill,
    color: "bg-chart-4",
    status: "active",
    provider: "Dr. Emily Chen",
    location: "CVS Pharmacy #4521",
    details: ["Medication: Lisinopril 10mg", "Dosage: Once daily", "Refills remaining: 2", "Next review: Apr 2026"],
  },
  {
    id: "4",
    date: "Dec 15, 2025",
    time: "3:30 PM",
    title: "Insurance Claim Processed",
    description: "Health insurance claim for cardiology consultation approved and processed.",
    type: "document",
    icon: FileCheck,
    color: "bg-success",
    status: "completed",
    provider: "BlueCross BlueShield",
    location: "Online Portal",
    details: [
      "Claim ID: CLM-2025-78432",
      "Amount billed: $450.00",
      "Insurance covered: $382.50",
      "Patient responsibility: $67.50",
    ],
  },
  {
    id: "5",
    date: "Dec 10, 2025",
    time: "11:00 AM",
    title: "Cardiology Consultation",
    description: "Follow-up appointment for hypertension management and medication review.",
    type: "specialist",
    icon: Activity,
    color: "bg-chart-5",
    status: "completed",
    provider: "Dr. James Wilson",
    location: "SF Heart & Vascular Center",
    details: [
      "ECG: Normal sinus rhythm",
      "Blood pressure: 122/78 mmHg",
      "Recommendation: Continue current medication",
      "Next appointment: June 2026",
    ],
    attachments: [{ name: "Cardiology_Notes_Dec2025.pdf", type: "PDF" }],
  },
  {
    id: "6",
    date: "Nov 20, 2025",
    time: "9:00 AM",
    title: "Flu Vaccination",
    description: "Annual influenza vaccination administered.",
    type: "checkup",
    icon: Stethoscope,
    color: "bg-chart-1",
    status: "verified",
    provider: "Nurse Practitioner Amy Lee",
    location: "UCSF Medical Center",
    details: ["Vaccine: Quadrivalent Influenza", "Lot #: FLU2025-4892", "Site: Left deltoid", "No adverse reactions"],
  },
]

export default function TimelinePage() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("all")

  const filteredEvents = filterType === "all" ? allEvents : allEvents.filter((e) => e.type === filterType)

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Health Timeline</h1>
          <p className="text-muted-foreground">Complete history of your healthcare activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" onValueChange={setFilterType}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="checkup">Checkups</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="medication">Medications</TabsTrigger>
          <TabsTrigger value="specialist">Specialists</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className={`bg-card border-border transition-all duration-300 ${expandedEvent === event.id ? "ring-1 ring-primary/30" : "hover:border-primary/30"}`}
            >
              <CardContent className="p-0">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(event.id)}
                  onKeyDown={(e) => e.key === "Enter" && toggleExpand(event.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-xl ${event.color} flex items-center justify-center shrink-0`}
                    >
                      <event.icon className="w-6 h-6 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              event.status === "verified"
                                ? "border-primary text-primary"
                                : event.status === "active"
                                  ? "border-chart-4 text-chart-4"
                                  : event.status === "completed"
                                    ? "border-success text-success"
                                    : "border-muted-foreground text-muted-foreground"
                            }`}
                          >
                            {event.status === "verified" && <Shield className="w-3 h-3 mr-1" />}
                            {event.status}
                          </Badge>
                          {expandedEvent === event.id ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedEvent === event.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-border mt-2">
                    <div className="mt-4 ml-16 space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.provider}</p>
                          <p className="text-xs text-muted-foreground">Healthcare Provider</p>
                        </div>
                      </div>

                      {/* Details */}
                      {event.details && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {event.details.map((detail, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attachments */}
                      {event.attachments && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Attachments</h4>
                          <div className="flex flex-wrap gap-2">
                            {event.attachments.map((attachment, i) => (
                              <Button key={i} variant="outline" size="sm" className="gap-2 bg-transparent">
                                <FileCheck className="w-4 h-4" />
                                {attachment.name}
                                <Download className="w-3 h-3" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Blockchain Verification */}
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-primary">Blockchain Verified</p>
                          <p className="text-xs text-muted-foreground">
                            This record is immutably stored and cryptographically signed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
