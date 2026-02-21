/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Settings, 
  Activity, 
  Lock, 
  Power, 
  ChevronRight, 
  MapPin,
  RefreshCw,
  Info,
  Clock,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  Tooltip 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface Server {
  id: string;
  name: string;
  country: string;
  flag: string;
  latency: number;
  load: number;
}

interface TrafficData {
  time: string;
  down: number;
  up: number;
}

const SERVERS: Server[] = [
  { id: 'us-east', name: 'New York', country: 'United States', flag: '🇺🇸', latency: 24, load: 45 },
  { id: 'uk-lon', name: 'London', country: 'United Kingdom', flag: '🇬🇧', latency: 82, load: 62 },
  { id: 'jp-tok', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', latency: 145, load: 38 },
  { id: 'de-fra', name: 'Frankfurt', country: 'Germany', flag: '🇩🇪', latency: 95, load: 78 },
  { id: 'sg-sin', name: 'Singapore', country: 'Singapore', flag: '🇸🇬', latency: 180, load: 25 },
  { id: 'au-syd', name: 'Sydney', country: 'Australia', flag: '🇦🇺', latency: 210, load: 15 },
];

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>(SERVERS[0]);
  const [traffic, setTraffic] = useState<TrafficData[]>([]);
  const [ipInfo, setIpInfo] = useState<{ ip: string; city: string; country: string } | null>(null);
  const [connectionTime, setConnectionTime] = useState(0);

  // Simulate traffic data
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: TrafficData = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        down: isConnected ? Math.floor(Math.random() * 50) + 10 : 0,
        up: isConnected ? Math.floor(Math.random() * 15) + 2 : 0,
      };
      setTraffic(prev => [...prev.slice(-19), newData]);
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Timer
  useEffect(() => {
    let interval: number;
    if (isConnected) {
      interval = window.setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    } else {
      setConnectionTime(0);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Fetch IP info (Real API)
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setIpInfo({
          ip: data.ip,
          city: data.city,
          country: data.country_name
        });
      })
      .catch(() => {
        setIpInfo({ ip: '192.168.1.1', city: 'Unknown', country: 'Unknown' });
      });
  }, []);

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight">NEXUS<span className="text-emerald-500">VPN</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-zinc-400" />
          </button>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-widest">
            <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")} />
            {isConnected ? 'Protected' : 'Unprotected'}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Main Controls */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Connection Card */}
          <section className="bg-[#161618] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center py-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleConnection}
                disabled={isConnecting}
                className={cn(
                  "w-48 h-48 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-500 relative",
                  isConnected 
                    ? "bg-emerald-500/10 border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]" 
                    : "bg-zinc-800/50 border-4 border-zinc-700 shadow-xl",
                  isConnecting && "animate-pulse border-blue-500"
                )}
              >
                <Power className={cn("w-12 h-12 transition-colors duration-500", isConnected ? "text-emerald-500" : "text-zinc-500")} />
                <span className={cn("text-sm font-bold uppercase tracking-widest", isConnected ? "text-emerald-500" : "text-zinc-500")}>
                  {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
                </span>
                
                {/* Pulse rings for active connection */}
                {isConnected && (
                  <>
                    <motion.div 
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-emerald-500"
                    />
                    <motion.div 
                      initial={{ scale: 1, opacity: 0.3 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 rounded-full border border-emerald-500"
                    />
                  </>
                )}
              </motion.button>

              <div className="mt-10 grid grid-cols-3 gap-12 w-full max-w-md">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Duration</p>
                  <p className="font-mono text-xl font-medium">{formatTime(connectionTime)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Protocol</p>
                  <p className="font-mono text-xl font-medium">WireGuard</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Encryption</p>
                  <p className="font-mono text-xl font-medium">AES-256</p>
                </div>
              </div>
            </div>
          </section>

          {/* Traffic Monitoring */}
          <section className="bg-[#161618] rounded-3xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Real-time Traffic</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-400">Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-zinc-400">Upload</span>
                </div>
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic}>
                  <defs>
                    <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="down" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorDown)" 
                    isAnimationActive={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="up" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorUp)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <ArrowDown className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Download</p>
                    <p className="text-lg font-mono font-bold">{isConnected ? (traffic[traffic.length-1]?.down || 0).toFixed(1) : '0.0'} <span className="text-xs font-normal text-zinc-500">Mbps</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <ArrowUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Upload</p>
                    <p className="text-lg font-mono font-bold">{isConnected ? (traffic[traffic.length-1]?.up || 0).toFixed(1) : '0.0'} <span className="text-xs font-normal text-zinc-500">Mbps</span></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Server List & Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* IP Info Card */}
          <section className="bg-[#161618] rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Network Identity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Public IP</span>
                <span className="text-sm font-mono text-zinc-200">{ipInfo?.ip || 'Detecting...'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Location</span>
                <span className="text-sm text-zinc-200">{ipInfo ? `${ipInfo.city}, ${ipInfo.country}` : 'Detecting...'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Status</span>
                <span className={cn("text-xs font-bold px-2 py-1 rounded-md uppercase tracking-tighter", isConnected ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                  {isConnected ? 'Encrypted' : 'Exposed'}
                </span>
              </div>
            </div>
          </section>

          {/* Server Selection */}
          <section className="bg-[#161618] rounded-3xl p-6 border border-white/5 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Global Servers</h3>
              </div>
              <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {SERVERS.map((server) => (
                <button
                  key={server.id}
                  onClick={() => setSelectedServer(server)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-2xl transition-all border",
                    selectedServer.id === server.id 
                      ? "bg-emerald-500/10 border-emerald-500/30" 
                      : "bg-white/5 border-transparent hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{server.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{server.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{server.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-mono", server.latency < 50 ? "text-emerald-500" : "text-zinc-400")}>
                      {server.latency}ms
                    </p>
                    <div className="w-12 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", server.load > 70 ? "bg-red-500" : "bg-emerald-500")} 
                        style={{ width: `${server.load}%` }} 
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Smart Connect</p>
                    <p className="text-xs text-zinc-400">Automatically pick the fastest server</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0A0A0B]/80 backdrop-blur-md border-t border-white/5 px-6 py-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3" />
            <span>Kill Switch: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            <span>DNS Leak Protection: ON</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
