"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { HealthTimeline } from "@/components/dashboard/health-timeline"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { KeyHierarchyPreview } from "@/components/dashboard/key-hierarchy-preview"
import { RecentAccessLogs } from "@/components/dashboard/recent-access-logs"
import { TrustScore } from "@/components/dashboard/trust-score"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Share2, AlertCircle, CheckCircle2 } from "lucide-react"
import { ethers } from "ethers"
import HealthRecordArtifact from "@/config/HealthRecord.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const GANACHE_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || "http://127.0.0.1:7545";

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()

    const [records, setRecords] = useState<any[]>([])
    const [dbRecords, setDbRecords] = useState<any[]>([])
    const [accessList, setAccessList] = useState<string[]>([])
    const [doctorAddress, setDoctorAddress] = useState("")
    const [loading, setLoading] = useState(false) // Transaction/Data loading
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/")
        } else if (user) {
            fetchData()
        }
    }, [user, authLoading])

    const getContract = () => {
        if (!user) throw new Error("No user");
        const provider = new ethers.JsonRpcProvider(GANACHE_URL);
        const wallet = new ethers.Wallet(user.privateKey, provider);
        return new ethers.Contract(CONTRACT_ADDRESS, HealthRecordArtifact.abi, wallet);
    }

    const fetchData = async () => {
        try {
            const contract = getContract();
            const myAddress = user!.walletAddress;

            // 1. Fetch Records from Blockchain
            const result = await contract.getRecords(myAddress);
            const parsedRecords = result.map((r: any) => ({
                ipfsHash: r.ipfsHash,
                timestamp: Number(r.timestamp),
                isCritical: r.isCritical,
                deviceId: r.deviceId
            })).reverse();
            setRecords(parsedRecords);

            // 2. Fetch Files from DB (API)
            const dbRes = await fetch('/api/records', {
                method: 'POST',
                body: JSON.stringify({ walletAddress: myAddress })
            });
            if (dbRes.ok) {
                const dbJson = await dbRes.json();
                setDbRecords(dbJson.records || []);
            }

            // 3. Fetch Access Logs (Reconstruct State)
            const grantedFilter = contract.filters.DataShared(myAddress, null);
            const grantedLogs = await contract.queryFilter(grantedFilter);
            const revokedFilter = contract.filters.DataUnshared(myAddress, null);
            const revokedLogs = await contract.queryFilter(revokedFilter);

            const accessMap = new Map<string, { block: number, active: boolean }>();

            grantedLogs.forEach((log: any) => {
                const doctor = log.args[1];
                const current = accessMap.get(doctor) || { block: 0, active: false };
                if (log.blockNumber >= current.block) {
                    accessMap.set(doctor, { block: log.blockNumber, active: true });
                }
            });

            revokedLogs.forEach((log: any) => {
                const doctor = log.args[1];
                const current = accessMap.get(doctor) || { block: 0, active: false };
                if (log.blockNumber >= current.block) {
                    accessMap.set(doctor, { block: log.blockNumber, active: false });
                }
            });

            const activeList = Array.from(accessMap.entries())
                .filter(([_, val]) => val.active)
                .map(([addr, _]) => addr);
            setAccessList(activeList);

        } catch (err) {
            console.error(err);
            // Silent fail or minimal error
        }
    }

    const handleGrantAccess = async () => {
        if (!user) return;
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const contract = getContract();
            const tx = await contract.grantDataAccess(doctorAddress);
            await tx.wait();
            setSuccess("Access granted successfully to " + doctorAddress);
            setDoctorAddress("");
            fetchData();
        } catch (err: any) {
            setError(err.message || "Failed to grant access");
        } finally {
            setLoading(false);
        }
    }

    const handleRevokeAccess = async (target: string) => {
        if (!user) return;
        setError(null);
        setSuccess(null);
        // Don't main loader for revoke usually, but here yes for safety
        if (!confirm("Revoke access for " + target + "?")) return;

        try {
            const contract = getContract();
            const tx = await contract.revokeDataAccess(target);
            await tx.wait();
            fetchData(); // Refresh list
        } catch (err: any) {
            alert("Failed to revoke: " + err.message);
        }
    }

    if (authLoading || !user) {
        return <div className="p-10 text-center">Loading Secure Dashboard...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back {user.name}, your health data is secure.</p>
                </div>
            </div>

            <StatsCards totalRecords={records.length + dbRecords.length} activeKeys={accessList.length} />

            {/* Grant Access Card - Quick Action Replacement */}
            <Card className="bg-card/50 border-primary/20">
                <CardHeader><CardTitle className="text-sm uppercase text-muted-foreground">Quick Action: Grant Access</CardTitle></CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="Doctor Wallet Address (0x...)"
                        value={doctorAddress}
                        onChange={(e) => setDoctorAddress(e.target.value)}
                        className="font-mono w-full"
                    />
                    <Button onClick={handleGrantAccess} disabled={loading} className="w-full sm:w-auto shrink-0 bg-primary">
                        {loading ? "Processing..." : <><Share2 className="w-4 h-4 mr-2" /> Grant Access</>}
                    </Button>
                </CardContent>
                {(error || success) && (
                    <div className="px-6 pb-4">
                        {error && <div className="text-red-400 text-sm flex items-center"><AlertCircle className="w-4 h-4 mr-2" />{error}</div>}
                        {success && <div className="text-green-400 text-sm flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" />{success}</div>}
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ActivityChart />
                </div>
                <div>
                    <TrustScore recordCount={records.length} keyCount={accessList.length} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HealthTimeline records={records} dbRecords={dbRecords} />
                <KeyHierarchyPreview doctorCount={accessList.length} />
            </div>

            <RecentAccessLogs accessList={accessList} onRevoke={handleRevokeAccess} />
        </div>
    )
}
