'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, RefreshCw, Check, Shield, Key, Lock } from 'lucide-react';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('Please select at least one option');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (password && password !== 'Please select at least one option') {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPasswordStrength = () => {
    if (!password || password === 'Please select at least one option') return '';
    
    let strength = 0;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-100' };
    if (strength <= 4) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Strong', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Password Generator</h1>
            </div>
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Password Display */}
          <div className="mb-8">
            <div className="relative">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 pr-24 min-h-[60px] flex items-center font-mono text-lg break-all">
                {password || 'Click Generate to create a password'}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!password || password === 'Please select at least one option'}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={generatePassword}
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  title="Generate new password"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Strength Indicator */}
            {strength && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">Strength:</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded ${strength.bg} ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
            )}

            {copied && (
              <div className="mt-3 text-sm text-green-600 font-medium">
                ✓ Copied to clipboard!
              </div>
            )}
          </div>

          {/* Length Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-medium">Password Length</label>
              <span className="text-blue-600 font-bold text-lg">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-700 font-medium">Include Uppercase Letters (A-Z)</span>
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-700 font-medium">Include Lowercase Letters (a-z)</span>
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-700 font-medium">Include Numbers (0-9)</span>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-700 font-medium">Include Symbols (!@#$%^&*)</span>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
          >
            <Key className="w-6 h-6" />
            Generate Password
          </button>

          {/* Security Tips */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-2">Security Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Use unique passwords for each account</li>
                  <li>Longer passwords (16+ characters) are stronger</li>
                  <li>Include a mix of character types</li>
                  <li>Never share your passwords</li>
                  <li>Use a password manager to store them securely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
