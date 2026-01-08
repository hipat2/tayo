
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, UserRole, Announcement, ActivityLogEntry, CompetitionQuestion, BlacklistRequest } from './types';
import { 
  Users, 
  TrendingUp, 
  Megaphone,
  Star,
  Clock,
  School,
  UserPlus,
  LogOut,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Wallet,
  AlertTriangle,
  Check,
  X as XIcon,
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Search,
  ChevronRight
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

// --- Sample Data Helpers ---
const B_NAMES = ["Guuleed", "Liibaan", "Axmed", "Maxamed", "Caydiid", "Warsame", "Faarax", "Barkhad", "Xasan", "Cali", "Cumar", "Cabdi", "Jaamac", "Yuusuf", "Ibraahim", "Ismaaciil", "Muuse", "Ciise", "Yaxye", "Sakariye", "Cabdiraxmaan", "Cabdiraxiin", "Cabdiweli", "Cabdicasiis", "Cabdiladiif"];
const G_NAMES = ["Hodan", "Caasho", "Sahra", "Hibaaq", "Maryan", "Deeqa", "Xaliimo", "Luul", "Safiya", "Samsam", "Idil", "Ubax", "Fardowsa", "Xaawo", "Khadra", "Amina", "Shukri", "Nasiibo", "Muna", "Ruqiya", "Foosiya", "Hibo", "Layla", "Samiira", "Sumaya"];

const generateInitialUsers = (): User[] => {
  const admin: User = { id: 'admin', name: 'Super Admin', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' };
  const teacher: User = { id: 'T001', name: 'Prof. Ahmed', role: 'TEACHER', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher', studentPhone: '+252 61 111 2233' };
  const users: User[] = [admin, teacher];
  
  // 50 Students (25 Boys, 25 Girls)
  B_NAMES.forEach((name, i) => {
    const idNum = i + 1;
    const id = `S${String(idNum).padStart(3, '0')}`;
    const grade = 5 + (i % 8);
    users.push({
      id,
      name: `${name} Jaamac`,
      role: 'STUDENT',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      paidAmount: Math.floor(Math.random() * 1000),
      totalFee: 1000,
      isBlacklisted: false,
      studentPhone: `+252 61 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      age: String(grade + 5), // Rough grade mapping
      dob: `20${String(15 - (i % 5)).padStart(2, '0')}-01-01`,
      paymentRef: `REF-${10000 + i}`
    });
  });

  G_NAMES.forEach((name, i) => {
    const idNum = i + 26;
    const id = `S${String(idNum).padStart(3, '0')}`;
    const grade = 5 + (i % 8);
    users.push({
      id,
      name: `${name} Warsame`,
      role: 'STUDENT',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      paidAmount: Math.floor(Math.random() * 1000),
      totalFee: 1000,
      isBlacklisted: false,
      studentPhone: `+252 61 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      age: String(grade + 5),
      dob: `20${String(15 - (i % 5)).padStart(2, '0')}-01-01`,
      paymentRef: `REF-${20000 + i}`
    });
  });

  return users;
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
  const [searchQuery, setSearchQuery] = useState('');

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
      setError('Invalid ID or Password (Hint: ID=admin/S001, Pass=123)');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginForm({ id: '', password: '' });
  };

  const generateAutoId = (role: UserRole) => {
    const prefix = role === 'STUDENT' ? 'S' : role === 'TEACHER' ? 'T' : 'A';
    const roleUsers = users.filter(u => u.role === role);
    const maxNum = roleUsers.reduce((max, u) => {
      const numPart = u.id.match(/\d+/);
      const num = numPart ? parseInt(numPart[0]) : 0;
      return Math.max(max, num);
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const role = formData.get('role') as UserRole || editingUser?.role;
    
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
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
      setUsers(prev => [...prev, newUser]);
    }
    setIsRegistering(false);
  };

  const deleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to remove this user from the directory?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const startEdit = (u: User) => {
    setEditingUser(u);
    setIsRegistering(true);
  };

  const t = (key: keyof typeof translations.en) => translations[language][key];

  const stats = useMemo(() => {
    const students = users.filter(u => u.role === 'STUDENT');
    const teachers = users.filter(u => u.role === 'TEACHER');
    const revenue = students.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    const unpaid = students.reduce((acc, curr) => acc + ((curr.totalFee || 1000) - (curr.paidAmount || 0)), 0);
    return { students: students.length, teachers: teachers.length, revenue, unpaid };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

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
                   <span className="text-sm font-black text-slate-600 dark:text-slate-300">{new Date().toLocaleDateString()}</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: t('students'), value: stats.students, icon: <Users />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: t('teachers'), value: stats.teachers, icon: <GraduationCap />, color: 'text-violet-600', bg: 'bg-violet-50' },
                  { label: t('revenue'), value: `$${stats.revenue.toLocaleString()}`, icon: <Wallet />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: t('unpaid'), value: `$${stats.unpaid.toLocaleString()}`, icon: <AlertTriangle />, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-8 admin-card hover:-translate-y-2 transition-all">
                     <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8`}>{stat.icon}</div>
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                     <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                ))}
             </div>
             
             <div className="bg-white dark:bg-slate-800 p-12 admin-card relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-10">
                     <h3 className="text-2xl font-black tracking-tight">{t('school_goal')}</h3>
                     <span className="text-5xl font-black text-indigo-600">71%</span>
                  </div>
                  <div className="h-5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-1 shadow-inner">
                     <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 w-[71%] rounded-full shadow-lg"></div>
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 opacity-5 dark:opacity-10 rotate-12">
                   <TrendingUp size={300} />
                </div>
             </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-8 animate-in max-w-6xl mx-auto">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-black tracking-tight">{isRegistering ? (editingUser ? 'Update Identity' : 'Enroll New Identity') : 'User Directory'}</h2>
                {!isRegistering && (
                  <button onClick={() => { setIsRegistering(true); setEditingUser(null); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:bg-indigo-700 transition-all">
                    <Plus size={20} /> Register New
                  </button>
                )}
             </div>

             {isRegistering ? (
               <div className="bg-white dark:bg-slate-800 p-10 admin-card mobile-form-container">
                  <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => { setIsRegistering(false); setEditingUser(null); }} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em]">Profile Configuration</p>
                      <p className="text-xl font-black">{editingUser ? `Editing: ${editingUser.name}` : 'New Enrollment Form'}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSaveUser} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                       {[
                         { name: 'name', label: 'Full Legal Name', defaultValue: editingUser?.name, placeholder: 'e.g. Caasho Xasan' },
                         { name: 'studentPhone', label: 'Mobile Number', defaultValue: editingUser?.studentPhone, placeholder: '+252 61 --- ----' },
                         { name: 'parentPhone', label: 'Guardian Phone', defaultValue: editingUser?.parentPhone, placeholder: '+252 61 --- ----' },
                         { name: 'age', label: 'Age / Class', defaultValue: editingUser?.age, placeholder: 'e.g. 15' },
                         { name: 'placeOfBirth', label: 'Birth Place', defaultValue: editingUser?.placeOfBirth, placeholder: 'Mogadishu' },
                         { name: 'dob', label: 'Date of Birth', type: 'date', defaultValue: editingUser?.dob },
                         { name: 'paymentRef', label: 'Bank Account Ref', defaultValue: editingUser?.paymentRef, placeholder: 'ACC-XXXXX' },
                       ].map(f => (
                         <div key={f.name} className="space-y-2 group">
                            <label className="text-[11px] font-black uppercase text-slate-400 group-focus-within:text-indigo-500 transition-colors tracking-widest">{f.label}</label>
                            <input 
                              name={f.name} 
                              type={f.type || 'text'} 
                              defaultValue={f.defaultValue} 
                              placeholder={f.placeholder}
                              required 
                              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-black font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                            />
                         </div>
                       ))}
                       
                       {!editingUser && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Access Identity</label>
                          <select name="role" className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-black font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all">
                             <option value="STUDENT">Student Tier</option>
                             <option value="TEACHER">Faculty Tier</option>
                          </select>
                        </div>
                       )}
                    </div>
                    
                    <div className="flex gap-4 pt-6">
                      <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                         <Check size={20} /> {editingUser ? 'Save Updates' : 'Complete Registration'}
                      </button>
                      <button type="button" onClick={() => { setIsRegistering(false); setEditingUser(null); }} className="px-10 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
               </div>
             ) : (
               <div className="bg-white dark:bg-slate-800 admin-card overflow-hidden">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/30">
                     <Search size={20} className="text-slate-400" />
                     <input 
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       placeholder="Search by name, ID or role..." 
                       className="bg-transparent border-none text-black font-bold focus:ring-0 w-full placeholder:text-slate-400" 
                     />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-100 dark:bg-slate-900/80">
                          <tr>
                             <th className="px-8 py-6 text-[11px] font-black uppercase text-slate-500 tracking-widest">Identity Profile</th>
                             <th className="px-8 py-6 text-[11px] font-black uppercase text-slate-500 tracking-widest">Phone Number</th>
                             <th className="px-8 py-6 text-[11px] font-black uppercase text-slate-500 tracking-widest">Age / Class</th>
                             <th className="px-8 py-6 text-[11px] font-black uppercase text-slate-500 tracking-widest text-center">Manage</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <img src={u.avatar} className="w-12 h-12 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm" alt={u.name} />
                                     <div>
                                        <p className="font-black text-slate-900 dark:text-white leading-none mb-1">{u.name}</p>
                                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{u.id} • {u.role}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{u.studentPhone || 'No Phone Registered'}</td>
                               <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-slate-400">{u.role === 'STUDENT' ? `${u.age} yrs` : 'Faculty'}</td>
                               <td className="px-8 py-6 text-center">
                                  <div className="flex justify-center gap-2">
                                     <button onClick={() => startEdit(u)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit2 size={16}/></button>
                                     <button onClick={() => deleteUser(u.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <div className="p-20 text-center">
                        <Users size={64} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black">No identities found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
               </div>
             )}
          </div>
        );
      case 'finances':
        return (
          <div className="space-y-8 animate-in">
             <div className="flex justify-between items-center">
               <h2 className="text-3xl font-black">{t('financials')}</h2>
               <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 border border-emerald-100">
                 <Wallet size={18} /> Budget Performance: 71%
               </div>
             </div>
             
             <div className="bg-white dark:bg-slate-800 admin-card overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Profile</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Tuition Paid</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {users.filter(u => u.role === 'STUDENT').map(u => {
                       const balance = (u.totalFee || 1000) - (u.paidAmount || 0);
                       return (
                        <tr key={u.id} className={`${balance > 0 ? 'bg-rose-50/10' : ''} hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}>
                          <td className="px-8 py-6 font-bold flex items-center gap-3">
                            <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-100" alt={u.name} />
                            <div>
                               <p className="text-slate-900 dark:text-white leading-none mb-1">{u.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.id}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-emerald-600">${u.paidAmount?.toLocaleString()}</td>
                          <td className={`px-8 py-6 text-right font-black ${balance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>${balance?.toLocaleString()}</td>
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full -ml-48 -mb-48 animate-pulse delay-1000"></div>

        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-600/30">
              <School size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">.tayo School</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] mt-2 tracking-widest">{t('portal')}</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity ID</label>
              <input 
                placeholder="ID (e.g. admin, S001)" 
                className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 text-black font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-300" 
                value={loginForm.id} 
                onChange={e => setLoginForm({...loginForm, id: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Access Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 text-black font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-300" 
                value={loginForm.password} 
                onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
                required 
              />
            </div>
            {error && <p className="text-rose-500 text-xs font-black text-center bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}
            <button className="w-full bg-[#1a1f2b] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
              {t('login_now')} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <button onClick={() => setLanguage(language === 'en' ? 'so' : 'en')} className="text-xs font-black uppercase text-indigo-600 flex items-center gap-2 mx-auto hover:text-indigo-700 transition-colors">
              <Globe size={14} /> {language === 'en' ? 'U beddel Soomaali' : 'Switch to English'}
            </button>
          </div>
        </div>
        <p className="mt-8 text-white/20 text-[9px] font-bold uppercase tracking-[0.4em]">Secure Enterprise Protocol v4.0</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-500`}>
      {user.role === 'ADMIN' ? (
        <div className="flex">
          <div className="w-64 bg-[#1a1f2b] h-screen fixed left-0 top-0 flex flex-col text-slate-400 shadow-2xl shadow-black/50 z-50">
            <div className="p-8 flex items-center gap-3 border-b border-slate-800 bg-[#161a25]">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                <School size={24} />
              </div>
              <span className="text-xl font-black text-white tracking-tighter">.tayo <span className="text-indigo-400">Admin</span></span>
            </div>
            
            <div className="flex-1 py-10 px-4 space-y-2 overflow-y-auto custom-scroll">
              <p className="px-4 text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] mb-4">Operations Console</p>
              {ADMIN_SIDEBAR_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                   <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                   <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-6 bg-[#161a25] border-t border-slate-800">
               <div className="flex items-center gap-3 mb-6 px-2">
                 <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-slate-800" alt={user.name} />
                 <div className="overflow-hidden">
                    <p className="text-sm font-black text-white truncate leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin Control</p>
                 </div>
               </div>
               <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 text-rose-400 bg-rose-900/10 border border-rose-900/20 rounded-2xl transition-all font-black text-xs uppercase tracking-widest hover:bg-rose-900/20">
                 <LogOut size={16}/> Logout
               </button>
            </div>
          </div>
          <main className="ml-64 flex-1 p-12 overflow-y-auto min-h-screen relative">
            <AdminContent />
          </main>
        </div>
      ) : (
        <div className="max-w-md mx-auto min-h-screen pb-32 px-6 pt-24 overflow-x-hidden">
          <div className={`fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-50 border-b backdrop-blur-md transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white/80 border-slate-100 shadow-sm shadow-slate-200/50'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                <School size={20} />
              </div>
              <span className="font-black text-base tracking-tighter uppercase">.tayo <span className="text-indigo-600">School</span></span>
            </div>
            {(mobileTab !== 'home' || mobileSubPage) && (
              <button 
                onClick={() => { setMobileSubPage(null); setMobileTab('home'); }} 
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft size={20}/>
              </button>
            )}
          </div>
          
          <div className="animate-in pt-4 space-y-10">
            {mobileTab === 'settings' ? (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-slate-700 flex flex-col items-center">
                   <div className="relative mb-6">
                      <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] border-4 border-indigo-600/10 shadow-xl" alt={user.name} />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center text-white">
                         <Star size={18} fill="currentColor" />
                      </div>
                   </div>
                   <h3 className="text-2xl font-black tracking-tight">{user.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 mb-10">{user.role} Tier Access</p>
                   
                   <div className="w-full space-y-4">
                      <div className="flex justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl items-center group active:scale-95 transition-all">
                        <div className="flex items-center gap-4">
                          <Globe className="text-indigo-600" size={20} />
                          <span className="font-black text-sm">{t('language')}</span>
                        </div>
                        <button onClick={() => setLanguage(language === 'en' ? 'so' : 'en')} className="text-indigo-600 font-black text-xs uppercase underline tracking-widest">{t('switch_lang')}</button>
                      </div>
                      <div className="flex justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl items-center group active:scale-95 transition-all">
                        <div className="flex items-center gap-4">
                          {theme === 'light' ? <Sun className="text-amber-500" size={20} /> : <Moon className="text-indigo-400" size={20} />}
                          <span className="font-black text-sm">{t('appearance')}</span>
                        </div>
                        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-indigo-600 font-black text-xs uppercase underline tracking-widest">{theme === 'light' ? 'Go Dark' : 'Go Light'}</button>
                      </div>
                      
                      <button onClick={handleLogout} className="w-full flex justify-between items-center p-6 bg-rose-50 dark:bg-rose-900/10 rounded-3xl text-rose-600 font-black text-xs uppercase tracking-[0.2em] mt-8 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/20">
                         {t('sign_out')} <LogOut size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2">
                   <div>
                      <h2 className="text-4xl font-black tracking-tighter">War, {user.name.split(' ')[0]}</h2>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-2">Operational Health: Optimum</p>
                   </div>
                   <div className="bg-indigo-600/10 p-5 rounded-[2rem] text-indigo-600 shadow-xl shadow-indigo-600/5 animate-bounce-soft">
                     <Megaphone size={28}/>
                   </div>
                </div>

                {user.role === 'STUDENT' && user.isBlacklisted && (
                  <div className="bg-rose-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-rose-900/30 flex gap-6 items-start border border-white/20 animate-pulse">
                     <AlertTriangle size={32} className="shrink-0 mt-1" />
                     <p className="text-sm font-black leading-relaxed">{t('blacklist_banner')}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                   {(user.role === 'TEACHER' ? TEACHER_MOBILE_HOME_ICONS : STUDENT_MOBILE_HOME_ICONS).map(icon => (
                     <button key={icon.id} onClick={() => setMobileSubPage(icon.id)} className="p-8 rounded-[3rem] bg-white dark:bg-slate-800 shadow-2xl border border-slate-50 dark:border-slate-700 flex flex-col items-center gap-6 group active:scale-90 transition-all">
                        <div className={`${icon.color} p-6 rounded-[2rem] text-white shadow-xl shadow-black/10 group-hover:scale-110 transition-transform`}>{icon.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{icon.label}</span>
                     </button>
                   ))}
                </div>
              </>
            )}
          </div>

          <div className={`fixed bottom-0 left-0 right-0 h-24 flex justify-around items-center px-6 z-50 border-t backdrop-blur-md transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 shadow-[0_-15px_50px_rgba(0,0,0,0.6)]' : 'bg-white/80 border-slate-100 shadow-[0_-15px_50px_rgba(0,0,0,0.05)]'}`}>
            {MOBILE_BOTTOM_NAV.map(item => {
              const isActive = mobileTab === item.id && !mobileSubPage;
              return (
                <button key={item.id} onClick={() => { setMobileTab(item.id); setMobileSubPage(null); }} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
                  <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-indigo-600/10' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight">{translations[language][item.id as keyof typeof translations.en] || item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
