'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Calendar, Search } from 'lucide-react';

interface BiosFile {
  id: number;
  brand: string;
  model: string;
  category: string;
  board_name?: string;
  version?: string;
  chip_type?: string;
  file_size?: string;
  description?: string;
  tested: boolean;
  download_count: number;
  upload_date: string;
}

export default function BiosFilesPage() {
  const [allBiosFiles, setAllBiosFiles] = useState<BiosFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    loadBiosFiles({});
  }, []);

  async function loadBiosFiles(params: Record<string, string>) {
    setIsLoading(true);
    
    try {
      let url = '/api/bios';
      const queryParams = new URLSearchParams(params).toString();
      if (queryParams) {
        url += '?' + queryParams;
      }

      const response = await fetch(url);
      const files = await response.json();
      setAllBiosFiles(files);
      updateStats(files);
    } catch (error) {
      console.error('Error loading BIOS files:', error);
      setAllBiosFiles([]);
    } finally {
      setIsLoading(false);
    }
  }

  function updateStats(files: BiosFile[]) {
    const total = files.length;
    const downloads = files.reduce((sum, file) => sum + file.download_count, 0);
    
    setTotalFiles(total);
    setTotalDownloads(downloads);
  }

  async function downloadBios(id: number) {
    try {
      await fetch(`/api/bios/${id}`, {
        method: 'PATCH'
      });
      
      alert('BIOS file download initiated. In a real implementation, this would download the file.\n\nIMPORTANT: Always backup your original BIOS before flashing!');
      
      const params: Record<string, string> = {};
      if (brandFilter) params.brand = brandFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchInput) params.search = searchInput;
      
      loadBiosFiles(params);
    } catch (error) {
      console.error('Error downloading BIOS:', error);
      alert('Error initiating download. Please try again.');
    }
  }

  function searchBios() {
    const params: Record<string, string> = {};
    if (brandFilter) params.brand = brandFilter;
    if (categoryFilter) params.category = categoryFilter;
    if (searchInput) params.search = searchInput;
    
    loadBiosFiles(params);
  }

  function handleSearchKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      searchBios();
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen" style={{ fontFamily: 'Verdana, Arial, Helvetica, sans-serif', fontSize: '11px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Hisah Tech</h1>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">Forum</Link>
              <Link href="/bios-files" className="hover:underline font-bold">BIOS Files</Link>
              <a href="#" className="hover:underline">Register</a>
              <a href="#" className="hover:underline">Login</a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-gray-300 py-2">
        <div className="container mx-auto px-4">
          <div className="text-xs text-gray-600">
            <Link href="/" className="text-blue-600 hover:underline">Hisah Tech</Link>
            <span className="mx-1">›</span>
            <span className="font-semibold">BIOS Files Database</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded shadow-md mb-6 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tested BIOS Files Database</h2>
          <p className="text-gray-600 mb-4">Download tested BIOS files for laptops and motherboards. All files are verified and working.</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search by brand, model, or board name..." 
              className="flex-1 min-w-[300px] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <select 
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Brands</option>
              <option value="acer">Acer</option>
              <option value="asus">Asus</option>
              <option value="dell">Dell</option>
              <option value="hp">HP</option>
              <option value="lenovo">Lenovo</option>
              <option value="msi">MSI</option>
              <option value="gigabyte">Gigabyte</option>
              <option value="asrock">ASRock</option>
              <option value="apple">Apple</option>
              <option value="sony">Sony</option>
              <option value="toshiba">Toshiba</option>
              <option value="fujitsu">Fujitsu</option>
              <option value="samsung">Samsung</option>
              <option value="microsoft">Microsoft</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="laptop">Laptop</option>
              <option value="motherboard">Motherboard</option>
            </select>
            <button 
              onClick={searchBios}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Search
            </button>
          </div>

          <div className="flex gap-4 text-xs text-gray-600">
            <div>
              <strong>{totalFiles}</strong> BIOS Files Available
            </div>
            <div>
              <strong>{totalDownloads.toLocaleString()}</strong> Total Downloads
            </div>
          </div>
        </div>

        {/* BIOS Files List */}
        {isLoading ? (
          <div className="bg-white rounded shadow-md p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : allBiosFiles.length === 0 ? (
          <div className="bg-white rounded shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p className="text-gray-600 font-semibold">No BIOS files found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allBiosFiles.map((file) => (
              <div key={file.id} className="bg-white rounded shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">{file.brand}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{file.category}</span>
                      {file.tested && <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">✓ Tested</span>}
                    </div>
                    <h3 className="font-bold text-base text-gray-800 mb-1">{file.model}</h3>
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      {file.board_name && <div><strong>Board:</strong> {file.board_name}</div>}
                      {file.version && <div><strong>Version:</strong> {file.version}</div>}
                      {file.chip_type && <div><strong>Chip:</strong> {file.chip_type}</div>}
                      {file.file_size && <div><strong>Size:</strong> {file.file_size}</div>}
                    </div>
                    <p className="text-xs text-gray-700 mb-3">{file.description || 'No description available.'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div>
                        <Download className="w-4 h-4 inline mr-1" />
                        {file.download_count} downloads
                      </div>
                      <div>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(file.upload_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button 
                      onClick={() => downloadBios(file.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-xs whitespace-nowrap"
                    >
                      Download BIOS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-xs">
          <p className="mb-2">Hisah Tech - BIOS Files Database</p>
          <p className="text-gray-500">All BIOS files are tested and verified. Use at your own risk. Always backup your original BIOS.</p>
          <p className="text-gray-600 mt-4">© 2024 Hisah Tech. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
