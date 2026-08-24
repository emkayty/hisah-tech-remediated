'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BiosFilesDropdown from './components/BiosFilesDropdown';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea',
  'South Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
  'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 
  'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
  'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

export default function HomePage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<{ name?: string; email: string; username?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

  const API_URL = '';

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch(API_URL + '/api/auth/me');
      const data = await res.json();
      
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }

  function openAuthModal(mode: 'login' | 'signup') {
    setAuthMode(mode);
    setShowAuthModal(true);
    setAuthError('');
  }

  function closeAuthModal() {
    setShowAuthModal(false);
    setAuthError('');
  }

  async function handleAuthSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const country = formData.get('country') as string;
    const whatsapp_number = formData.get('whatsapp_number') as string;
    
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const body = authMode === 'login' 
      ? { email, password }
      : { email, password, name, username, country, whatsapp_number };
    
    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAuthError(data.error || 'An error occurred');
        return;
      }
      
      setCurrentUser(data.user);
      closeAuthModal();
      
      if (authMode === 'signup') {
        alert('Account created successfully! You are now logged in.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('Network error. Please try again.');
    }
  }

  async function logout() {
    try {
      await fetch(API_URL + '/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <div className="bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="forum-header text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <img 
                src="https://app-cdn.appgen.com/c7064d62-1c73-490d-ac77-d68af9351b9e/assets/uploaded_1770778750067_te5t3k.jpeg" 
                alt="Hisah Tech Logo" 
                className="w-10 h-10 rounded-full object-contain bg-white/10 p-1"
              />
              <h1 className="text-2xl font-bold">HISAH TECH</h1>
            </div>
            <div className="flex gap-4 text-sm items-center">
              <Link href="/" className="hover:underline">Home</Link>
              <BiosFilesDropdown />
              <Link href="/schematics" className="hover:underline">Schematics</Link>
              <Link href="/repair-guides" className="hover:underline">Guides</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded">
              {currentUser ? `Welcome, ${currentUser.username || currentUser.name || currentUser.email}` : 'Welcome, Guest'}
            </span>
            {!currentUser ? (
              <>
                <button onClick={() => openAuthModal('signup')} className="hover:underline">Register</button>
                <button onClick={() => openAuthModal('login')} className="hover:underline">Login</button>
              </>
            ) : (
              <button onClick={logout} className="hover:underline">Logout</button>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="breadcrumb">
          <a href="#" className="text-blue-600 hover:underline">Hisah Tech</a> » <span>Board Index</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Stats Bar */}
        <div className="stats-box p-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <div>Total Posts: 1,847,392 | 
                Total Topics: 142,883 | 
                Total Members: 234,567</div>
            <div>
              <span className="font-bold">Welcome our newest member:</span> <a href="#" className="text-blue-600">usman</a>
            </div>
          </div>
        </div>

        {/* General Discussion */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 font-bold text-lg mb-2">
            General Discussion
          </div>
          
          <div className="forum-category mb-2">
            <div className="flex p-4">
              <div className="w-12 flex-shrink-0">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-700 font-bold text-base mb-1">
                  <a href="#" className="hover:underline">Troubleshooting &amp; Repair</a>
                </h3>
                <p className="text-gray-600 text-sm">Get help diagnosing and fixing hardware problems. Post your issues here.</p>
                <div className="text-xs text-gray-500 mt-1">Moderators: <a href="#" className="text-blue-600">Admin</a>, <a href="#" className="text-blue-600">RepairGuru</a></div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">45,892</div>
                <div className="text-xs text-gray-500">Topics</div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">342,108</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="w-48 text-xs">
                <div className="text-gray-600"><span className="font-bold">Last post</span> by <a href="#" className="text-blue-600">ElectroFix</a></div>
                <div className="text-gray-500">in <a href="#" className="text-blue-600">Dead PSU - no power</a></div>
                <div className="text-gray-400">Today at 2:34 PM</div>
              </div>
            </div>
          </div>

          <div className="forum-category mb-2">
            <div className="flex p-4">
              <div className="w-12 flex-shrink-0">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-700 font-bold text-base mb-1">
                  <a href="#" className="hover:underline">Success Stories</a>
                </h3>
                <p className="text-gray-600 text-sm">Share your repair victories and restoration projects.</p>
                <div className="text-xs text-gray-500 mt-1">Moderators: <a href="#" className="text-blue-600">Admin</a></div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">8,432</div>
                <div className="text-xs text-gray-500">Topics</div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">67,219</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="w-48 text-xs">
                <div className="text-gray-600"><span className="font-bold">Last post</span> by <a href="#" className="text-blue-600">RetroGamer</a></div>
                <div className="text-gray-500">in <a href="#" className="text-blue-600">Fixed my CRT monitor!</a></div>
                <div className="text-gray-400">Today at 1:15 PM</div>
              </div>
            </div>
          </div>

          <div className="forum-category">
            <div className="flex p-4">
              <div className="w-12 flex-shrink-0">
                <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-700 font-bold text-base mb-1">
                  <a href="#" className="hover:underline">General Hardware Discussion</a>
                </h3>
                <p className="text-gray-600 text-sm">Discuss hardware news, reviews, and general electronics topics.</p>
                <div className="text-xs text-gray-500 mt-1">Moderators: <a href="#" className="text-blue-600">Admin</a>, <a href="#" className="text-blue-600">HardwareNerd</a></div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">12,847</div>
                <div className="text-xs text-gray-500">Topics</div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">98,765</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="w-48 text-xs">
                <div className="text-gray-600"><span className="font-bold">Last post</span> by <a href="#" className="text-blue-600">CircuitKing</a></div>
                <div className="text-gray-500">in <a href="#" className="text-blue-600">Best soldering iron?</a></div>
                <div className="text-gray-400">Yesterday at 11:42 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Computer Hardware */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 font-bold text-lg mb-2">
            Computer Hardware
          </div>
          
          <div className="forum-category mb-2">
            <div className="flex p-4">
              <div className="w-12 flex-shrink-0">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,18C20.5,18 21,18.2 21.4,18.6C21.8,19 22,19.5 22,20V22H2V20C2,19.5 2.2,19 2.6,18.6C3,18.2 3.5,18 4,18H6V16C6,15.2 6.2,14.4 6.6,13.7L3,8V7H21V8L17.4,13.7C17.8,14.4 18,15.2 18,16V18H20M4.5,8.9L7,12.4V16C7,16.5 7.2,17 7.6,17.4C8,17.8 8.5,18 9,18H15C15.5,18 16,17.8 16.4,17.4C16.8,17 17,16.5 17,16V12.4L19.5,8.9H4.5M10,10H14V11H10V10M10,12H14V13H10V12Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-700 font-bold text-base mb-1">
                  <a href="#" className="hover:underline">Motherboard Repair</a>
                </h3>
                <p className="text-gray-600 text-sm">Diagnose and repair motherboard issues, bios problems, and chipset failures.</p>
                <div className="text-xs text-gray-500 mt-1">Moderators: <a href="#" className="text-blue-600">MoboDoc</a>, <a href="#" className="text-blue-600">ChipWhisperer</a></div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">18,902</div>
                <div className="text-xs text-gray-500">Topics</div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">156,438</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="w-48 text-xs">
                <div className="text-gray-600"><span className="font-bold">Last post</span> by <a href="#" className="text-blue-600">PCRepair Pro</a></div>
                <div className="text-gray-500">in <a href="#" className="text-blue-600">No POST, no beep</a></div>
                <div className="text-gray-400">Today at 4:15 PM</div>
              </div>
            </div>
          </div>

          <div className="forum-category mb-2">
            <div className="flex p-4">
              <div className="w-12 flex-shrink-0">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-700 font-bold text-base mb-1">
                  <a href="#" className="hover:underline">Monitor &amp; Display Repair</a>
                </h3>
                <p className="text-gray-600 text-sm">LCD, LED, and CRT monitor troubleshooting and repair.</p>
                <div className="text-xs text-gray-500 mt-1">Moderators: <a href="#" className="text-blue-600">DisplayDoc</a></div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">9,234</div>
                <div className="text-xs text-gray-500">Topics</div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">72,103</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="w-48 text-xs">
                <div className="text-gray-600"><span className="font-bold">Last post</span> by <a href="#" className="text-blue-600">ScreenFixer</a></div>
                <div className="text-gray-500">in <a href="#" className="text-blue-600">Samsung won&apos;t turn on</a></div>
                <div className="text-gray-400">Today at 10:22 AM</div>
              </div>
            </div>
          </div>

          <div className="forum-category">
            <div className="flex p-4">
              <div className="w-12 flex-shrink-0">
                <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-700 font-bold text-base mb-1">
                  <a href="#" className="hover:underline">Graphics Cards &amp; GPUs</a>
                </h3>
                <p className="text-gray-600 text-sm">Video card troubleshooting, fan replacement, and thermal issues.</p>
                <div className="text-xs text-gray-500 mt-1">Moderators: <a href="#" className="text-blue-600">GPUGuru</a></div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">7,651</div>
                <div className="text-xs text-gray-500">Topics</div>
              </div>
              <div className="w-20 text-center text-sm">
                <div className="font-bold text-gray-700">58,209</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="w-48 text-xs">
                <div className="text-gray-600"><span className="font-bold">Last post</span> by <a href="#" className="text-blue-600">VideoTech</a></div>
                <div className="text-gray-500">in <a href="#" className="text-blue-600">RTX 3080 artifacts</a></div>
                <div className="text-gray-400">Yesterday at 5:45 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="stats-box p-4">
          <div className="flex gap-8 text-sm">
            <div>
              <span className="font-bold text-blue-700">Who&apos;s Online</span>
              <div className="text-gray-600 mt-2">
                547 users active (127 members and 420 guests)<br />
                Most online today: 892 at 2:15 PM
              </div>
            </div>
            <div className="flex-1">
              <span className="font-bold text-blue-700">Today&apos;s Birthdays</span>
              <div className="text-gray-600 mt-2">
                <a href="#" className="text-blue-600">SolderKing</a> (34), <a href="#" className="text-blue-600">CapMaster</a> (29), <a href="#" className="text-blue-600">ElectroWiz</a> (41)
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <div className="mb-3">
            <a href="#" className="hover:underline mx-2">Home</a> |
            <a href="#" className="hover:underline mx-2">Help</a> |
            <a href="#" className="hover:underline mx-2">Search</a> |
            <Link href="/about-us" className="hover:underline mx-2">About</Link> |
            <Link href="/contact" className="hover:underline mx-2">Contact</Link>
          </div>
          <div className="text-gray-400 text-xs">© 2024 Hisah Tech. All rights reserved.
              Powered by Community Forums Software</div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {authMode === 'login' ? 'Login' : 'Register'}
              </h2>
              <button onClick={closeAuthModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {authError}
              </div>
            )}
            
            <form onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input 
                      type="text" 
                      name="username"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                      placeholder="Choose a unique username"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name (Optional)</label>
                    <input 
                      type="text" 
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                      placeholder="Your full name"
                    />
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input 
                  type="password" 
                  name="password"
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      name="whatsapp_number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                    <select 
                      name="country"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {authMode === 'login' && (
                <div className="mb-6 text-right">
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline" onClick={closeAuthModal}>
                    Forgot password?
                  </Link>
                </div>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
              >
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
              
              <div className="text-center text-sm">
                <span>{authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}</span>
                <button 
                  type="button" 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} 
                  className="text-blue-600 hover:underline ml-1"
                >
                  {authMode === 'login' ? 'Register' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        body {
          font-family: Verdana, Arial, sans-serif;
          background-color: #f5f5f5;
        }
        .forum-header {
          background: linear-gradient(180deg, #4a90e2 0%, #2c5aa0 100%);
          border-bottom: 3px solid #1e3a5f;
        }
        .forum-category {
          background: white;
          border: 1px solid #ddd;
          transition: all 0.2s;
        }
        .forum-category:hover {
          background: #f9f9f9;
          border-color: #4a90e2;
        }
        .stats-box {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        .breadcrumb {
          font-size: 11px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
