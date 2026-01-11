"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Bell,
  Lock,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Trash2,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and security preferences</p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          {/* Two-Factor Authentication */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium">2FA is enabled</p>
                    <p className="text-xs text-muted-foreground">Using authenticator app</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Codes</p>
                  <p className="text-sm text-muted-foreground">Generate recovery codes for account access</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage devices where you are logged in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { device: "MacBook Pro - Chrome", location: "San Francisco, CA", current: true },
                { device: "iPhone 15 Pro - Safari", location: "San Francisco, CA", current: false },
              ].map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div>
                    <p className="font-medium text-sm">{session.device}</p>
                    <p className="text-xs text-muted-foreground">{session.location}</p>
                  </div>
                  {session.current ? (
                    <Badge variant="outline" className="border-success text-success">
                      Current
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Master Key */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Master Key Management
              </CardTitle>
              <CardDescription>Your blockchain master key controls all data access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Master Key Active</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your master key is securely stored and encrypted. Never share this key with anyone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Backup Key
                </Button>
                <Button variant="outline" className="bg-transparent text-destructive hover:text-destructive">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rotate Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  label: "Data Access Alerts",
                  description: "Get notified when someone accesses your records",
                  enabled: true,
                },
                { label: "Key Expiration Reminders", description: "Alerts before access keys expire", enabled: true },
                { label: "New Record Added", description: "When providers add new records", enabled: true },
                {
                  label: "Security Alerts",
                  description: "Unusual login attempts or suspicious activity",
                  enabled: true,
                },
                { label: "Weekly Summary", description: "Weekly digest of all activity", enabled: false },
              ].map((notification, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{notification.label}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your data visibility and sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  label: "Emergency Access Override",
                  description: "Allow emergency services to access critical info",
                  enabled: true,
                },
                {
                  label: "Anonymous Analytics",
                  description: "Help improve CARE-X with anonymized usage data",
                  enabled: false,
                },
                {
                  label: "Research Participation",
                  description: "Allow anonymized data for medical research",
                  enabled: false,
                },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue="sarah.johnson@email.com" className="bg-secondary border-border" disabled />
              </div>
              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input defaultValue="PAT-2024-001847" className="bg-secondary border-border font-mono" disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">Download a copy of all your health records</p>
                </div>
                <Button variant="outline" className="bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Badge({ variant, className, children }: { variant?: string; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  )
}
