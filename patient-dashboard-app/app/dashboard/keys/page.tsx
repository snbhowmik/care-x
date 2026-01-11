"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Key, Shield, AlertTriangle, CheckCircle2 } from "lucide-react"
import { ethers } from "ethers"
import HealthRecordArtifact from "@/config/HealthRecord.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const GANACHE_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || "http://127.0.0.1:7545";

export default function KeysPage() {
  const { user } = useAuth()
  const [accessList, setAccessList] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    if (user) fetchAccessList();
  }, [user])

  const fetchAccessList = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(GANACHE_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, HealthRecordArtifact.abi, provider);

      // Query "DataShared" events for this patient
      const sharedFilter = contract.filters.DataShared(user?.walletAddress, null);
      const sharedLogs = await contract.queryFilter(sharedFilter);

      // Query "DataUnshared" events
      const unsharedFilter = contract.filters.DataUnshared(user?.walletAddress, null);
      const unsharedLogs = await contract.queryFilter(unsharedFilter);

      // Map to track status: { doctorAddress: { blockNumber, isShared } }
      const accessMap: Record<string, boolean> = {};

      // Combine logs and sort by block number + log index
      const allLogs = [
        ...sharedLogs.map(l => ({ ...l, type: 'shared' })),
        ...unsharedLogs.map(l => ({ ...l, type: 'unshared' }))
      ].sort((a, b) => {
        if (a.blockNumber !== b.blockNumber) return a.blockNumber - b.blockNumber;
        return a.index - b.index;
      });

      // Replay history
      for (const log of allLogs) {
        // @ts-ignore
        const doctor = log.args[1]; // 2nd arg is doctor
        if (log.type === 'shared') {
          accessMap[doctor] = true;
        } else {
          delete accessMap[doctor];
        }
      }

      setAccessList(Object.keys(accessMap));
    } catch (e) {
      console.error("Fetch Access Error:", e);
    }
  }

  const handleRevoke = async (doctorAddress: string) => {
    if (!user) return;
    setLoading(true);
    setStatus("Revoking access on blockchain...");

    try {
      const provider = new ethers.JsonRpcProvider(GANACHE_URL);
      const wallet = new ethers.Wallet(user.privateKey, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, HealthRecordArtifact.abi, wallet);

      const tx = await contract.revokeDataAccess(doctorAddress);
      await tx.wait();

      setStatus("Access Revoked Successfully!");
      setAccessList(prev => prev.filter(a => a !== doctorAddress));

      // Call backend to clear granular permissions
      await fetch('/api/revoke', {
        method: 'POST',
        body: JSON.stringify({ doctorAddress })
      });

    } catch (e: any) {
      console.error(e);
      setStatus("Error: " + (e.reason || e.message));
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Access Keys</h1>
          <p className="text-muted-foreground">Manage who can view your health data.</p>
        </div>
        <Button onClick={fetchAccessList} variant="outline" size="sm">Refresh List</Button>
      </div>

      {status && (
        <div className="p-4 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Shield className="w-4 h-4" />}
          {status}
        </div>
      )}

      {/* Identity Flow Visualization */}
      <Card className="bg-gradient-to-br from-card to-secondary/20 border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5 mask-image-gradient" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Parametric Identity Generation
          </CardTitle>
          <CardDescription>
            How your secure blockchain identity is derived.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-4">
            {/* Step 1: Master Key */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-transform group-hover:scale-110">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <div className="font-bold">Master Key</div>
              <div className="text-xs text-muted-foreground font-mono bg-black/20 px-2 py-1 rounded mt-1">
                {user ? 'Seed Secret' : 'Locked'}
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="h-0.5 w-full bg-gradient-to-r from-primary/50 to-blue-500/50 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[10px] text-muted-foreground whitespace-nowrap border rounded-full">
                  Derived via Gateway
                </div>
              </div>
            </div>

            {/* Step 2: Proxy ID */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-110">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <div className="font-bold text-blue-400">Hospital Proxy ID</div>
              <div className="text-xs text-muted-foreground font-mono bg-black/20 px-2 py-1 rounded mt-1">
                HAP-ID-v1
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="h-0.5 w-full bg-gradient-to-r from-blue-500/50 to-green-500/50 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[10px] text-muted-foreground whitespace-nowrap border rounded-full">
                  Generates
                </div>
              </div>
            </div>

            {/* Step 3: Wallet */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-110">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div className="font-bold text-green-400">Block Wallet</div>
              <div className="text-xs text-muted-foreground font-mono bg-black/20 px-2 py-1 rounded mt-1 max-w-[120px] truncate">
                {user?.walletAddress || '0x...'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {accessList.length === 0 ? (
        <Card className="bg-secondary/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <Key className="w-12 h-12 mb-4 opacity-20" />
            <p>No active access keys found.</p>
            <p className="text-sm">Your data is currently private.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {accessList.map((addr) => (
            <Card key={addr} className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-medium">{addr}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Active Key</Badge>
                      <span>Authorized via Blockchain</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => handleRevoke(addr)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-orange-500/5 border-orange-500/20 mt-8">
        <CardHeader>
          <CardTitle className="text-orange-500 text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Revocation Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Revoking access sends a transaction to the blockchain that permanently invalidates the recipient's ability to decrypt your future records.
            Historical data they have already downloaded may still be accessible to them locally, but they will lose access to your live Health Vault.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
