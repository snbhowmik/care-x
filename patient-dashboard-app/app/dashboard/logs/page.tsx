"use client"

import { Suspense, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Download,
  Edit,
  Share2,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Building2,
  FileText,
  AlertTriangle,
  ExternalLink,
  Copy,
} from "lucide-react"

interface AccessLog {
  id: string
  action: "view" | "download" | "edit" | "share"
  resource: string
  resourceType: string
  accessor: string
  accessorType: "physician" | "hospital" | "lab" | "pharmacy" | "insurance" | "patient"
  accessorOrg: string
  timestamp: string
  ipAddress: string
  location: string
  verified: boolean
  transactionHash: string
  keyUsed: string
}

const accessLogs: AccessLog[] = [
  {
    id: "log_001",
    action: "view",
    resource: "Blood Test Results - Jan 2026",
    resourceType: "Lab Result",
    accessor: "Dr. Emily Chen",
    accessorType: "physician",
    accessorOrg: "UCSF Medical Center",
    timestamp: "Jan 9, 2026 at 2:34 PM",
    ipAddress: "192.168.1.***",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x7f3a...8b2c",
    keyUsed: "key_001",
  },
  {
    id: "log_002",
    action: "download",
    resource: "Vaccination Records",
    resourceType: "Document",
    accessor: "Metro Hospital",
    accessorType: "hospital",
    accessorOrg: "Metro Hospital Network",
    timestamp: "Jan 9, 2026 at 11:15 AM",
    ipAddress: "10.0.0.***",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x4d2e...9f1a",
    keyUsed: "key_003",
  },
  {
    id: "log_003",
    action: "edit",
    resource: "Emergency Contact Info",
    resourceType: "Profile",
    accessor: "You",
    accessorType: "patient",
    accessorOrg: "Patient Owner",
    timestamp: "Jan 8, 2026 at 4:52 PM",
    ipAddress: "Your device",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x1a9c...3d7e",
    keyUsed: "master_key",
  },
  {
    id: "log_004",
    action: "view",
    resource: "Prescription History",
    resourceType: "Medication",
    accessor: "CVS Pharmacy #4521",
    accessorType: "pharmacy",
    accessorOrg: "CVS Health",
    timestamp: "Jan 7, 2026 at 9:20 AM",
    ipAddress: "172.16.0.***",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x8b5f...2c4d",
    keyUsed: "key_006",
  },
  {
    id: "log_005",
    action: "view",
    resource: "Insurance Claim CLM-2025-78432",
    resourceType: "Billing",
    accessor: "BlueCross BlueShield",
    accessorType: "insurance",
    accessorOrg: "BlueCross",
    timestamp: "Jan 5, 2026 at 3:45 PM",
    ipAddress: "203.0.113.***",
    location: "Remote",
    verified: true,
    transactionHash: "0x3e7d...5a9b",
    keyUsed: "key_007",
  },
  {
    id: "log_006",
    action: "download",
    resource: "Chest X-Ray Results",
    resourceType: "Imaging",
    accessor: "Dr. James Wilson",
    accessorType: "physician",
    accessorOrg: "SF Heart & Vascular Center",
    timestamp: "Jan 3, 2026 at 10:30 AM",
    ipAddress: "192.168.2.***",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x6c1b...7e3f",
    keyUsed: "key_002",
  },
  {
    id: "log_007",
    action: "view",
    resource: "Complete Blood Count",
    resourceType: "Lab Result",
    accessor: "LabCorp Diagnostics",
    accessorType: "lab",
    accessorOrg: "LabCorp",
    timestamp: "Jan 5, 2026 at 8:15 AM",
    ipAddress: "10.10.0.***",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x2f8a...4c6d",
    keyUsed: "key_004",
  },
  {
    id: "log_008",
    action: "share",
    resource: "Medical History Summary",
    resourceType: "Report",
    accessor: "You",
    accessorType: "patient",
    accessorOrg: "Patient Owner",
    timestamp: "Jan 2, 2026 at 2:00 PM",
    ipAddress: "Your device",
    location: "San Francisco, CA",
    verified: true,
    transactionHash: "0x9d4e...1b8c",
    keyUsed: "master_key",
  },
]

const actionConfig = {
  view: { icon: Eye, color: "text-chart-1", bg: "bg-chart-1/10", label: "Viewed" },
  download: { icon: Download, color: "text-chart-2", bg: "bg-chart-2/10", label: "Downloaded" },
  edit: { icon: Edit, color: "text-chart-4", bg: "bg-chart-4/10", label: "Edited" },
  share: { icon: Share2, color: "text-success", bg: "bg-success/10", label: "Shared" },
}

const accessorTypeConfig = {
  physician: { icon: User, color: "bg-chart-1" },
  hospital: { icon: Building2, color: "bg-chart-2" },
  lab: { icon: FileText, color: "bg-chart-4" },
  pharmacy: { icon: Building2, color: "bg-success" },
  insurance: { icon: Building2, color: "bg-chart-3" },
  patient: { icon: User, color: "bg-primary" },
}

function LogsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")

  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accessor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = filterAction === "all" || log.action === filterAction
    return matchesSearch && matchesAction
  })

  const stats = {
    total: accessLogs.length,
    views: accessLogs.filter((l) => l.action === "view").length,
    downloads: accessLogs.filter((l) => l.action === "download").length,
    uniqueAccessors: new Set(accessLogs.map((l) => l.accessor)).size,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Access Logs</h1>
          <p className="text-muted-foreground">Complete audit trail of all data access events</p>
        </div>
        <Badge variant="outline" className="gap-2 py-1.5 px-3 border-primary/30 text-primary">
          <Shield className="w-4 h-4" />
          Blockchain Verified
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: stats.total, icon: Clock },
          { label: "View Events", value: stats.views, icon: Eye },
          { label: "Downloads", value: stats.downloads, icon: Download },
          { label: "Unique Accessors", value: stats.uniqueAccessors, icon: User },
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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="view">Views</SelectItem>
            <SelectItem value="download">Downloads</SelectItem>
            <SelectItem value="edit">Edits</SelectItem>
            <SelectItem value="share">Shares</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blockchain Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Immutable Audit Trail</p>
              <p className="text-xs text-muted-foreground mt-1">
                Every access event is cryptographically signed and recorded on the blockchain. These records cannot be
                altered or deleted, ensuring complete transparency and accountability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const actionCfg = actionConfig[log.action]
          const accessorCfg = accessorTypeConfig[log.accessorType]
          return (
            <Card key={log.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Action Icon */}
                  <div className={`w-10 h-10 rounded-xl ${actionCfg.bg} flex items-center justify-center shrink-0`}>
                    <actionCfg.icon className={`w-5 h-5 ${actionCfg.color}`} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold ${actionCfg.color}`}>{actionCfg.label}</span>
                          <span className="text-foreground font-medium">{log.resource}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>by</span>
                          <div className={`w-5 h-5 rounded ${accessorCfg.color}/20 flex items-center justify-center`}>
                            <accessorCfg.icon className={`w-3 h-3 ${accessorCfg.color.replace("bg-", "text-")}`} />
                          </div>
                          <span className="font-medium text-foreground">{log.accessor}</span>
                          <span className="text-muted-foreground">({log.accessorOrg})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {log.verified && (
                          <div className="flex items-center gap-1 text-success text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{log.location}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {log.resourceType}
                      </Badge>
                    </div>

                    {/* Blockchain Details */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Transaction:</span>
                        <code className="px-2 py-0.5 bg-secondary rounded font-mono">{log.transactionHash}</code>
                        <Button variant="ghost" size="icon" className="w-5 h-5">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-5 h-5">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Key:</span>
                        <code className="px-2 py-0.5 bg-secondary rounded font-mono">{log.keyUsed}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No access logs found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

export default function LogsPage() {
  return (
    <Suspense fallback={null}>
      <LogsContent />
    </Suspense>
  )
}
