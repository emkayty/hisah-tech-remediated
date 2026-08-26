'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Files } from 'lucide-react';

type AdminFile = { id: number; filename: string; category: string; description: string; file_size: number; downloads: number; created_at: string };

export default function AdminFilesPage() {
  const router = useRouter();
  const [files, setFiles] = useState<AdminFile[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/files', { cache: 'no-store' }).then(async (response) => { if (response.status === 401 || response.status === 403) { router.push('/login'); return; } if (!response.ok) throw new Error('Files could not be loaded.'); const data = await response.json(); setFiles(data.files || []); }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Files could not be loaded.')).finally(() => setLoading(false)); }, []);
  return <div className="admin-page page-shell"><Link href="/admin" className="admin-back"><ArrowLeft size={15} /> Admin dashboard</Link><div className="admin-page__top"><span className="eyebrow"><Files size={14} /> Library</span><h1>File management</h1><p>Review uploaded resources and the activity around them.</p></div>{error && <div className="form-error" role="alert">{error}</div>}{loading ? <div className="membership-status">Loading files…</div> : <section className="admin-section"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Resource</th><th>Category</th><th>Size</th><th>Downloads</th><th>Added</th></tr></thead><tbody>{files.map((file) => <tr key={file.id}><td><strong>{file.filename}</strong><small>{file.description || 'No description'}</small></td><td>{file.category}</td><td>{(Number(file.file_size) / 1024).toFixed(1)} KB</td><td>{file.downloads}</td><td>{new Date(file.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>{!files.length && <p className="admin-empty">No files have been uploaded yet.</p>}</section>}</div>;
}
