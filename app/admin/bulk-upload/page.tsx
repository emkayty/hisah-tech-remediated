'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Check, AlertCircle, Loader2, FileImage, FileVideo, FileAudio, FileText, File, Trash2, Archive, Binary } from 'lucide-react';

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  uploadedId?: string;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const filesWithProgress: FileWithProgress[] = newFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...filesWithProgress]);
  };

  const uploadFile = async (fileWithProgress: FileWithProgress, index: number) => {
    const formData = new FormData();
    formData.append('file', fileWithProgress.file);

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress, status: 'uploading' } : f
          ));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            setFiles(prev => prev.map((f, i) => 
              i === index ? { ...f, progress: 100, status: 'success', uploadedId: response.file.id } : f
            ));
          } catch (error) {
            setFiles(prev => prev.map((f, i) => 
              i === index ? { ...f, status: 'error', error: 'Failed to parse response' } : f
            ));
          }
        } else {
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, status: 'error', error: `Upload failed: ${xhr.status}` } : f
          ));
        }
        resolve();
      });

      xhr.addEventListener('error', () => {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, status: 'error', error: 'Network error' } : f
        ));
        resolve();
      });

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`);
      xhr.send(formData);
    });
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    
    const pendingFiles = files
      .map((f, i) => ({ file: f, index: i }))
      .filter(({ file }) => file.status === 'pending' || file.status === 'error');

    for (const { file, index } of pendingFiles) {
      await uploadFile(file, index);
    }

    setIsUploading(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    const name = file.name.toLowerCase();
    
    if (type.startsWith('image/')) return <FileImage className="w-5 h-5 text-blue-500" />;
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-purple-500" />;
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-green-500" />;
    if (type.startsWith('text/') || type.includes('pdf') || type.includes('document')) {
      return <FileText className="w-5 h-5 text-yellow-500" />;
    }
    if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z') || name.endsWith('.tar') || name.endsWith('.gz')) {
      return <Archive className="w-5 h-5 text-orange-500" />;
    }
    if (name.endsWith('.bin')) {
      return <Binary className="w-5 h-5 text-gray-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    uploading: files.filter(f => f.status === 'uploading').length,
    success: files.filter(f => f.status === 'success').length,
    error: files.filter(f => f.status === 'error').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Admin Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Bulk File Upload</h1>
          <p className="text-gray-600 mt-2">Upload multiple files at once</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-500">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.uploading}</div>
            <div className="text-sm text-gray-600">Uploading</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-sm text-gray-600">Success</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-12 mb-6 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
            }
          `}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse • All file types supported (Images, Videos, Documents, ZIP, RAR, 7Z, BIN, etc.)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Actions */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={uploadAllFiles}
              disabled={isUploading || stats.pending === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload All ({stats.pending})
                </>
              )}
            </button>
            <button
              onClick={clearCompleted}
              disabled={stats.success === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Completed
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {files.map((fileWithProgress, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      {getFileIcon(fileWithProgress.file)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileWithProgress.file.name}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatFileSize(fileWithProgress.file.size)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {fileWithProgress.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fileWithProgress.progress}%` }}
                          />
                        </div>
                      )}

                      {/* Error Message */}
                      {fileWithProgress.status === 'error' && fileWithProgress.error && (
                        <p className="text-xs text-red-600">{fileWithProgress.error}</p>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {fileWithProgress.status === 'pending' && (
                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                      )}
                      {fileWithProgress.status === 'uploading' && (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      )}
                      {fileWithProgress.status === 'success' && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {fileWithProgress.status === 'error' && (
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
                      disabled={fileWithProgress.status === 'uploading'}
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No files selected yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
