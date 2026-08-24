'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, FileText } from 'lucide-react';

interface Guide {
  id: number;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  device_type: string;
  estimated_time: string;
  tools_required: string;
  views: number;
  helpful_votes: number;
  author: string;
}

export default function RepairGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalGuides, setTotalGuides] = useState('-');
  const [totalViews, setTotalViews] = useState('-');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    loadGuides();
  }, []);

  async function loadGuides() {
    try {
      const res = await fetch('/api/repair-guides');
      const data = await res.json();
      setGuides(data);
      updateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load guides:', error);
      setLoading(false);
    }
  }

  function updateStats(guidesData: Guide[]) {
    setTotalGuides(guidesData.length.toString());
    const views = guidesData.reduce((sum, guide) => sum + guide.views, 0);
    setTotalViews(views.toLocaleString());
  }

  async function searchGuides() {
    let url = '/api/repair-guides';
    const params = new URLSearchParams();
    
    if (filterCategory !== 'all') params.append('category', filterCategory);
    if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
    if (searchInput) params.append('search', searchInput);
    
    if (params.toString()) url += '?' + params.toString();
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      setGuides(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      searchGuides();
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <style jsx global>{`
        body {
            font-family: Verdana, Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .forum-header {
            background: linear-gradient(180deg, #4a90e2 0%, #2c5aa0 100%);
            border-bottom: 3px solid #1e3a5f;
        }
        .guide-card {
            background: white;
            border: 1px solid #ddd;
            transition: all 0.2s;
        }
        .guide-card:hover {
            border-color: #4a90e2;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .difficulty-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-weight: 600;
        }
        .difficulty-beginner { background: #10b981; color: white; }
        .difficulty-intermediate { background: #f59e0b; color: white; }
        .difficulty-advanced { background: #ef4444; color: white; }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="forum-header text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <h1 className="text-2xl font-bold">Hisah Tech</h1>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/bios-files" className="hover:underline">BIOS Files</Link>
              <Link href="/schematics" className="hover:underline">Schematics</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-sm text-gray-600">
          <Link href="/" className="text-blue-600 hover:underline">Hisah Tech</Link> &raquo; 
          <span> Repair Guides & Tutorials</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 mb-6 border border-gray-300 rounded">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Repair Guides & Tutorials</h2>
          <p className="text-gray-600 mb-4">Step-by-step guides for diagnosing and repairing common hardware issues. Written by experienced technicians.</p>
          
          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200">
              <span className="font-bold text-blue-700">Total Guides:</span>
              <span className="ml-2 font-bold">{totalGuides}</span>
            </div>
            <div className="bg-purple-50 px-4 py-2 rounded border border-purple-200">
              <span className="font-bold text-purple-700">Total Views:</span>
              <span className="ml-2 font-bold">{totalViews}</span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 mb-6 border border-gray-300 rounded">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Capacitor Basics">Capacitor Basics</option>
              <option value="Motherboard Repair">Motherboard Repair</option>
              <option value="Power Supply Repair">Power Supply Repair</option>
              <option value="Monitor Repair">Monitor Repair</option>
              <option value="GPU Repair">GPU Repair</option>
              <option value="Console Repair">Console Repair</option>
              <option value="Testing & Diagnosis">Testing & Diagnosis</option>
              <option value="Soldering Skills">Soldering Skills</option>
            </select>
            
            <select 
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search guides..." 
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            
            <button 
              onClick={searchGuides}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Guides List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading guides...</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No guides found.</div>
          ) : (
            guides.map((guide) => {
              const difficultyClass = `difficulty-${guide.difficulty.toLowerCase()}`;
              
              return (
                <div key={guide.id} className="guide-card p-5 rounded">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{guide.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{guide.category}</span>
                            <span className={`${difficultyClass} difficulty-badge`}>{guide.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{guide.content}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Device:</span>
                          <span className="text-gray-600"> {guide.device_type}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Time:</span>
                          <span className="text-gray-600"> {guide.estimated_time}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Tools:</span>
                          <span className="text-gray-600"> {guide.tools_required}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm border-t pt-3">
                        <div className="flex items-center gap-4 text-gray-600">
                          <span>👁️ {guide.views.toLocaleString()} views</span>
                          <span>👍 {guide.helpful_votes} helpful</span>
                          <span>✍️ by {guide.author}</span>
                        </div>
                        <a href="#" className="text-blue-600 hover:underline font-semibold">Read Full Guide →</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <div className="mb-3">
            <Link href="/" className="hover:underline mx-2">Home</Link> |
            <a href="#" className="hover:underline mx-2">Help</a> |
            <Link href="/about-us" className="hover:underline mx-2">About</Link> |
            <Link href="/contact" className="hover:underline mx-2">Contact</Link>
          </div>
          <div className="text-gray-400 text-xs">
            &copy; 2024 Hisah Tech. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
