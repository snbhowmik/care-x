

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox" // Added
import { Shield, Key, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import HealthRecordArtifact from "@/config/HealthRecord.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const GANACHE_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || "http://127.0.0.1:7545";

export default function ShareAccessPage() {
  const { user } = useAuth()
  const [doctorAddress, setDoctorAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)
  const [files, setFiles] = useState<any[]>([])
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])

  useEffect(() => {
    if (user) {
      fetch('/api/records', {
        method: 'POST', body: JSON.stringify({ walletAddress: user.walletAddress })
      })
        .then(res => res.json())
        .then(data => {
          const recs = data.records || [];
          setFiles(recs);
          // Default select all
          setSelectedFiles(recs.map((f: any) => f.id));
        })
    }
  }, [user])

  const toggleFile = (id: number) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleGrant = async () => {
    if (!user) return;
    if (!doctorAddress.startsWith("0x") || doctorAddress.length !== 42) {
      setStatus({ type: "error", msg: "Invalid Ethereum Address" });
      return;
    }
    if (selectedFiles.length === 0) {
      setStatus({ type: "error", msg: "Please select at least one file to share." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // 1. Blockchain Permission (Global Relationship)
      const provider = new ethers.JsonRpcProvider(GANACHE_URL);
      const wallet = new ethers.Wallet(user.privateKey, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, HealthRecordArtifact.abi, wallet);

      // Check if already granted? Optimistically just grant again or catch error
      try {
        const tx = await contract.grantDataAccess(doctorAddress);
        await tx.wait();
      } catch (e) {
        console.log("Blockchain Grant may have failed or already exists:", e);
        // Continue to API share
      }

      // 2. Off-Chain Granular Permission (Database)
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_wallet: doctorAddress,
          doc_ids: selectedFiles
        })
      });

      if (!res.ok) throw new Error("Failed to sync permissions with database");

      setStatus({ type: "success", msg: `Successfully shared ${selectedFiles.length} files with ${doctorAddress}` });
      setDoctorAddress("");
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", msg: err.message || "Transaction failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Share Access</h1>
          <p className="text-muted-foreground">Authorize a doctor to view specific medical records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: ACTION */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Grant Permission
            </CardTitle>
            <CardDescription>
              Enter the wallet address of the doctor or hospital.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Doctor's Wallet Address</Label>
              <Input
                placeholder="0x..."
                className="font-mono bg-secondary/50"
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
              />
            </div>

            {status && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {status.msg}
              </div>
            )}

            <Button className="w-full bg-primary" onClick={handleGrant} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : `Share ${selectedFiles.length} Selected Files`}
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT: PREVIEW */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Select Documents
            </CardTitle>
            <CardDescription>
              Choose which files to reveal to the recipient.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">No medical files found in your vault.</div>
              ) : (
                files.map((file, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${selectedFiles.includes(file.id) ? 'bg-primary/5 border-primary/30' : 'bg-secondary/20 border-border'}`}>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => toggleFile(file.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{file.file_name}</p>
                        <p className="text-xs text-muted-foreground">{file.description}</p>
                      </div>
                    </div>
                    {selectedFiles.includes(file.id) &&
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                        Selected
                      </Badge>
                    }
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">Granular Control</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only the selected files will be decrypted for the recipient. You can manage these permissions at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
