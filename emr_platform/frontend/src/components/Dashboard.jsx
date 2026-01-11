
import React, { useState, useEffect } from 'react';
import { Activity, User, Wallet, Search, LogOut } from 'lucide-react';
import api from '../api';
import VitalsChart from './VitalsChart';
import BlockchainFeed from './BlockchainFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [patient, setPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorWallet, setDoctorWallet] = useState(""); // Doctor Identity
  const [vitals, setVitals] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Handle Patient Login/Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/patients/by-wallet/${searchQuery}`);
      setPatient(res.data);
    } catch (err) {
      console.error("Patient fetch error", err);
      setError("Patient not found in EMR Database. Is the Gateway running?");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setPatient(null);
    setVitals([]);
    setDocuments([]);
    setSearchQuery("");
    setDoctorWallet("");
  };

  // 2. Polling: Vitals & Blockchain Data (Only if patient is selected)
  useEffect(() => {
    if (!patient) return;

    const pollVitals = async () => {
      try {
        const res = await api.get(`/patients/${patient.id}/vitals/`);
        const sortedData = res.data.sort((a, b) => a.timestamp - b.timestamp);
        setVitals(sortedData);

        // Fetch Documents (Filtered by Doctor Wallet)
        const docRes = await api.get(`/patients/by-wallet/${patient.wallet_address}/documents?viewer_wallet=${doctorWallet}`);
        setDocuments(docRes.data || []);
      } catch (err) {
        console.error("Vitals/Docs poll error", err);
      }
    };

    pollVitals();
    // Poll every 2 seconds
    const interval = setInterval(pollVitals, 2000);

    return () => clearInterval(interval);
  }, [patient, doctorWallet]);

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen flex flex-col">
      {/* State A: Login / Search Screen */}
      {!patient ? (
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md glass-card border-t-4 border-t-primary shadow-2xl p-6">
            <CardContent className="flex flex-col items-center gap-6 pt-6">
              <div className="p-4 bg-primary/20 rounded-full animate-pulse">
                <Activity className="h-10 w-10 text-primary" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">EMR Access Portal</h2>
                <p className="text-muted-foreground">Authenticate to access patient records.</p>
              </div>

              <form onSubmit={handleSearch} className="w-full space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Your ID (Doctor Wallet)</label>
                  <Input
                    placeholder="0x..."
                    value={doctorWallet}
                    onChange={(e) => setDoctorWallet(e.target.value)}
                    className="font-mono bg-background/50"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Patient Wallet Address</label>
                  <Input
                    placeholder="0x..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="font-mono bg-background/50"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Skeleton className="h-5 w-20" /> : "Connect System"}
                </Button>
              </form>

              <div className="text-xs text-muted-foreground pt-4 border-t w-full text-center">
                Secure Blockchain Link • HIPAA Compliant
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* State B: Dashboard View */
        <>
          {/* Header Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  C.A.R.E. Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground pl-1">
                Connected Ambulatory Record Ecosystem &mdash; Live Monitoring
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500 text-green-500 gap-1 px-3 py-1 bg-green-500/10">
                <Activity className="h-4 w-4 animate-bounce" />
                Live Feed Active
              </Badge>

              <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-1000 delay-150">
            {/* Left Col: Patient Profile & Documents */}
            <div className="md:col-span-3 space-y-6">
              <Card className="glass-card border-t-4 border-t-primary shadow-lg hover:shadow-primary/10 transition-shadow duration-500">
                <CardContent className="flex flex-col items-center text-center pt-8">
                  <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-900 text-primary-foreground text-3xl">
                      <User />
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-2xl font-bold">{patient.name}</h2>
                  <p className="text-muted-foreground mb-6 text-lg">Age: {patient.age} • O+</p>

                  <div className="w-full text-left space-y-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Wallet className="h-3 w-3" /> Linked Wallet
                    </span>
                    <div className="flex items-center gap-2 p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-xs break-all text-muted-foreground">
                      {patient.wallet_address}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shared Documents Card */}
              <Card className="glass-card border-t-4 border-t-blue-500 shadow-md">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Search className="w-4 h-4" /> Shared Files
                  </h3>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {documents.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">No files shared</div>
                    ) : (
                      documents.map((doc, i) => (
                        <div key={i} className="p-3 hover:bg-white/5 transition-colors flex items-center justify-between group">
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.open(`http://localhost:3000/api/files/${doc.file_name}`, '_blank')}>
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Col: Charts */}
            <div className="md:col-span-6">
              <VitalsChart data={vitals.slice(-30)} />
            </div>

            {/* Right Col: Blockchain Feed */}
            <div className="md:col-span-3">
              <BlockchainFeed records={vitals} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;