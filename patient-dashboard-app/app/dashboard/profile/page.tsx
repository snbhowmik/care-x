"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Heart,
  Droplets,
  AlertCircle,
  Edit,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  // Dynamic Profile Data based on User
  const getProfileData = (u: any) => {
    if (u?.name === "Subir Nath Bhowmik") {
      return {
        dob: "Feb 14, 2004",
        address: "SRM IST, Tiruchirappalli, TN",
        gender: "Male",
        bloodType: "O+",
        height: "5'9\" (175 cm)",
        weight: "154 lbs (70 kg)",
        phone: "+91 98765 43210",
        emergency: [
          { name: "Alok Bhowmik", relation: "Father", phone: "+91 99887 76655", primary: true }
        ],
        allergies: ["Dust Mites"],
        conditions: [{ name: "Dengue Recovery", status: "Monitoring", since: "2023" }]
      }
    }
    if (u?.name === "Aarav Sharma") {
      return {
        dob: "Jan 10, 1996",
        address: "Mumbai, MH",
        gender: "Male",
        bloodType: "B+",
        height: "6'0\" (182 cm)",
        weight: "176 lbs (80 kg)",
        phone: "+91 91234 56789",
        emergency: [
          { name: "Riya Sharma", relation: "Sister", phone: "+91 91234 11111", primary: true }
        ],
        allergies: ["Peanuts"],
        conditions: [{ name: "None", status: "Healthy", since: "-" }]
      }
    }
    if (u?.name === "Priya Patel") {
      return {
        dob: "Aug 22, 1990",
        address: "Ahmedabad, GJ",
        gender: "Female",
        bloodType: "AB-",
        height: "5'5\" (165 cm)",
        weight: "130 lbs (59 kg)",
        phone: "+91 99988 77766",
        emergency: [
          { name: "Raj Patel", relation: "Spouse", phone: "+91 99988 22222", primary: true }
        ],
        allergies: ["None"],
        conditions: [{ name: "Migraine", status: "Occasional", since: "2018" }]
      }
    }
    // Default
    return {
      dob: "Jan 01, 1990",
      address: "Unknown",
      gender: "Other",
      bloodType: "Unknown",
      height: "-",
      weight: "-",
      phone: "-",
      emergency: [],
      allergies: [],
      conditions: []
    }
  }

  const profile = getProfileData(user);

  const personalInfo = {
    name: user?.name || "Guest User",
    email: user?.email || "guest@care.x",
    phone: profile.phone,
    dob: profile.dob,
    address: profile.address,
    gender: profile.gender,
    bloodType: profile.bloodType,
    height: profile.height,
    weight: profile.weight,
  }

  const emergencyContacts = profile.emergency;
  const allergies = profile.allergies;
  const conditions = profile.conditions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Profile</h1>
          <p className="text-muted-foreground">View and manage your health information</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/20 to-chart-2/20" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <Avatar className="w-24 h-24 border-4 border-card">
              <AvatarImage src={undefined} alt={personalInfo.name} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {personalInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">{personalInfo.name}</h2>
                <Badge className="gap-1 bg-success/20 text-success border-success/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground">Patient ID:</span>
                <code className="px-2 py-0.5 bg-secondary rounded text-sm font-mono">{user?.id}</code>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
                <Shield className="w-3 h-3" />
                Blockchain Secured
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: User, label: "Full Name", value: personalInfo.name },
                  { icon: Mail, label: "Email", value: personalInfo.email },
                  { icon: Phone, label: "Phone", value: personalInfo.phone },
                  { icon: Calendar, label: "Date of Birth", value: personalInfo.dob },
                  { icon: User, label: "Gender", value: personalInfo.gender },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-foreground">{personalInfo.address}</p>
                  <Button variant="ghost" size="sm" className="mt-3 text-primary p-0 h-auto">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Preferred Facilities</h4>
                  <div className="space-y-2">
                    {["UCSF Medical Center", "Kaiser Permanente SF"].map((facility, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                      >
                        <span className="text-sm">{facility}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {i === 0 ? "Primary" : "Secondary"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vitals Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-chart-5" />
                  Vital Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-chart-5/10 border border-chart-5/20">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-chart-5" />
                    <span className="text-sm">Blood Type</span>
                  </div>
                  <span className="text-lg font-bold text-chart-5">{personalInfo.bloodType}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="font-semibold">{personalInfo.height}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-semibold">{personalInfo.weight}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergies Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allergies.map((allergy, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="font-medium text-destructive">{allergy}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conditions Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-chart-4" />
                  Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conditions.map((condition, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{condition.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            condition.status === "Managed"
                              ? "border-success text-success"
                              : "border-chart-4 text-chart-4"
                          }
                        >
                          {condition.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Since {condition.since}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-destructive" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${contact.primary ? "bg-primary/5 border-primary/30" : "bg-secondary/50 border-border"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.relation}</p>
                      </div>
                      {contact.primary && <Badge className="bg-primary text-primary-foreground">Primary</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
