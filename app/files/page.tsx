'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, Search, Filter, Star, MessageCircle, Trash2, X } from 'lucide-react';
import Link from 'next/link';

interface FileRecord {
  id: number;
  filename: string;
  category: string;
  description: string;
  file_size: number;
  downloads: number;
  uploaded_by: number;
  uploader_username: string;
  created_at: string;
}

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  username: string;
  full_name: string;
}

interface Rating {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<globalThis.File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  
  // Comments and ratings
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [ratings, setRatings] = useState<{ [key: number]: Rating }>({});
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const categories = [
    'Repair Guides',
    'Schematics',
    'BIOS Files',
    'Firmware',
    'Drivers',
    'Manuals',
    'Other'
  ];

  useEffect(() => {
    fetchUser();
    fetchFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchQuery, categoryFilter]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const filterFiles = () => {
    let filtered = files;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(f => f.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.filename.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
      );
    }

    setFilteredFiles(filtered);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadCategory) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);
    formData.append('description', uploadDescription);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('File uploaded successfully!');
        setIsUploadOpen(false);
        setUploadFile(null);
        setUploadCategory('');
        setUploadDescription('');
        fetchFiles();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId: number, filename: string) => {
    if (!user) {
      alert('Please login to download files');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/download?fileId=${fileId}`);
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Download failed');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh to update download count
      fetchFiles();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Download failed');
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('File deleted successfully!');
        fetchFiles();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Delete failed');
    }
  };

  // Fetch comments for a file
  const fetchComments = async (fileId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}/comments`);
      const data = await res.json();
      setComments(prev => ({ ...prev, [fileId]: data.comments || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Fetch rating for a file
  const fetchRating = async (fileId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}/rating`);
      const data = await res.json();
      setRatings(prev => ({ ...prev, [fileId]: data }));
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  // Toggle file details (comments and rating)
  const toggleFileDetails = (fileId: number) => {
    if (selectedFile === fileId) {
      setSelectedFile(null);
    } else {
      setSelectedFile(fileId);
      if (!comments[fileId]) fetchComments(fileId);
      if (!ratings[fileId]) fetchRating(fileId);
    }
  };

  // Add comment
  const handleAddComment = async (fileId: number) => {
    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    setAddingComment(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewComment('');
        fetchComments(fileId);
      } else {
        alert(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number, fileId: number) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchComments(fileId);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  // Rate file
  const handleRate = async (fileId: number, rating: number) => {
    if (!user) {
      alert('Please login to rate');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();

      if (res.ok) {
        setRatings(prev => ({ ...prev, [fileId]: data }));
      } else {
        alert(data.error || 'Failed to rate');
      }
    } catch (error) {
      console.error('Error rating file:', error);
      alert('Failed to rate');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Forum-style Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4a90e2 0%, #2c5aa0 100%)',
        borderBottom: '4px solid #1e3a8a'
      }} className="text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">File Library</h1>
          <p className="text-blue-100">Upload, download, and share files with the community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Upload Button */}
            {user && (
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload File
              </button>
            )}
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid gap-4">
          {filteredFiles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              <p className="text-lg">No files found</p>
            </div>
          ) : (
            filteredFiles.map((file) => {
              const fileRating = ratings[file.id];
              const fileComments = comments[file.id] || [];
              const isExpanded = selectedFile === file.id;

              return (
                <div key={file.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {file.filename}
                        </h3>
                        
                        {file.description && (
                          <p className="text-gray-600 mb-3">{file.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {file.category}
                          </span>
                          <span>{formatFileSize(file.file_size)}</span>
                          <span>{file.downloads} downloads</span>
                          <span>by @{file.uploader_username}</span>
                          <span>{formatDate(file.created_at)}</span>
                        </div>

                        {/* Rating Display */}
                        {fileRating && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= Math.round(fileRating.averageRating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {fileRating.averageRating.toFixed(1)} ({fileRating.totalRatings} ratings)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleDownload(file.id, file.filename)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>

                        <button
                          onClick={() => toggleFileDetails(file.id)}
                          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Comments ({fileComments.length})
                        </button>

                        {user && user.id === file.uploaded_by && (
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details: Comments and Rating */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        {/* Rate this file */}
                        {user && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Rate this file:</h4>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRate(file.id, star)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      fileRating && star <= (fileRating.userRating || 0)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 hover:text-yellow-400'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            {fileRating?.userRating && (
                              <p className="text-sm text-gray-600 mt-2">
                                Your rating: {fileRating.userRating} stars
                              </p>
                            )}
                          </div>
                        )}

                        {/* Comments Section */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Comments:</h4>

                          {/* Add Comment */}
                          {user && (
                            <div className="mb-4">
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                              />
                              <button
                                onClick={() => handleAddComment(file.id)}
                                disabled={addingComment || !newComment.trim()}
                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {addingComment ? 'Posting...' : 'Post Comment'}
                              </button>
                            </div>
                          )}

                          {/* Comments List */}
                          <div className="space-y-4">
                            {fileComments.length === 0 ? (
                              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                            ) : (
                              fileComments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">
                                          {comment.full_name || comment.username}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          @{comment.username}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                          • {formatDate(comment.created_at)}
                                        </span>
                                      </div>
                                      <p className="text-gray-700">{comment.comment}</p>
                                    </div>
                                    {user && user.username === comment.username && (
                                      <button
                                        onClick={() => handleDeleteComment(comment.id, file.id)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File (max 10MB)
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
