
import React from 'react';
import { 
  GraduationCap, 
  Users, 
  ClipboardCheck, 
  Trophy, 
  Megaphone, 
  Star,
  Wallet,
  Calendar,
  AlertTriangle,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Home,
  Info,
  UserPlus,
  ShieldAlert
} from 'lucide-react';

export const ADMIN_SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'users', label: 'Manage Users', icon: <UserPlus size={20} /> },
  { id: 'blacklist-mgr', label: 'Blacklist Requests', icon: <ShieldAlert size={20} /> },
  { id: 'finances', label: 'School Finances', icon: <Wallet size={20} /> },
  { id: 'competition-mgr', label: 'Competition Mgr', icon: <Trophy size={20} /> },
  { id: 'settings', label: 'System Settings', icon: <Settings size={20} /> },
];

export const TEACHER_SIDEBAR_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: <Home size={20} /> },
  { id: 'exam-entry', label: 'Exam Entry', icon: <FileText size={20} /> },
  { id: 'grade-mgmt', label: 'Grade Mgmt', icon: <GraduationCap size={20} /> },
  { id: 'blacklist-req', label: 'Request Blacklist', icon: <AlertTriangle size={20} /> },
  { id: 'top-10', label: 'Top 10', icon: <Trophy size={20} /> },
  { id: 'activity-points', label: 'Activity Points', icon: <Star size={20} /> },
];

export const STUDENT_SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'results', label: 'Results', icon: <GraduationCap size={20} /> },
  { id: 'attendance', label: 'Attendance', icon: <Calendar size={20} /> },
  { id: 'finance', label: 'Fees', icon: <Wallet size={20} /> },
  { id: 'competition', label: 'Competition', icon: <Trophy size={20} /> },
];

export const TEACHER_MOBILE_HOME_ICONS = [
  { id: 'exam-entry', label: 'Exam Entry', icon: <FileText size={28} />, color: 'bg-indigo-600' },
  { id: 'grade-mgmt', label: 'Grade Mgmt', icon: <GraduationCap size={28} />, color: 'bg-violet-600' },
  { id: 'blacklist-req', label: 'Disciplinary', icon: <AlertTriangle size={28} />, color: 'bg-rose-600' },
  { id: 'top-10', label: 'Ranking', icon: <Trophy size={28} />, color: 'bg-amber-500' },
  { id: 'activity-points', label: 'Merits', icon: <Star size={28} />, color: 'bg-emerald-600' },
];

export const STUDENT_MOBILE_HOME_ICONS = [
  { id: 'results', label: 'Results', icon: <GraduationCap size={28} />, color: 'bg-indigo-600' },
  { id: 'attendance', label: 'Attendance', icon: <Calendar size={28} />, color: 'bg-cyan-600' },
  { id: 'finance', label: 'Fee Portal', icon: <Wallet size={28} />, color: 'bg-emerald-600' },
  { id: 'competition', label: 'Weekly Win', icon: <Trophy size={28} />, color: 'bg-amber-500' },
  { id: 'teacher-info', label: 'Faculties', icon: <Users size={28} />, color: 'bg-violet-600' },
  { id: 'quizzes', label: 'Quick Quiz', icon: <HelpCircle size={28} />, color: 'bg-rose-500' },
  { id: 'timetable', label: 'Schedule', icon: <ClipboardCheck size={28} />, color: 'bg-slate-800' },
];

export const MOBILE_BOTTOM_NAV = [
  { id: 'home', label: 'Home', icon: <Home size={22} /> },
  { id: 'about', label: 'About', icon: <Info size={22} /> },
  { id: 'ads', label: 'Ads', icon: <Megaphone size={22} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={22} /> },
];
