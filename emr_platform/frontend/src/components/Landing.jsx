import React, { useState } from 'react';
import { Shield, Stethoscope, Activity, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-10" />
            <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] top-[-100px] -z-10 animate-pulse" />

            <div className="text-center space-y-4 mb-16 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md mb-4 ring-1 ring-white/20 shadow-2xl">
                    <Activity className="h-10 w-10 text-primary mr-3" />
                    <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
                        Care-X Network
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                    Decentralized Healthcare Trust Layer. <br />
                    <span className="text-sm">Secure your records. Share with consent.</span>
                </p>
            </div>

            <div className="flex justify-center w-full max-w-md z-10">

                {/* Doctor Card */}
                <Card
                    className="group glass-card border-t-4 border-t-emerald-500 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-2xl w-full"
                    onClick={() => navigate('/doctor')}
                >
                    <CardContent className="p-8 flex flex-col items-center text-center h-full justify-between">
                        <div className="bg-emerald-500/10 p-4 rounded-full mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <Stethoscope className="h-12 w-12 text-emerald-400" />
                        </div>
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-bold">Provider Console</h2>
                            <p className="text-muted-foreground text-sm">
                                Monitor patient vitals, verify record integrity, and request data access.
                            </p>
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                            Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

            </div>

            <footer className="absolute bottom-6 text-xs text-muted-foreground/50">
                Secured by Ethereum Blockchain • Powered by IPFS
            </footer>
        </div>
    );
};

export default Landing;
