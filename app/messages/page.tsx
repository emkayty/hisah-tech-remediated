'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Conversation {
  id: number;
  other_user_id: number;
  other_username: string;
  other_user_full_name: string;
  other_user_profile_image: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_message_sender_id: number | null;
  unread_count: number;
  created_at: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/messages/conversations`);

      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user_full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Messages</h1>
              {totalUnread > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {totalUnread}
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : 'Start a conversation with other users'}
            </p>
          </div>
        ) : (
          <div className="bg-white border-x">
            {filteredConversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-start gap-3 p-4 border-b hover:bg-gray-50 transition-colors"
              >
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {conv.other_user_profile_image ? (
                    <img
                      src={conv.other_user_profile_image}
                      alt={conv.other_username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {conv.other_username[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.other_user_full_name || conv.other_username}
                    </h3>
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    @{conv.other_username}
                  </p>
                  {conv.last_message && (
                    <p className={`text-sm truncate mt-1 ${conv.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {conv.last_message}
                    </p>
                  )}
                </div>

                {/* Unread Badge */}
                {conv.unread_count > 0 && (
                  <div className="flex-shrink-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                    {conv.unread_count}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
