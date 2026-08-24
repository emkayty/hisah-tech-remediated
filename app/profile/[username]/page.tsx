'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Globe, Briefcase, Calendar, Download, Upload, Heart, Edit, ArrowLeft } from 'lucide-react';

interface User {
  id: number;
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
  location: string;
  website: string;
  company: string;
  created_at: string;
  stats: {
    downloads: number;
    uploads: number;
    favorites: number;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setCurrentUser(data?.user))
      .catch(() => {});

    // Get profile
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${username}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">This profile doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === user.username;
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Profile header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-100">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
                {isOwnProfile && (
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </Link>
                )}
              </div>

              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {user.company && (
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {user.company}
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {joinDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Download className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.stats.downloads}</div>
            <div className="text-sm text-gray-500">Downloads</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Upload className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.stats.uploads}</div>
            <div className="text-sm text-gray-500">Uploads</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="text-pink-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.stats.favorites}</div>
            <div className="text-sm text-gray-500">Favorites</div>
          </div>
        </div>

        {/* Activity / Content sections could go here */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-center py-8">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
}
