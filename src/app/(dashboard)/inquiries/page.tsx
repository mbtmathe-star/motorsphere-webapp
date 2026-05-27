'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type Inquiry = {
  id: string;
  listingTitle: string;
  listingId: string;
  from: string;
  message: string;
  sentAt: string;
  status: 'unread' | 'replied' | 'closed';
  replies: { from: string; text: string; at: string }[];
};

const DEMO_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    listingTitle: '2021 Toyota Hilux 2.8 GD-6',
    listingId: 'veh-1',
    from: 'John M.',
    message: 'Hi, is this vehicle still available? What is the lowest you can go on price?',
    sentAt: '2 hours ago',
    status: 'unread',
    replies: [],
  },
  {
    id: 'inq-2',
    listingTitle: '2020 Volkswagen Polo 1.0 TSI',
    listingId: 'veh-2',
    from: 'Sarah K.',
    message: 'Does this car have a full service history? And is the roadworthy available?',
    sentAt: '1 day ago',
    status: 'replied',
    replies: [
      { from: 'You', text: 'Yes, full service history with all stamps. Roadworthy available on request.', at: '23 hours ago' },
    ],
  },
  {
    id: 'inq-3',
    listingTitle: 'Toyota Hilux Front Bumper',
    listingId: 'part-1',
    from: 'Sipho N.',
    message: 'Can you deliver to Johannesburg? What is the condition like?',
    sentAt: '3 days ago',
    status: 'closed',
    replies: [
      { from: 'You', text: 'Yes, delivery available. Condition is good — minor surface marks only.', at: '2 days ago' },
      { from: 'Sipho N.', text: 'Great, I will take it. When can we arrange collection?', at: '2 days ago' },
    ],
  },
];

const STATUS_BADGE: Record<Inquiry['status'], { bg: string; text: string; label: string }> = {
  unread:  { bg: '#dbeafe', text: '#1d4ed8', label: 'New' },
  replied: { bg: '#dcfce7', text: '#15803d', label: 'Replied' },
  closed:  { bg: '#f3f4f6', text: '#6b7280', label: 'Closed' },
};

export default function InquiriesPage() {
  const { user } = useAuth();
  const [selected, setSelected]   = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>(DEMO_INQUIRIES);

  const sendReply = (id: string) => {
    if (!replyText.trim()) return;
    setInquiries(prev => prev.map(inq => {
      if (inq.id !== id) return inq;
      return {
        ...inq,
        status: 'replied',
        replies: [...inq.replies, { from: 'You', text: replyText, at: 'just now' }],
      };
    }));
    setReplyText('');
  };

  if (!user) return null;

  const active = selected ? inquiries.find(i => i.id === selected) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Inquiries</h1>
        <p className="text-sm text-gray-500 mt-1">
          Messages from buyers about your listings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {inquiries.map((inq, i) => {
            const s = STATUS_BADGE[inq.status];
            return (
              <button
                key={inq.id}
                onClick={() => setSelected(inq.id === selected ? null : inq.id)}
                className={`w-full text-left p-4 transition-colors hover:bg-gray-50 ${i > 0 ? 'border-t border-gray-100' : ''} ${selected === inq.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 leading-tight truncate">{inq.listingTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">From {inq.from} · {inq.sentAt}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{inq.message}</p>
                  </div>
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {active && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div>
              <Link href={`/listing/${active.listingId}`} className="text-xs font-black text-[#0866ff] hover:underline">
                → {active.listingTitle}
              </Link>
              <p className="text-sm font-black text-gray-900 mt-1">From: {active.from}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{active.message}</p>
              <p className="text-[10px] text-gray-400 mt-1">{active.sentAt}</p>
            </div>

            {active.replies.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 ${r.from === 'You' ? 'ml-4 text-right' : 'mr-4'}`}
                style={{ background: r.from === 'You' ? '#eff6ff' : '#f9fafb' }}
              >
                <p className="text-xs font-black text-gray-600 mb-1">{r.from}</p>
                <p className="text-sm text-gray-700">{r.text}</p>
                <p className="text-[10px] text-gray-400 mt-1">{r.at}</p>
              </div>
            ))}

            {active.status !== 'closed' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply(active.id)}
                  placeholder="Type a reply…"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866ff]"
                />
                <button
                  onClick={() => sendReply(active.id)}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                  style={{ background: '#0866ff' }}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
