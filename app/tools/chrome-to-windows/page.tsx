'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chrome, Monitor, ArrowRight, Download, CheckCircle, AlertCircle } from 'lucide-react';

export default function ChromeToWindowsPage() {
  const [selectedVersion, setSelectedVersion] = useState('windows11');
  const [showTips, setShowTips] = useState(true);
  const [modelName, setModelName] = useState('');
  const [firmwareUrl, setFirmwareUrl] = useState('');
  const [showDownload, setShowDownload] = useState(false);

  const windowsVersions = [
    {
      id: 'windows11',
      name: 'Windows 11',
      description: 'Latest version with modern design',
      requirements: '4GB RAM, 64GB Storage, UEFI, TPM 2.0'
    },
    {
      id: 'windows10',
      name: 'Windows 10',
      description: 'Stable and widely supported',
      requirements: '2GB RAM, 32GB Storage'
    },
    {
      id: 'windows8',
      name: 'Windows 8.1',
      description: 'Legacy support for older devices',
      requirements: '1GB RAM, 16GB Storage'
    }
  ];

  const migrationSteps = [
    {
      title: 'Backup Your Data',
      description: 'Save all important files from your Chromebook to Google Drive or external storage',
      icon: AlertCircle,
      color: 'text-yellow-600'
    },
    {
      title: 'Check Compatibility',
      description: 'Ensure your Chromebook hardware supports Windows installation',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      title: 'Create Installation Media',
      description: 'Download Windows ISO and create a bootable USB drive (8GB minimum)',
      icon: Download,
      color: 'text-green-600'
    },
    {
      title: 'Disable Write Protection',
      description: 'Remove hardware write-protect screw (varies by model)',
      icon: Monitor,
      color: 'text-purple-600'
    },
    {
      title: 'Install Custom BIOS',
      description: 'Flash MrChromebox firmware to enable Windows boot',
      icon: Chrome,
      color: 'text-orange-600'
    },
    {
      title: 'Install Windows',
      description: 'Boot from USB and follow Windows installation wizard',
      icon: Monitor,
      color: 'text-indigo-600'
    }
  ];

  const generateFirmwareLink = () => {
    if (!modelName.trim()) {
      alert('Please enter your Chromebook model name');
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/firmware/download?model=${modelName.toLowerCase().trim()}`;
    setFirmwareUrl(url);
    setShowDownload(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(firmwareUrl);
      if (!response.ok) {
        alert('Firmware not found for this model. Please check the model name.');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${modelName.toLowerCase().trim()}_windows.bin`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Error downloading firmware. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Chrome className="w-8 h-8 text-blue-500" />
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <Monitor className="w-8 h-8 text-blue-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Chrome OS to Windows Converter</h1>
            </div>
            <Link href="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Warning Banner */}
        {showTips && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-yellow-800 font-bold mb-2">Important Warning</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  Installing Windows on a Chromebook is an advanced procedure that may void your warranty 
                  and could permanently damage your device if done incorrectly. This process involves:
                </p>
                <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1 ml-4">
                  <li>Opening the device and removing hardware components</li>
                  <li>Flashing custom firmware which cannot be easily reversed</li>
                  <li>Complete loss of Chrome OS and manufacturer support</li>
                  <li>Potential hardware compatibility issues</li>
                </ul>
                <p className="text-yellow-700 text-sm mt-2 font-semibold">
                  Proceed only if you understand the risks and have technical expertise.
                </p>
              </div>
              <button 
                onClick={() => setShowTips(false)}
                className="text-yellow-600 hover:text-yellow-800 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* How to Find Model - NEW */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-blue-800 font-bold mb-3">How to Find Your Chromebook Model</h3>
              <div className="space-y-2">
                <p className="text-blue-700 text-sm">
                  On your Chromebook, press and hold these three keys together:
                </p>
                <div className="flex items-center gap-2 my-3">
                  <kbd className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg shadow text-sm font-bold text-gray-700">
                    ESC
                  </kbd>
                  <span className="text-blue-600 font-bold">+</span>
                  <kbd className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg shadow text-sm font-bold text-gray-700">
                    Refresh ⟳
                  </kbd>
                  <span className="text-blue-600 font-bold">+</span>
                  <kbd className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg shadow text-sm font-bold text-gray-700">
                    Power
                  </kbd>
                </div>
                <p className="text-blue-700 text-sm">
                  Your Chromebook will enter recovery mode and display a screen showing your model name (e.g., "butterfly", "peppy", "eve").
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Firmware Download Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Download Windows Firmware</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Chromebook Model Name
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g., butterfly, peppy, eve"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={generateFirmwareLink}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Generate Firmware Link
            </button>

            {showDownload && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download {modelName}_windows.bin
                </button>
                <p className="text-green-700 text-sm mt-2 text-center">
                  Click to download your Windows firmware file
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Windows Version Selection */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Windows Version</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {windowsVersions.map((version) => (
              <div
                key={version.id}
                onClick={() => setSelectedVersion(version.id)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                  selectedVersion === version.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{version.name}</h3>
                  {selectedVersion === version.id && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{version.description}</p>
                <div className="text-xs text-gray-500">
                  <strong>Requirements:</strong> {version.requirements}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Installation Guide</h2>
          <div className="space-y-6">
            {migrationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Step {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Essential Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://mrchromebox.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="font-bold text-blue-600 mb-2">MrChromebox Firmware</h3>
              <p className="text-sm text-gray-600">
                Official custom firmware utility for Chromebooks
              </p>
            </a>
            <a
              href="https://www.microsoft.com/software-download/windows11"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="font-bold text-blue-600 mb-2">Windows 11 ISO Download</h3>
              <p className="text-sm text-gray-600">
                Official Microsoft Windows installation media
              </p>
            </a>
            <a
              href="https://coolstar.org/chromebook/windows-install.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="font-bold text-blue-600 mb-2">Driver Support Database</h3>
              <p className="text-sm text-gray-600">
                Chromebook-specific Windows drivers and utilities
              </p>
            </a>
            <a
              href="https://www.reddit.com/r/chrultrabook"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <h3 className="font-bold text-blue-600 mb-2">Community Support</h3>
              <p className="text-sm text-gray-600">
                r/chrultrabook - Active community for Chromebook modding
              </p>
            </a>
          </div>
        </div>

        {/* Compatibility Check */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Check Your Chromebook</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-3">How to check compatibility:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Press <kbd className="px-2 py-1 bg-white border rounded text-sm">Ctrl</kbd> + 
                  <kbd className="px-2 py-1 bg-white border rounded text-sm mx-1">Alt</kbd> + 
                  <kbd className="px-2 py-1 bg-white border rounded text-sm">T</kbd> to open Chrome OS terminal</li>
              <li>Type <code className="bg-white px-2 py-1 rounded text-sm">hwinfo</code> and press Enter</li>
              <li>Look for your device codename (e.g., "NOCTURNE", "EVE", "ATLAS")</li>
              <li>Search your codename on MrChromebox.tech to verify Windows support</li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Not all Chromebooks support Windows. ARM-based Chromebooks 
                (MediaTek, Qualcomm processors) typically cannot run Windows.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="text-gray-400">
            This tool provides information only. Hisah Tech is not responsible for any damage 
            caused by following these instructions. Always backup your data and proceed at your own risk.
          </p>
        </div>
      </div>
    </div>
  );
}
