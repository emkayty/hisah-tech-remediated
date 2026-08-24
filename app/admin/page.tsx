'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Upload, CreditCard, Users, Files, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!data.user.is_admin) {
        router.push('/');
        return;
      }
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const adminTools = [
    {
      title: 'Bulk File Upload',
      description: 'Upload multiple files at once',
      icon: Upload,
      href: '/admin/bulk-upload',
      color: 'bg-blue-500',
    },
    {
      title: 'Payment Settings',
      description: 'Configure payment providers',
      icon: CreditCard,
      href: '/admin/payment-settings',
      color: 'bg-green-500',
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500',
    },
    {
      title: 'File Management',
      description: 'View and manage all files',
      icon: Files,
      href: '/admin/files',
      color: 'bg-orange-500',
    },
    {
      title: 'Analytics',
      description: 'View platform statistics',
      icon: BarChart,
      href: '/admin/analytics',
      color: 'bg-pink-500',
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}!</p>
        </div>

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-500">—</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">—</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500">—</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">—</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
