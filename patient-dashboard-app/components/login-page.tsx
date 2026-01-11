"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { CarexLogo } from "./carex-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Database, Key, CheckCircle2, Fingerprint, Mail, AlertCircle } from "lucide-react"

export function LoginPage() {
  const { signIn, isLoading, error } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)
    try {
      await signIn(email, password)
    } catch (err) {
      // Error handled in context/ui state
    } finally {
      setIsSigningIn(false)
    }
  }

  const features = [
    { icon: Lock, title: "End-to-End Encryption", desc: "Your data is encrypted at rest and in transit" },
    { icon: Database, title: "Immutable Records", desc: "Blockchain-backed audit trail for all access" },
    { icon: Key, title: "Key-Based Access", desc: "Granular control over who sees your data" },
    { icon: Fingerprint, title: "Zero-Knowledge Proofs", desc: "Verify without revealing sensitive info" },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-12">
          <CarexLogo className="mb-12" />

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight text-balance">
            Your Health Data,
            <br />
            <span className="text-primary">Secured by Blockchain</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-12 max-w-md leading-relaxed">
            Experience the future of healthcare data management with cryptographic security, patient-controlled access,
            and complete transparency.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden mb-6">
                <CarexLogo className="justify-center" />
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse-glow">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access your secure patient dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@care.x"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || isSigningIn}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  {isSigningIn ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    "Secure Login"
                  )}
                </Button>
              </form>

              <div className="p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Email: <span className="font-mono text-primary">patient@care.x</span></p>
                <p>Pass: <span className="font-mono text-primary">password123</span></p>
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>SOC 2 Type II</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
