import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VitalsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
        <Card className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Waiting for vitals stream...</p>
        </Card>
    )
  }

  const latest = data[data.length - 1];
  const isCritical = latest.bpm > 140;

  return (
    <Card className="h-[400px] relative overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Live Heart Rate Monitor
        </CardTitle>
        <div className="flex gap-4">
             <div className={`text-2xl font-bold ${isCritical ? "text-red-600" : "text-blue-500"}`}>
                {latest.bpm} <span className="text-sm font-normal text-muted-foreground">BPM</span>
             </div>
             <div className="text-2xl font-bold text-purple-600">
                {latest.spo2}% <span className="text-sm font-normal text-muted-foreground">SpO2</span>
             </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                domain={['auto', 'auto']} 
                tickFormatter={(unix) => new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })} 
                type="number"
              />
              <YAxis domain={[40, 200]} label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                labelFormatter={(unix) => new Date(unix * 1000).toLocaleString()} 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <ReferenceLine y={140} label="CRITICAL" stroke="red" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="bpm" 
                stroke={isCritical ? "#dc2626" : "#2563eb"} 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={false} 
              />
              <Line 
                type="monotone" 
                dataKey="spo2" 
                stroke="#9333ea" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
      </CardContent>
      
      {isCritical && (
          <div className="absolute inset-0 bg-red-500/10 pointer-events-none animate-pulse" />
      )}
    </Card>
  );
};

export default VitalsChart;