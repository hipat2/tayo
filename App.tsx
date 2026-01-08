
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, UserRole, Announcement, ActivityLogEntry, CompetitionQuestion, BlacklistRequest } from './types';
import { 
  Users, 
  Database, 
  TrendingUp, 
  Megaphone,
  Star,
  Trophy,
  Plus,
  Clock,
  ChevronRight,
  School,
  Settings,
  UserPlus,
  Info,
  LogOut,
  Home,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Hash,
  ShieldAlert,
  Wallet,
  AlertTriangle,
  Check,
  X as XIcon,
  GraduationCap,
  ClipboardCheck,
  HelpCircle,
  Bell,
  Trash2,
  Edit2,
  Search
} from 'lucide-react';
import { 
  ADMIN_SIDEBAR_ITEMS, 
  TEACHER_MOBILE_HOME_ICONS, 
  STUDENT_MOBILE_HOME_ICONS,
  MOBILE_BOTTOM_NAV 
} from './constants';

const translations = {
  en: {
    portal: 'Management Portal',
    identity_id: 'Identity ID',
    password: 'Password',
    login_now: 'Login Now',
    overview: 'System Overview',
    students: 'Total Students',
    teachers: 'Total Teachers',
    revenue: 'Total Revenue',
    unpaid: 'Unpaid Fees',
    school_goal: 'Annual School Goal',
    blacklist_banner: 'You have been Blacklisted for disciplinary reasons. Please visit the Admin office.',
    sign_out: 'Sign Out Securely',
    switch_lang: 'Soomaali',
    appearance: 'Appearance',
    language: 'Language',
    ads: 'Notice Board',
    about: 'About .tayo School',
    enroll_student: 'Enroll Identity Now',
    financials: 'School Financials',
    blacklist_req: 'Blacklist Requests',
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    back: 'Back',
    recent_points: 'Recent Points'
  },
  so: {
    portal: 'Maamulka Iskuulka',
    identity_id: 'Aqoonsiga ID',
    password: 'Furaha',
    login_now: 'Hadda Soo Gal',
    overview: 'Dulmarka Nidaamka',
    students: 'Ardayda Wadarta',
    teachers: 'Macallimiinta Wadarta',
    revenue: 'Dakhliga Wadarta',
    unpaid: 'Lacagaha aan la bixin',
    school_goal: 'Hadafka Sannadlaha',
    blacklist_banner: 'Waxaa lagugu daray liiska madow. Fadlan booqo xafiiska maamulka.',
    sign_out: 'Si Ammaan ah u Bax',
    switch_lang: 'English',
    appearance: 'Muuqaalka',
    language: 'Luqadda',
    ads: 'Ogeysiisyada',
    about: 'Ku saabsan .tayo Iskuulka',
    enroll_student: 'Diiwaangeli Hadda',
    financials: 'Dhaqaalaha Iskuulka',
    blacklist_req: 'Codsiyada Liiska Madow',
    theme_light: 'Iftiin',
    theme_dark: 'Madow',
    back: 'Dib u Noqo',
    recent_points: 'Dhibcaha dhowaan'
  }
};

const B_NAMES = ["Guuleed", "Liibaan", "Axmed", "Maxamed", "Caydiid", "Warsame", "Faarax", "Barkhad", "Xasan", "Cali", "Cumar", "Cabdi", "Jaamac", "Yuusuf", "Ibraahim", "Ismaaciil", "Muuse", "Ciise", "Yaxye", "Sakariye", "Cabdiraxmaan", "Cabdiraxiin", "Cabdiweli", "Cabdicasiis", "Cabdiladiif"];
const G_NAMES = ["Hodan", "Caasho", "Sahra", "Hibaaq", "Maryan", "Deeqa", "Xaliimo", "Luul", "Safiya", "Samsam", "Idil", "Ubax", "Fardowsa", "Xaawo", "Khadra", "Amina", "Shukri", "Nasiibo", "Muna", "Ruqiya", "Foosiya", "Hibo", "Layla", "Samiira", "Sumaya"];

const generateInitialUsers = (): User[] => {
  const admin: User = { id: 'admin', name: 'Super Admin', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' };
  const teacher: User = { id: 'T001', name: 'Prof. Ahmed', role: 'TEACHER', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher' };
  const students: User[] = [];
  
  // Boys
  B_NAMES.forEach((name, i) => {
    const id = `S${String(i + 1).padStart(3, '0')}`;
    const grade = 5 + (i % 8);
    students.push({
      id,
      name: `${name} Jaamac`,
      role: 'STUDENT',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      paidAmount: Math.floor(Math.random() * 1000),
      totalFee: 1000,
      isBlacklisted: false,
      studentPhone: `+252 61 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      age: String(10 + (i % 10)),
      paymentRef: `ACC-${10000 + i}`
    });
  });

  // Girls
  G_NAMES.forEach((name, i) => {
    const id = `S${String(i + 26).padStart(3, '0')}`;
    const grade = 5 + (i % 8);
    students.push({
      id,
      name: `${name} Warsame`,
      role: 'STUDENT',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      paidAmount: Math.floor(Math.random() * 1000),
      totalFee: 1000,
      isBlacklisted: false,
      studentPhone: `+252 61 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      age: String(10 + (i % 10)),
      paymentRef: `ACC-${20000 + i}`
    });
  });

  return [admin, teacher, ...students];
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'so'>('en');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileTab, setMobileTab] = useState<string>('home');
  const [mobileSubPage, setMobileSubPage] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>(generateInitialUsers());
  const [isRegistering, setIsRegistering] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [blacklistRequests, setBlacklistRequests] = useState<BlacklistRequest[]>([]);
  const [announcements] = useState<Announcement[]>([
    { id: '1', title: 'Summer Exams Schedule', content: 'The summer exams will start from June 15th.', date: '2024-05-10', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80' },
  ]);
  const [activityLog] = useState<ActivityLogEntry[]>([
    { id: '1', description: 'Orientation Merit', points: 10, date: '2024-05-01' },
    { id: '2', description: 'Perfect Attendance', points: 5, date: '2024-05-20' },
  ]);

  useEffect(() => {
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [theme]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => u.id.toLowerCase() === loginForm.id.toLowerCase() && loginForm.password === '123');
    if (found) {
      setUser(found);
      setActiveTab(found.role === 'ADMIN' ? 'overview' : 'home');
      setMobileTab('home');
      setError('');
    } else {
      setError('Invalid credentials. Hint: 123');
    }
  };

  const generateAutoId = (role: UserRole) => {
    const prefix = role === 'STUDENT' ? 'S' : role === 'TEACHER' ? 'T' : 'A';
    const roleUsers = users.filter(u => u.role === role);
    const maxNum = roleUsers.reduce((max, u) => {
      const num = parseInt(u.id.substring(1));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const role = formData.get('role') as UserRole;
    
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        name: formData.get('name') as string,
        studentPhone: formData.get('studentPhone') as string,
        parentPhone: formData.get('parentPhone') as string,
        age: formData.get('age') as string,
        placeOfBirth: formData.get('placeOfBirth') as string,
        dob: formData.get('dob') as string,
        paymentRef: formData.get('paymentRef') as string,
      } : u));
      setEditingUser(null);
    } else {
      const newId = generateAutoId(role);
      const newUser: User = {
        id: newId,
        name: formData.get('name') as string,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
        studentPhone: formData.get('studentPhone') as string,
        parentPhone: formData.get('parentPhone') as string,
        age: formData.get('age') as string,
        placeOfBirth: formData.get('placeOfBirth') as string,
        dob: formData.get('dob') as string,
        paymentRef: formData.get('paymentRef') as string,
        paidAmount: 0,
        totalFee: 1000,
        isBlacklisted: false
      };
      setUsers([...users, newUser]);
    }
    setIsRegistering(false);
  };

  const deleteUser = (id: string) => {
    if (window.confirm("Delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const t = (key: keyof typeof translations.en) => translations[language][key];

  const stats = useMemo(() => {
    const students = users.filter(u => u.role === 'STUDENT');
    return {
      totalStudents: students.length,
      totalTeachers: users.filter(u => u.role === 'TEACHER').length,
      totalRevenue: students.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0),
      totalUnpaid: students.reduce((acc, curr) => acc + ((curr.totalFee || 1000) - (curr.paidAmount || 0)), 0),
    };
  }, [users]);

  // Views
  const AdminContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-12 animate-in">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('overview')}</h2>
                   <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Operational Dashboard</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                   <Clock className="text-indigo-600" size={18} />
                   <span className="text-sm font-black text-slate-600 dark:text-slate-300">May 24, 2024</span>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: t('students'), value: stats.totalStudents, icon: <Users />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: t('teachers'), value: stats.totalTeachers, icon: <GraduationCap />, color: 'text-violet-600', bg: 'bg-violet-50' },
                  { label: t('revenue'), value: `$${stats.totalRevenue.toLocaleString()}`, icon: <Wallet />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: t('unpaid'), value: `$${stats.totalUnpaid.toLocaleString()}`, icon: <AlertTriangle />, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-8 admin-card hover:-translate-y-2 transition-all">
                     <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8`}>{stat.icon}</div>
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                     <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                ))}
             </div>
             <div className="bg-white dark:bg-slate-800 p-12 admin-card">
                <div className="flex justify-between items-end mb-10">
                   <h3 className="text-2xl font-black tracking-tight">{t('school_goal')}</h3>
                   <span className="text-5xl font-black text-indigo-600">71%</span>
                </div>
                <div className="h-5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-1">
                   <div className="h-full bg-indigo-600 w-[71%] rounded-full shadow-lg"></div>
                </div>
             </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-8 animate-in max-w-6xl mx-auto">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tight">{isRegistering ? (editingUser ? 'Edit Identity' : 'Enroll Identity') : 'User Directory'}</h2>
                {!isRegistering && (
                  <button onClick={() => { setIsRegistering(true); setEditingUser(null); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                    <Plus size={20} /> Register New
                  </button>
                )}
             </div>

             {isRegistering ? (
               <div className="bg-white dark:bg-slate-800 p-10 admin-card mobile-form-container">
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => { setIsRegistering(false); setEditingUser(null); }} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl"><ArrowLeft/></button>
                    <p className="text-lg font-black">{editingUser ? `Editing ${editingUser.name}` : 'New Enrollment Form'}</p>
                  </div>
                  <form onSubmit={handleSaveUser} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                       {[
                         { name: 'name', label: 'Full Legal Name', defaultValue: editingUser?.name },
                         { name: 'studentPhone', label: 'Mobile Phone', defaultValue: editingUser?.studentPhone },
                         { name: 'parentPhone', label: 'Guardian Phone', defaultValue: editingUser?.parentPhone },
                         { name: 'age', label: 'Age', defaultValue: editingUser?.age },
                         { name: 'placeOfBirth', label: 'Birth Place', defaultValue: editingUser?.placeOfBirth },
                         { name: 'dob', label: 'Date of Birth', type: 'date', defaultValue: editingUser?.dob },
                         { name: 'paymentRef', label: 'Bank Account Ref', defaultValue: editingUser?.paymentRef },
                       ].map(f => (
                         <div key={f.name} className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{f.label}</label>
                            <input name={f.name} type={f.type || 'text'} defaultValue={f.defaultValue} required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-black font-bold" />
                         </div>
                       ))}
                       {!editingUser && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Access Role</label>
                          <select name="role" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-black font-bold">
                             <option value="STUDENT">Student</option>
                             <option value="TEACHER">Teacher</option>
                          </select>
                        </div>
                       )}
                    </div>
                    <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl">{editingUser ? 'Update Profile' : 'Register Identity'}</button>
                  </form>
               </div>
             ) : (
               <div className="bg-white dark:bg-slate-800 admin-card overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center gap-4">
                     <Search size={20} className="text-slate-400" />
                     <input placeholder="Search directory..." className="bg-transparent border-none text-black font-bold focus:ring-0 w-full" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 dark:bg-slate-900/50">
                          <tr>
                             <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Identity</th>
                             <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Phone</th>
                             <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Age/Role</th>
                             <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 text-center">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <img src={u.avatar} className="w-10 h-10 rounded-full" />
                                     <div>
                                        <p className="font-black text-slate-900 dark:text-white">{u.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{u.id}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{u.studentPhone || 'N/A'}</td>
                               <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{u.role === 'STUDENT' ? `${u.age} yrs` : u.role}</td>
                               <td className="px-8 py-6 text-center">
                                  <div className="flex justify-center gap-3">
                                     <button onClick={() => { setEditingUser(u); setIsRegistering(true); }} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={16}/></button>
                                     <button onClick={() => deleteUser(u.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
             )}
          </div>
        );
      case 'finances':
        return (
          <div className="space-y-8 animate-in">
             <h2 className="text-3xl font-black">{t('financials')}</h2>
             <div className="bg-white dark:bg-slate-800 admin-card overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Student Name</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 text-right">Paid</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {users.filter(u => u.role === 'STUDENT').map(u => {
                       const balance = (u.totalFee || 1000) - (u.paidAmount || 0);
                       return (
                        <tr key={u.id} className={balance > 0 ? 'bg-rose-50/20' : ''}>
                          <td className="px-8 py-6 font-bold">{u.name} <span className="text-[10px] block text-slate-400">{u.id}</span></td>
                          <td className="px-8 py-6 text-right font-black text-emerald-600">${u.paidAmount}</td>
                          <td className={`px-8 py-6 text-right font-black ${balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>${balance}</td>
                        </tr>
                       )
                    })}
                  </tbody>
                </table>
             </div>
          </div>
        );
      default: return null;
    }
  };

  if (!user) return (
    <div className="login-page-wrapper bg-[#1a1f2b]">
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in">
          <div className="text-center mb-10">
            <School size={32} className="text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-slate-900">.tayo School</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] mt-2">{t('portal')}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input placeholder={t('identity_id')} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-black font-bold" value={loginForm.id} onChange={e => setLoginForm({...loginForm, id: e.target.value})} required />
            <input type="password" placeholder={t('password')} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-black font-bold" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required />
            <button className="w-full bg-[#1a1f2b] text-white font-black py-5 rounded-2xl shadow-xl">Login Now</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {user.role === 'ADMIN' ? (
        <div className="flex">
          <div className="w-64 bg-[#1a1f2b] h-screen fixed left-0 top-0 flex flex-col text-slate-400">
            <div className="p-8 flex items-center gap-3 border-b border-slate-800">
              <School size={24} className="text-indigo-600" />
              <span className="text-xl font-black text-white">.tayo Admin</span>
            </div>
            <div className="flex-1 py-10 px-4 space-y-2">
              {ADMIN_SIDEBAR_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-slate-800'}`}>
                   {item.icon}<span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="p-8 flex items-center gap-3 text-rose-400 font-bold"><LogOut size={20}/> Logout</button>
          </div>
          <main className="ml-64 flex-1 p-12 overflow-y-auto"><AdminContent /></main>
        </div>
      ) : (
        <div className="max-w-md mx-auto min-h-screen pb-32 px-6 pt-24 overflow-x-hidden">
          <div className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 border-b ${theme === 'dark' ? 'bg-[#1a1f2b] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-2"><School className="text-indigo-600" size={18} /><span className="font-black text-sm">.tayo School</span></div>
            {(mobileTab !== 'home' || mobileSubPage) && <button onClick={() => { setMobileSubPage(null); setMobileTab('home'); }} className="p-2"><ArrowLeft size={20}/></button>}
          </div>
          
          <div className="animate-in pt-4 space-y-8">
            {mobileTab === 'settings' ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center">
                   <img src={user.avatar} className="w-24 h-24 rounded-3xl mb-4" />
                   <h3 className="text-2xl font-black">{user.name}</h3>
                   <div className="w-full mt-10 space-y-4">
                      <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl items-center">
                        <span className="font-black">Language</span>
                        <button onClick={() => setLanguage(language === 'en' ? 'so' : 'en')} className="text-indigo-600 font-black">{t('switch_lang')}</button>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl items-center">
                        <span className="font-black">Appearance</span>
                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-indigo-600 font-black">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</button>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-black tracking-tighter">Hi, {user.name.split(' ')[0]}</h2>
                   <Megaphone className="text-indigo-600" size={24}/>
                </div>
                <div className="grid grid-cols-2 gap-5">
                   {(user.role === 'TEACHER' ? TEACHER_MOBILE_HOME_ICONS : STUDENT_MOBILE_HOME_ICONS).map(icon => (
                     <button key={icon.id} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 shadow-xl flex flex-col items-center gap-4">
                        <div className={`${icon.color} p-5 rounded-[1.5rem] text-white shadow-lg`}>{icon.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{icon.label}</span>
                     </button>
                   ))}
                </div>
              </>
            )}
          </div>

          <div className={`fixed bottom-0 left-0 right-0 h-20 flex justify-around items-center px-4 z-50 border-t ${theme === 'dark' ? 'bg-[#1a1f2b] border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-100 shadow-sm shadow-slate-200/50'}`}>
            {MOBILE_BOTTOM_NAV.map(item => (
              <button key={item.id} onClick={() => setMobileTab(item.id)} className={`flex flex-col items-center gap-1 w-16 ${mobileTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                {item.icon}<span className="text-[9px] font-black uppercase tracking-tight">{translations[language][item.id as keyof typeof translations.en] || item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
