import React, { useState } from 'react';
import { ShieldCheck, Database, Clock, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const BlockchainFeed = ({ records }) => {
  const anchoredRecords = records?.filter(r => r.ipfs_hash) || [];
  const [verificationResults, setVerificationResults] = useState({}); // { id: 'loading' | 'valid' | 'invalid' }

  const verifyRecord = async (record) => {
    // Set Loading
    setVerificationResults(prev => ({ ...prev, [record.id]: 'loading' }));

    // Delay for dramatic effect (Show off the calculation time)
    await new Promise(r => setTimeout(r, 700));

    try {
      // 1. Reconstruct Payload (MUST MATCH PYTHON LOGIC)
      // Logic: f"{bpm}-{timestamp}"
      const payload = `${record.bpm}-${record.timestamp}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);

      // 2. Calculate Hash
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // 3. Compare
      // Note: Python logic might produce different hash if types mismatch (e.g. float vs int timestamp)
      // In main app, we ensure timestamp is Int.
      const isValid = hashHex === record.ipfs_hash;

      if (!isValid) {
        console.warn("Mismatch!", { payload, calculated: hashHex, stored: record.ipfs_hash });
      }

      setVerificationResults(prev => ({ ...prev, [record.id]: isValid ? 'valid' : 'invalid' }));

    } catch (e) {
      console.error(e);
      setVerificationResults(prev => ({ ...prev, [record.id]: 'invalid' }));
    }
  };

  return (
    <Card className="h-full flex flex-col glass-card">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          Immutable Audit Trail
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pr-2 pt-4 custom-scrollbar">
        {anchoredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-50">
            <Database className="h-8 w-8 mb-2" />
            <p className="text-sm">No records anchored yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {anchoredRecords.slice().reverse().map((record) => {
              const status = verificationResults[record.id];

              return (
                <li key={record.id} className="bg-black/20 rounded-lg p-3 border border-white/5 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <Lock className="h-3 w-3 text-primary" />
                      Block #{record.id}
                    </div>
                    {record.is_critical && (
                      <Badge variant="destructive" className="h-5 text-[10px] px-1 animate-pulse">CRITICAL</Badge>
                    )}
                  </div>

                  <div className="bg-background/20 rounded border border-white/5 p-2 font-mono text-[10px] text-muted-foreground break-all mb-3 relative overflow-hidden">
                    <div className="flex justify-between mb-1">
                      <span className="text-primary font-bold">HASH:</span>
                    </div>
                    {record.ipfs_hash}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(record.timestamp * 1000).toLocaleTimeString()}
                    </div>

                    {/* Verification Button / Status */}
                    <div>
                      {!status && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] border-primary/20 hover:bg-primary/20 hover:text-primary"
                          onClick={() => verifyRecord(record)}
                        >
                          Verify Integrity
                        </Button>
                      )}
                      {status === 'loading' && (
                        <div className="flex items-center gap-1 text-[10px] text-yellow-500">
                          <Loader2 className="h-3 w-3 animate-spin" /> Verifying...
                        </div>
                      )}
                      {status === 'valid' && (
                        <Badge variant="outline" className="text-green-500 border-green-500 flex gap-1 items-center bg-green-500/10">
                          <CheckCircle className="h-3 w-3" /> MATH MATCH
                        </Badge>
                      )}
                      {status === 'invalid' && (
                        <Badge variant="destructive" className="flex gap-1 items-center">
                          <XCircle className="h-3 w-3" /> TAMPER DETECTED
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainFeed;