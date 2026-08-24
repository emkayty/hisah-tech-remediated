'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, FileText, Download, Settings, LogOut, Clock, TrendingUp, Star, Edit } from 'lucide-react';

interface DashboardData {
  user: {
    name?: string;
    email: string;
    username?: string;
    created_at?: string;
  };
  stats: {
    downloads: number;
    uploads: number;
    favoritesCount: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'download' | 'upload' | 'favorite';
    title: string;
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
      const data = await res.json();
      
      if (!data.user) {
        router.push('/');
        return;
      }

      // Simulate dashboard data (you can replace this with real API calls)
      setDashboardData({
        user: data.user,
        stats: {
          downloads: Math.floor(Math.random() * 100),
          uploads: Math.floor(Math.random() * 50),
          favoritesCount: Math.floor(Math.random() * 30)
        },
        recentActivity: [
          { id: '1', type: 'download', title: 'Dell Latitude E7450 BIOS', timestamp: '2 hours ago' },
          { id: '2', type: 'upload', title: 'HP Pavilion Schematic', timestamp: '1 day ago' },
          { id: '3', type: 'favorite', title: 'MacBook Pro A1502 Guide', timestamp: '3 days ago' },
          { id: '4', type: 'download', title: 'Lenovo ThinkPad T470 BIOS', timestamp: '5 days ago' }
        ]
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</p>
          <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-1 text-blue-100">
                Welcome back, {dashboardData.user.username || dashboardData.user.name || dashboardData.user.email}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href={`/profile/${dashboardData.user.username}`}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <User size={18} />
                View Profile
              </Link>
              <Link href="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{dashboardData.stats.downloads}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Your Uploads</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{dashboardData.stats.uploads}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Favorites</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{dashboardData.stats.favoritesCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'download' ? 'bg-blue-100' :
                      activity.type === 'upload' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {activity.type === 'download' && <Download className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'upload' && <FileText className="w-5 h-5 text-green-600" />}
                      {activity.type === 'favorite' && <Star className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="capitalize">{activity.type}</span> • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {dashboardData.recentActivity.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No recent activity yet</p>
                  <Link href="/bios-files" className="text-blue-600 hover:underline mt-2 inline-block">
                    Start exploring resources
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Account Info */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Account Info</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-800">{dashboardData.user.username || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{dashboardData.user.email}</p>
                </div>
                {dashboardData.user.name && (
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{dashboardData.user.name}</p>
                  </div>
                )}
                {dashboardData.user.created_at && (
                  <div>
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium text-gray-800">
                      {new Date(dashboardData.user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <Link 
                href="/settings/profile"
                className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                <Edit size={16} />
                Edit Profile
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
              </div>
              
              <div className="space-y-2">
                <Link 
                  href="/bios-files" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-200"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Browse BIOS Files</span>
                </Link>
                
                <Link 
                  href="/schematics" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-200"
                >
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">View Schematics</span>
                </Link>
                
                <Link 
                  href="/repair-guides" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-200"
                >
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Repair Guides</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition border border-red-200 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
