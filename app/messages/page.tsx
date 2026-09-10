'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Send, User, Check, CheckCheck } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const toast = useToast();

  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Default demo contacts
  const defaultContacts = [
    {
      id: 'cmtvllhl4003pjcwffrj9rk79',
      name: 'Priya Sharma',
      role: 'STUDENT',
      headline: 'Mechatronics Researcher • Mumbai',
    },
    {
      id: 'cmtvllhl4003pjcwffrj9rk80',
      name: 'Tata Motors EV Support',
      role: 'INDUSTRY',
      headline: 'Automotive Talent Desk • Pune',
    },
  ];

  const fetchThread = async (contactId: string) => {
    try {
      const res = await fetch(`/api/messages?targetUserId=${contactId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setContacts(defaultContacts);
    const target = defaultContacts.find((c) => c.id === initialUserId) || defaultContacts[0];
    setActiveContact(target);
    fetchThread(target.id);
  }, [initialUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeContact.id,
          content: inputText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-[75vh] grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
        {/* Left Contacts Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Messages
            </h2>
            <Badge variant="blue">{contacts.length} Active</Badge>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveContact(c);
                  fetchThread(c.id);
                }}
                className={`w-full p-4 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  activeContact?.id === c.id
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-l-4 border-blue-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                    {c.name}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">{c.headline}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Chat Thread */}
        <div className="md:col-span-8 flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/20">
          {activeContact ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {activeContact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {activeContact.name}
                    </h3>
                    <span className="text-[10px] text-slate-500">{activeContact.role}</span>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No messages yet. Send a greeting to begin collaboration!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId !== activeContact.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                          {formatDate(m.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Footer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeContact.name}...`}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSending}
                  disabled={!inputText.trim()}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select a contact to view discussion
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
