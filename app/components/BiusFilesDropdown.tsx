'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BiusFilesDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 hover:text-gray-400 transition-colors">
        BIOS Files
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-xl z-50">
          <div className="py-2">
            <Link 
              href="/bios-files" 
              className="block px-4 py-2 hover:bg-gray-900 transition-colors"
            >
              All BIOS Files
            </Link>
            <Link 
              href="https://bios-pw.org" 
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-900 transition-colors"
            >
              Password Generator
            </Link>
            <Link 
              href="/chrome-to-windows" 
              className="block px-4 py-2 hover:bg-gray-900 transition-colors"
            >
              Chrome to Windows
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
