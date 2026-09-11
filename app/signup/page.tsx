'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MAHARASHTRA_DISTRICTS } from '@/lib/taxonomy';
import { User, Building2, GraduationCap, Landmark, ShieldCheck, Mail, Lock, Sparkles, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const DEFAULT_SKILLS = [
  'Python',
  'Java',
  'SQL',
  'React',
  'Node.js',
  'Excel',
  'Communication',
  'AutoCAD',
  'Tally',
  'Digital Marketing',
  'Data Analysis',
  'AWS',
  'Machine Learning',
  'HTML/CSS',
  'JavaScript',
  'Git',
  'Linux',
];

export default function SignupPage() {
  const [role, setRole] = useState<'STUDENT' | 'INDUSTRY' | 'INSTITUTE' | 'GOVERNMENT'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [organizationName, setOrganizationName] = useState('');
  const [instituteType, setInstituteType] = useState('POLYTECHNIC');
  const [cinOrGstin, setCinOrGstin] = useState('');
  const [education, setEducation] = useState('');
  const [availableSkills, setAvailableSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!availableSkills.includes(trimmed)) {
      setAvailableSkills((prev) => [...prev, trimmed]);
    }
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          district,
          organizationName,
          instituteType,
          cinOrGstin: role === 'INDUSTRY' ? cinOrGstin : undefined,
          education: role === 'STUDENT' ? education : undefined,
          skills: role === 'STUDENT' ? selectedSkills : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Registration successful!', `Created account as ${role}.`);
        router.push(`/dashboard/${role.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error('Signup failed', data.error || 'Please review your submission.');
      }
    } catch (err) {
      toast.error('Network error', 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Join the Jobzy Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select your stakeholder perspective in Maharashtra&apos;s skill alignment platform.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              role === 'STUDENT'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('INDUSTRY')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              role === 'INDUSTRY'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs">Industry</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('INSTITUTE')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              role === 'INSTITUTE'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs">Institute</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('GOVERNMENT')}
            className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              role === 'GOVERNMENT'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-5 h-5" />
            <span className="text-xs">Govt/DTE</span>
          </button>
        </div>

        {role === 'GOVERNMENT' && (
          <div className="p-3 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            <strong>Security Notice:</strong> Government accounts require verification before policy and curriculum modification permissions are activated.
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name / Officer Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Deshmukh or Rajesh Patil"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official / Work Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {role === 'STUDENT' && (
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Education / Degree
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. B.Tech in CSE / B.Com / Diploma in IT"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Your Current Skills (Used for Skill Gap Analysis):
                  </label>
                  {selectedSkills.length > 0 && (
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                      {selectedSkills.length} selected
                    </span>
                  )}
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-sm'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <span className={isSelected ? 'text-white font-bold' : 'text-slate-400 font-bold'}>
                          {isSelected ? '✓' : '+'}
                        </span>
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add other skill input + button */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                    placeholder="Add other skill (e.g. Docker, Flutter)..."
                    className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {role === 'INDUSTRY' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Tata Motors, Mahindra Electric, Bajaj Auto"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate CIN or GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={cinOrGstin}
                  onChange={(e) => setCinOrGstin(e.target.value)}
                  placeholder="e.g. U72900MH2019PLC323456 / 27AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Govt administrators verify corporate credentials to award the verified emblem.
                </p>
              </div>
            </div>
          )}

          {role === 'INSTITUTE' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institute Name
                </label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. Govt Polytechnic Pune"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={instituteType}
                  onChange={(e) => setInstituteType(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="POLYTECHNIC">Polytechnic / MSBTE</option>
                  <option value="ITI">Industrial Training Institute (ITI)</option>
                  <option value="UNIVERSITY">State Technical University</option>
                  <option value="TRAINING_PARTNER">Sector Skill Training Center</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                District (Maharashtra)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MAHARASHTRA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full mt-4"
          >
            Complete Registration
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
