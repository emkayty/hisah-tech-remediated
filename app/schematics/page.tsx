'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Schematic {
  id: number;
  brand: string;
  model: string;
  board_name?: string;
  category: string;
  file_type: string;
  file_size?: string;
  pages?: number;
  description?: string;
  tested: boolean;
  downloads: number;
}

export default function SchematicsPage() {
  const router = useRouter();
  const [allSchematics, setAllSchematics] = useState<Schematic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    loadSchematics();
  }, []);

  async function loadSchematics(filters: { search?: string; brand?: string; category?: string } = {}) {
    setLoading(true);

    try {
      let url = '/api/schematics';
      const params = new URLSearchParams();
      
      if (filters.brand && filters.brand !== 'all') {
        params.append('brand', filters.brand);
      }
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const schematics = await response.json();
      
      setAllSchematics(schematics);
      
      const now = new Date();
      setLastUpdate(now.toLocaleString());

    } catch (error) {
      console.error('Error loading schematics:', error);
      setAllSchematics([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    loadSchematics({ 
      search: searchInput, 
      brand: brandFilter, 
      category: categoryFilter 
    });
  }

  function resetFilters() {
    setSearchInput('');
    setBrandFilter('all');
    setCategoryFilter('all');
    loadSchematics();
  }

  async function downloadSchematic(id: number, brand: string, model: string) {
    try {
      await fetch(`/api/schematics/${id}`, {
        method: 'PATCH'
      });

      alert(`Downloading schematic for ${brand} ${model}...\n\nNote: This is a demo. In production, this would download the actual PDF file.`);

      applyFilters();

    } catch (error) {
      console.error('Error downloading schematic:', error);
      alert('Error downloading schematic. Please try again.');
    }
  }

  const totalFiles = allSchematics.length;
  const totalDownloads = allSchematics.reduce((sum, s) => sum + (s.downloads || 0), 0);

  return (
    <div className="bg-[#e4e4e4] min-h-screen" style={{ fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '12px' }}>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e5799] to-[#7db9e8] text-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Hisah Tech</h1>
                <p className="text-sm text-blue-100">Schematics Database</p>
              </div>
            </div>
            <nav className="flex space-x-6 text-sm">
              <Link href="/" className="hover:text-blue-200 transition">Forum</Link>
              <Link href="/bios-files" className="hover:text-blue-200 transition">BIOS Files</Link>
              <Link href="/schematics" className="text-yellow-300 font-semibold">Schematics</Link>
              <Link href="/blog" className="hover:text-blue-200 transition">Blog</Link>
              <Link href="/about-us" className="hover:text-blue-200 transition">About</Link>
              <Link href="/contact" className="hover:text-blue-200 transition">Contact</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Stats Bar */}
        <div className="bg-white rounded border border-gray-300 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-8">
              <div>
                <span className="font-semibold text-blue-700">Total Schematics:</span>
                <span className="ml-2 font-bold">{totalFiles}</span>
              </div>
              <div>
                <span className="font-semibold text-green-700">Total Downloads:</span>
                <span className="ml-2 font-bold">{totalDownloads}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: <span>{lastUpdate || 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded border border-gray-300 p-4 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Box */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Model, brand, or board name..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
              <select 
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Brands</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Asus">Asus</option>
                <option value="Acer">Acer</option>
                <option value="Apple">Apple</option>
                <option value="Toshiba">Toshiba</option>
                <option value="Sony">Sony</option>
                <option value="Samsung">Samsung</option>
                <option value="MSI">MSI</option>
                <option value="LG">LG</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Canon">Canon</option>
                <option value="Gigabyte">Gigabyte</option>
                <option value="ASRock">ASRock</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Laptop">Laptop</option>
                <option value="Motherboard">Motherboard</option>
                <option value="TV/Monitor">TV/Monitor</option>
                <option value="Gaming Console">Gaming Console</option>
                <option value="Printer">Printer</option>
                <option value="Smartphone">Smartphone</option>
              </select>
            </div>

          </div>
          <div className="mt-3">
            <button 
              onClick={applyFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition text-sm font-semibold"
            >
              Apply Filters
            </button>
            <button 
              onClick={resetFilters}
              className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition text-sm font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Schematics List */}
        <div className="bg-white rounded border border-gray-300 p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Available Schematics</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading schematics...</p>
            </div>
          ) : allSchematics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No schematics found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allSchematics.map(schematic => (
                <div key={schematic.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-base font-bold text-gray-800">{schematic.brand} {schematic.model}</h3>
                        {schematic.tested && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">✓ Tested</span>
                        )}
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">{schematic.category}</span>
                      </div>
                      
                      {schematic.board_name && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Board:</span> {schematic.board_name}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 mb-2">{schematic.description || 'No description available'}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span><span className="font-semibold">Type:</span> {schematic.file_type}</span>
                        {schematic.file_size && (
                          <span><span className="font-semibold">Size:</span> {schematic.file_size}</span>
                        )}
                        {schematic.pages && (
                          <span><span className="font-semibold">Pages:</span> {schematic.pages}</span>
                        )}
                        <span><span className="font-semibold">Downloads:</span> {schematic.downloads || 0}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => downloadSchematic(schematic.id, schematic.brand, schematic.model)}
                      className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-semibold whitespace-nowrap"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 Hisah Tech. All rights reserved.</p>
          <p className="mt-1">Free schematics for hardware repair professionals</p>
        </div>
      </div>

    </div>
  );
}
