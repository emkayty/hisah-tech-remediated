'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Laptop, Info } from 'lucide-react';

export default function ChromeToWindowsPage() {
  const [model, setModel] = useState('');
  const [firmwareUrl, setFirmwareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateLink = () => {
    if (!model.trim()) {
      setError('Please enter a Chromebook model');
      return;
    }

    setError('');
    const url = `/api/firmware/download?model=${encodeURIComponent(model.trim().toLowerCase())}`;
    setFirmwareUrl(url);
  };

  const handleDownload = async () => {
    if (!firmwareUrl) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(firmwareUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model.trim().toLowerCase()}_windows.bin`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerateLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Laptop className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hisah Tech
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Chrome to Windows Firmware
          </h1>
          <p className="text-lg text-gray-600">
            Download Windows BIOS firmware for your Chromebook
          </p>
        </div>

        {/* Info Box - How to find model */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How to find your Chromebook model:</h3>
              <p className="text-blue-800 mb-2">
                Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-sm font-mono">ESC</kbd> + <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-sm font-mono">Refresh ⟳</kbd> + <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-sm font-mono">Power</kbd> together
              </p>
              <p className="text-blue-700 text-sm">
                This will show your Chromebook's recovery screen with the model name (e.g., "butterfly", "peppy", etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Download Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Model Input */}
          <div className="mb-6">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Chromebook Model
            </label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., butterfly, peppy, link"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter your Chromebook model name (lowercase, e.g., "butterfly")
            </p>
          </div>

          {/* Generate Link Button */}
          <button
            onClick={handleGenerateLink}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-4"
          >
            Generate Download Link
          </button>

          {/* Firmware URL Display */}
          {firmwareUrl && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-medium text-gray-700 mb-2">Firmware URL:</p>
              <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border border-gray-200">
                {window.location.origin}{firmwareUrl}
              </p>
            </div>
          )}

          {/* Download Button */}
          {firmwareUrl && (
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <Download className="w-5 h-5" />
              <span>{isLoading ? 'Downloading...' : `Download ${model}_windows.bin`}</span>
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation Guide</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Enter your Chromebook model name and generate the download link</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Download the firmware .bin file to your Chromebook</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Enable Developer Mode on your Chromebook</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Flash the firmware using the appropriate flashing tool</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <span>Install Windows on your Chromebook</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
