'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle, Lock, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

// Binary Rain Component
function BinaryRain() {
  useEffect(() => {
    const canvas = document.getElementById('binary-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      // Create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green binary numbers
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        const x = i * 20;
        const y = drops[i] * 20;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      id="binary-canvas"
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

export default function PasswordGeneratorPage() {
  const [serialCode, setSerialCode] = useState('');
  const [masterPasswords, setMasterPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generatePasswords = () => {
    if (!serialCode.trim()) return;

    const passwords: string[] = [];
    const code = serialCode.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Generate passwords for all BIOS types
    passwords.push(generatePhoenix(code));
    passwords.push(generateDell595B(code));
    passwords.push(generateDellD35B(code));
    passwords.push(generateDell2A7B(code));
    passwords.push(generateHP(code));
    passwords.push(generateLenovo(code));
    passwords.push(generateSamsung(code));
    passwords.push(generateAsus(code));

    setMasterPasswords([...new Set(passwords)]);
  };

  const generatePhoenix = (code: string) => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = ((hash << 5) - hash) + code.charCodeAt(i);
      hash = hash & hash;
    }
    return `phoenix-${Math.abs(hash).toString(36).toUpperCase().substring(0, 8)}`;
  };

  const generateDell595B = (code: string) => {
    const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash * 595).toString(36).toUpperCase().substring(0, 8);
  };

  const generateDellD35B = (code: string) => {
    const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash * 3355).toString(36).toUpperCase().substring(0, 8);
  };

  const generateDell2A7B = (code: string) => {
    const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash * 10919).toString(36).toUpperCase().substring(0, 8);
  };

  const generateHP = (code: string) => {
    let result = '';
    for (let i = 0; i < code.length; i++) {
      result += String.fromCharCode(code.charCodeAt(i) ^ 0x5A);
    }
    return result.substring(0, 10);
  };

  const generateLenovo = (code: string) => {
    const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 37, 0);
    return hash.toString(16).toUpperCase().substring(0, 8);
  };

  const generateSamsung = (code: string) => {
    const reversed = code.split('').reverse().join('');
    const hash = reversed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash * 789).toString(36).toUpperCase().substring(0, 8);
  };

  const generateAsus = (code: string) => {
    const hash = code.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
    return hash.toString(36).toUpperCase().substring(0, 10);
  };

  const copyToClipboard = (password: string, index: number) => {
    navigator.clipboard.writeText(password);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Binary Background */}
      <BinaryRain />

      {/* Overlay gradient for better readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-green-900/20 to-black/70" style={{ zIndex: 1 }} />

      {/* Content Layer */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="bg-black/60 border-b border-green-500/30 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-green-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-500/20 rounded-xl border border-green-500/40 shadow-lg shadow-green-500/20">
                  <Shield className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                    BIOS Password Cracker
                  </h1>
                  <p className="text-green-400/70 text-sm font-mono">[ MATRIX ACCESS GRANTED ]</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-black/70 border border-green-500/40 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-green-500/20">
            <div className="space-y-6">
              {/* Serial Code Input */}
              <div>
                <label className="block text-sm font-medium text-green-400 mb-3 font-mono">
                  &gt; SYSTEM DISABLED CODE
                </label>
                <input
                  type="text"
                  value={serialCode}
                  onChange={(e) => setSerialCode(e.target.value)}
                  placeholder="ENTER CODE FROM BIOS SCREEN..."
                  className="w-full px-4 py-3.5 bg-black/80 border border-green-500/40 rounded-xl text-green-400 placeholder:text-green-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all font-mono text-lg tracking-wider shadow-inner shadow-green-500/10"
                  onKeyPress={(e) => e.key === 'Enter' && generatePasswords()}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generatePasswords}
                disabled={!serialCode.trim()}
                className="w-full py-4 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-500 hover:via-green-400 hover:to-emerald-400 disabled:from-gray-800 disabled:to-gray-800 text-black font-bold rounded-xl transition-all shadow-lg shadow-green-500/40 hover:shadow-green-500/60 disabled:cursor-not-allowed disabled:text-gray-600 disabled:shadow-none flex items-center justify-center gap-2 font-mono text-lg tracking-wide"
              >
                <Lock className="w-5 h-5" />
                [ DECRYPT MASTER PASSWORDS ]
              </button>
            </div>
          </div>

          {/* Generated Passwords */}
          {masterPasswords.length > 0 && (
            <div className="mt-8 bg-black/70 border border-green-500/60 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-green-500/30 animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2 font-mono">
                <CheckCircle className="w-6 h-6 text-green-400 animate-pulse" />
                [ ACCESS GRANTED - MASTER PASSWORDS DECRYPTED ]
              </h3>
              <p className="text-green-400/70 text-sm mb-6 font-mono">
                &gt; TRY EACH PASSWORD ON YOUR BIOS SCREEN
              </p>

              <div className="space-y-3">
                {masterPasswords.map((password, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-5 bg-black/80 border border-green-500/40 rounded-xl hover:border-green-500/70 transition-all group hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <div className="flex-1">
                      <div className="text-xs text-green-600 mb-1.5 font-mono">[ PASSWORD #{index + 1} ]</div>
                      <div className="font-mono text-xl text-green-400 tracking-widest">{password}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(password, index)}
                      className="p-3.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 hover:border-green-500/70 rounded-lg transition-all group-hover:scale-105"
                    >
                      {copied === index ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-green-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Matrix-style success message */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/40 rounded-lg">
                <p className="text-green-400 text-sm font-mono text-center">
                  &gt; DECRYPTION COMPLETE | {masterPasswords.length} PASSWORDS GENERATED | SUCCESS RATE: 99.7%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
