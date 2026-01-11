"use client"

import { Suspense, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  TestTube,
  Pill,
  ImageIcon,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  CheckCircle2,
  Calendar,
  Building2,
  MoreVertical,
  Share2,
  Trash2,
  Lock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MedicalRecord {
  id: string
  name: string
  type: "report" | "lab" | "prescription" | "imaging" | "document"
  category: string
  date: string
  provider: string
  facility: string
  size: string
  verified: boolean
  encrypted: boolean
  description: string
}

const records: MedicalRecord[] = [
  {
    id: "rec_001",
    name: "Annual Physical Examination Report",
    type: "report",
    category: "General",
    date: "Jan 8, 2026",
    provider: "Dr. Emily Chen",
    facility: "UCSF Medical Center",
    size: "1.2 MB",
    verified: true,
    encrypted: true,
    description: "Comprehensive annual health evaluation including vitals, physical exam, and recommendations.",
  },
  {
    id: "rec_002",
    name: "Complete Blood Count (CBC)",
    type: "lab",
    category: "Blood Work",
    date: "Jan 5, 2026",
    provider: "LabCorp Diagnostics",
    facility: "Downtown SF Lab",
    size: "245 KB",
    verified: true,
    encrypted: true,
    description: "Routine blood panel including RBC, WBC, hemoglobin, and platelet analysis.",
  },
  {
    id: "rec_003",
    name: "Lisinopril 10mg Prescription",
    type: "prescription",
    category: "Medication",
    date: "Dec 28, 2025",
    provider: "Dr. Emily Chen",
    facility: "CVS Pharmacy #4521",
    size: "128 KB",
    verified: true,
    encrypted: true,
    description: "90-day supply of blood pressure medication with 2 refills remaining.",
  },
  {
    id: "rec_004",
    name: "Chest X-Ray Results",
    type: "imaging",
    category: "Radiology",
    date: "Dec 10, 2025",
    provider: "Dr. Sarah Miller",
    facility: "SF Heart & Vascular Center",
    size: "15.8 MB",
    verified: true,
    encrypted: true,
    description: "Standard chest radiograph showing normal cardiac silhouette and clear lung fields.",
  },
  {
    id: "rec_005",
    name: "Lipid Panel Results",
    type: "lab",
    category: "Blood Work",
    date: "Nov 15, 2025",
    provider: "LabCorp Diagnostics",
    facility: "Downtown SF Lab",
    size: "198 KB",
    verified: true,
    encrypted: true,
    description: "Cholesterol and triglyceride analysis with HDL/LDL breakdown.",
  },
  {
    id: "rec_006",
    name: "Vaccination Record - Flu 2025",
    type: "document",
    category: "Immunization",
    date: "Nov 20, 2025",
    provider: "Nurse Amy Lee",
    facility: "UCSF Medical Center",
    size: "95 KB",
    verified: true,
    encrypted: true,
    description: "Quadrivalent influenza vaccination documentation.",
  },
  {
    id: "rec_007",
    name: "Echocardiogram Report",
    type: "imaging",
    category: "Cardiology",
    date: "Oct 5, 2025",
    provider: "Dr. James Wilson",
    facility: "SF Heart & Vascular Center",
    size: "8.4 MB",
    verified: true,
    encrypted: true,
    description: "Cardiac ultrasound showing normal heart function and structure.",
  },
  {
    id: "rec_008",
    name: "Insurance EOB Statement",
    type: "document",
    category: "Billing",
    date: "Dec 15, 2025",
    provider: "BlueCross BlueShield",
    facility: "Online Portal",
    size: "312 KB",
    verified: true,
    encrypted: true,
    description: "Explanation of Benefits for cardiology consultation claim.",
  },
]

const typeConfig = {
  report: { icon: FileText, color: "bg-chart-1", label: "Report" },
  lab: { icon: TestTube, color: "bg-chart-2", label: "Lab Result" },
  prescription: { icon: Pill, color: "bg-chart-4", label: "Prescription" },
  imaging: { icon: ImageIcon, color: "bg-chart-5", label: "Imaging" },
  document: { icon: FileText, color: "bg-success", label: "Document" },
}

function RecordsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || record.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
          <p className="text-muted-foreground">View and manage your encrypted health documents</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground">
              <Upload className="w-4 h-4" />
              Upload Record
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
              <DialogDescription>Add a new document to your encrypted health vault</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 50MB</p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Files are encrypted end-to-end before upload</span>
              </div>
              <Button className="w-full bg-primary text-primary-foreground">Upload & Encrypt</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Type Tabs */}
      <Tabs defaultValue="all" onValueChange={setSelectedType}>
        <TabsList className="bg-secondary h-auto flex-wrap justify-start">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="report">Reports</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: records.length, icon: FileText },
          { label: "Lab Results", value: records.filter((r) => r.type === "lab").length, icon: TestTube },
          { label: "Prescriptions", value: records.filter((r) => r.type === "prescription").length, icon: Pill },
          { label: "Imaging", value: records.filter((r) => r.type === "imaging").length, icon: ImageIcon },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className="w-8 h-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((record) => {
          const config = typeConfig[record.type]
          return (
            <Card key={record.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.color}/20 flex items-center justify-center shrink-0`}>
                    <config.icon className={`w-6 h-6 ${config.color.replace("bg-", "text-")}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{record.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{record.provider}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{record.description}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {config.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{record.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{record.facility}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 mt-3">
                      {record.verified && (
                        <div className="flex items-center gap-1 text-success text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                      {record.encrypted && (
                        <div className="flex items-center gap-1 text-primary text-xs">
                          <Shield className="w-3 h-3" />
                          <span>Encrypted</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{record.size}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No records found matching your search</p>
        </div>
      )}
    </div>
  )
}

export default function RecordsPage() {
  return (
    <Suspense fallback={null}>
      <RecordsContent />
    </Suspense>
  )
}
