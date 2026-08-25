'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageCircle, Send } from 'lucide-react';

type Thread = { id: number; title: string; body: string; category_name: string; author_name: string; created_at: string };
type Reply = { id: number; body: string; author_name: string; created_at: string };

export default function ForumThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [threadId, setThreadId] = useState('');

  useEffect(() => { void params.then(({ threadId: id }) => setThreadId(id)); }, [params]);
  useEffect(() => {
    if (!threadId) return;
    Promise.all([fetch(`/api/forum/threads/${threadId}`), fetch(`/api/forum/threads/${threadId}/replies`)]).then(async ([threadResponse, replyResponse]) => {
      if (!threadResponse.ok) throw new Error('Discussion not found.');
      setThread(await threadResponse.json());
      if (replyResponse.ok) setReplies(await replyResponse.json());
    }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Discussion not found.'));
  }, [threadId]);

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPosting(true);
    setError('');
    try {
      const response = await fetch(`/api/forum/threads/${threadId}/replies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || 'Sign in to reply.'); return; }
      setReplies((current) => [...current, { id: data.id, body, author_name: 'You', created_at: new Date().toISOString() }]);
      setBody('');
    } catch { setError('A network issue interrupted the reply.'); } finally { setPosting(false); }
  }

  return <main className="thread-page page-shell"><Link href="/forum" className="back-link"><ArrowLeft size={16} /> Back to forum</Link>{error && !thread ? <div className="forum-empty"><h1>Discussion unavailable</h1><p>{error}</p><Link className="button button--primary" href="/forum">Return to forum</Link></div> : thread ? <><section className="thread-hero"><span className="thread-card__category">{thread.category_name}</span><h1>{thread.title}</h1><p>Started by {thread.author_name} · {new Date(thread.created_at).toLocaleDateString()}</p></section><article className="thread-post"><div className="thread-post__avatar"><MessageCircle size={19} /></div><div><strong>{thread.author_name}</strong><p>{thread.body}</p></div></article><section className="thread-replies"><div className="forum-content__heading"><div><span className="eyebrow"><MessageCircle size={14} /> Conversation</span><h2>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</h2></div></div>{replies.length ? replies.map((item) => <article className="thread-post" key={item.id}><div className="thread-post__avatar"><MessageCircle size={17} /></div><div><strong>{item.author_name}</strong><p>{item.body}</p></div></article>) : <div className="forum-empty forum-empty--compact"><p>No replies yet. Add the first useful perspective.</p></div>}<form className="reply-form" onSubmit={reply}><label><span className="form-label">Add a reply</span><textarea className="form-control" rows={5} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share a measurement, test, or practical next step." required /></label>{error && <div className="form-error" role="alert">{error}</div>}<button type="submit" className="button button--primary" disabled={posting}><Send size={16} /> {posting ? 'Replying…' : 'Reply to discussion'} <ArrowRight size={16} /></button></form></section></> : <div className="forum-empty"><p>Loading discussion…</p></div>}</main>;
}
