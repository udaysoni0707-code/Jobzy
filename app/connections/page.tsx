'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  Users,
  UserPlus,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function ConnectionsPage() {
  const toast = useToast();
  const [connections, setConnections] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [discoverable, setDiscoverable] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections');
      const data = await res.json();
      if (data.connections) setConnections(data.connections);
      if (data.pendingRequests) setPending(data.pendingRequests);
      if (data.discoverable && data.discoverable.length > 0) {
        setDiscoverable(data.discoverable);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAction = async (action: 'ACCEPT' | 'REJECT', connectionId: string) => {
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, connectionId }),
      });
      if (res.ok) {
        toast.success(`Request ${action.toLowerCase()}ed`);
        fetchConnections();
      }
    } catch (e) {
      toast.error('Operation failed');
    }
  };

  const handleSendRequest = async (targetUserId: string, name: string) => {
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REQUEST', targetUserId }),
      });
      if (res.ok) {
        toast.success('Connection Request Sent', `Invited ${name} to connect.`);
      } else {
        toast.info('Request already exists');
      }
    } catch (e) {
      toast.error('Failed to send request');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Maharashtra State Professional Skill Network
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Connections & Collaboration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Network with certified vocational students, industry mentors from Tata Motors & Mahindra, and MSBTE faculties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Connections & Pending Requests */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pending Invitations */}
          {pending.length > 0 && (
            <Card className="border-blue-200 dark:border-blue-800/80 bg-blue-50/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  Pending Connection Requests ({pending.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {pending.map((p) => (
                  <div
                    key={p.connectionId}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{p.user?.name}</span>
                      <span className="text-slate-500">{p.user?.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="emerald"
                        size="sm"
                        className="h-8 text-xs px-2.5"
                        onClick={() => handleAction('ACCEPT', p.connectionId)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-slate-400"
                        onClick={() => handleAction('REJECT', p.connectionId)}
                      >
                        Ignore
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Active Connections */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active Connections ({connections.length})</CardTitle>
                <Badge variant="emerald">Verified Network</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {connections.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No connections yet. Connect with peers from the discovery list.
                </p>
              ) : (
                connections.map((c) => (
                  <div
                    key={c.connectionId}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center">
                        {c.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {c.user?.name}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {c.user?.profile?.headline || c.user?.role}
                        </span>
                      </div>
                    </div>

                    <Link href={`/messages?userId=${c.user?.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Discover Peers */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Discover Peers & Mentors
              </CardTitle>
              <CardDescription>Recommended based on your EV & Automotive focus in Pune.</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-xs">
              {discoverable.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{p.name}</span>
                    <span className="text-slate-500 text-[11px] block">{p.headline}</span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {p.mutuals} mutual connections
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="h-8 text-xs px-3"
                    onClick={() => handleSendRequest(p.id, p.name)}
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
