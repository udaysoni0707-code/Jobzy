'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  User,
  Check,
  CheckCheck,
  Sparkles,
  Building2,
  GraduationCap,
  Landmark,
  School,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  headline?: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPeerTyping]);

  // 1. Fetch real contacts from database on mount
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const res = await fetch('/api/messages');
        const data = await res.json();

        if (data.success && data.contacts && data.contacts.length > 0) {
          setContacts(data.contacts);
          if (data.currentUserId) {
            setCurrentUserId(data.currentUserId);
          }

          // If userId passed in query, pick that contact
          const target = initialUserId
            ? data.contacts.find((c: Contact) => c.id === initialUserId) || data.contacts[0]
            : data.contacts[0];

          setActiveContact(target);
          if (target) {
            fetchThread(target.id);
          }
        }
      } catch (err) {
        console.error('Failed to load contacts:', err);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [initialUserId]);

  // 2. Fetch thread between current user and target user
  const fetchThread = async (contactId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?targetUserId=${contactId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
        if (data.currentUserId) {
          setCurrentUserId(data.currentUserId);
        }
      }
    } catch (e) {
      console.error('Error fetching messages thread:', e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);
    fetchThread(contact.id);
  };

  // 3. Send message handler
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend || !activeContact) return;

    setIsSending(true);
    setInputText('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeContact.id,
          content: textToSend,
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);

        // If smart reply received, simulate peer typing for natural feel
        if (data.replyMessage) {
          setIsPeerTyping(true);
          setTimeout(() => {
            setIsPeerTyping(false);
            setMessages((prev) => [...prev, data.replyMessage]);
          }, 800);
        }
      } else {
        toast.error('Failed to send message', data.error || 'Please try again.');
      }
    } catch (err) {
      toast.error('Network error', 'Unable to reach the messaging server.');
    } finally {
      setIsSending(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'INDUSTRY':
        return <Badge variant="blue">Industry</Badge>;
      case 'STUDENT':
        return <Badge variant="emerald">Student</Badge>;
      case 'INSTITUTE':
        return <Badge variant="outline">Institute</Badge>;
      case 'GOVERNMENT':
        return <Badge variant="amber">Government</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'INDUSTRY':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'STUDENT':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'INSTITUTE':
        return <School className="w-4 h-4 text-purple-600" />;
      case 'GOVERNMENT':
        return <Landmark className="w-4 h-4 text-amber-600" />;
      default:
        return <User className="w-4 h-4 text-slate-500" />;
    }
  };

  const suggestions = [
    'Inquire about EV Technician internship openings in Pune',
    'Ask about BMS Diagnostic Lab workshop schedule',
    'Share AIS-038 high-voltage safety certification notes',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Info Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>Stakeholder Collaboration Desk</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct real-time communication between Students, Industry Talent Desks, MSBTE Faculty, and DTE Officials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Messaging Active
          </span>
        </div>
      </div>

      {/* Main Messaging Layout */}
      <div className="h-[74vh] min-h-[550px] grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 shadow-xl overflow-hidden">
        {/* Left: Contacts Sidebar (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col bg-slate-50/50 dark:bg-slate-900/30">
          <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Network Contacts
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
              {contacts.length} Connected
            </span>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {isLoadingContacts ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No contacts found</div>
            ) : (
              contacts.map((contact) => {
                const isSelected = activeContact?.id === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/60 border-l-4 border-blue-600 shadow-xs'
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center shrink-0 font-bold text-xs text-slate-800 dark:text-slate-200">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {contact.name}
                        </span>
                        {getRoleBadge(contact.role)}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{contact.headline}</p>
                      {contact.lastMessage && (
                        <p className="text-[10px] text-slate-400 truncate mt-1 italic">
                          &ldquo;{contact.lastMessage}&rdquo;
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-slate-50/20 dark:bg-slate-950/40">
          {activeContact ? (
            <>
              {/* Chat Thread Header */}
              <div className="h-16 px-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                    {getRoleIcon(activeContact.role)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {activeContact.name}
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{activeContact.headline}</p>
                  </div>
                </div>

                <div className="shrink-0">{getRoleBadge(activeContact.role)}</div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {isLoadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="max-w-xs">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Start Conversation
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Send a message to {activeContact.name} to collaborate on industrial competencies and training.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = currentUserId ? m.senderId === currentUserId : m.senderId !== activeContact.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs font-normal'
                              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs font-normal'
                          }`}
                        >
                          {m.content}
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-slate-400">{formatDate(m.createdAt)}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Peer Typing Indicator */}
                {isPeerTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                    <span className="text-[11px] font-medium">{activeContact.name} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Chips */}
              <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Quick Prompts:
                </span>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(undefined, s)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Form Footer */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write message to ${activeContact.name}...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSending}
                  disabled={!inputText.trim()}
                  className="gap-2 h-10 px-4 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white cursor-pointer shadow-xs shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              <span>Select a contact to view discussion thread</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading messages...</div>}>
      <MessagesPageContent />
    </React.Suspense>
  );
}
