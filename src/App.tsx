import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  CreditCard, 
  Settings, 
  Menu, 
  X, 
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  FileText,
  DollarSign,
  UserPlus,
  Filter,
  Download,
  MoreVertical,
  Activity,
  Heart,
  Droplets,
  Thermometer
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// Types
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  email: string;
  bloodGroup: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  type: 'General' | 'Checkup' | 'Surgery' | 'Emergency';
  status: 'Confirmed' | 'Pending' | 'Completed';
}

interface Billing {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  service: string;
}

// Initial Mock Data
const INITIAL_PATIENTS: Patient[] = [
  { id: '1', name: 'John Doe', age: 45, gender: 'Male', phone: '555-0101', lastVisit: '2023-10-15', status: 'Active', email: 'john@example.com', bloodGroup: 'O+' },
  { id: '2', name: 'Sarah Smith', age: 32, gender: 'Female', phone: '555-0102', lastVisit: '2023-10-20', status: 'Active', email: 'sarah@example.com', bloodGroup: 'A-' },
  { id: '3', name: 'Michael Brown', age: 28, gender: 'Male', phone: '555-0103', lastVisit: '2023-09-12', status: 'Inactive', email: 'michael@example.com', bloodGroup: 'B+' },
  { id: '4', name: 'Emily Davis', age: 54, gender: 'Female', phone: '555-0104', lastVisit: '2023-10-24', status: 'Active', email: 'emily@example.com', bloodGroup: 'AB+' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'John Doe', doctor: 'Dr. Sarah Wilson', date: '2023-10-25', time: '09:00 AM', type: 'General', status: 'Confirmed' },
  { id: '2', patientId: '2', patientName: 'Sarah Smith', doctor: 'Dr. James Lee', date: '2023-10-25', time: '10:30 AM', type: 'Checkup', status: 'Pending' },
  { id: '3', patientId: '4', patientName: 'Emily Davis', doctor: 'Dr. Sarah Wilson', date: '2023-10-25', time: '11:45 AM', type: 'General', status: 'Confirmed' },
];

const INITIAL_BILLING: Billing[] = [
  { id: 'INV-1024', patientId: '1', patientName: 'John Doe', amount: 150.00, date: '2023-10-15', status: 'Paid', service: 'Consultation' },
  { id: 'INV-1025', patientId: '2', patientName: 'Sarah Smith', amount: 250.00, date: '2023-10-20', status: 'Unpaid', service: 'Lab Test' },
  { id: 'INV-1026', patientId: '4', patientName: 'Emily Davis', amount: 450.00, date: '2023-10-24', status: 'Overdue', service: 'Diagnostic Scan' },
];

const REVENUE_DATA = [
  { name: 'Mon', amount: 2400, patients: 12 },
  { name: 'Tue', amount: 1398, patients: 8 },
  { name: 'Wed', amount: 9800, patients: 24 },
  { name: 'Thu', amount: 3908, patients: 15 },
  { name: 'Fri', amount: 4800, patients: 18 },
  { name: 'Sat', amount: 3800, patients: 10 },
  { name: 'Sun', amount: 4300, patients: 14 },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'clinical', icon: Stethoscope, label: 'Clinical' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'ai-insights', icon: BrainCircuit, label: 'AI Health Hub' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">MediCare Pro</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-6 space-y-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Clinic Status</p>
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 w-full transition-colors">
          <Settings size={20} />
          Settings
        </button>
      </div>
    </aside>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">{title.replace('-', ' ')}</h1>
      <span className="text-slate-300">|</span>
      <p className="text-sm text-slate-500 font-medium">Monday, Oct 25, 2023</p>
    </div>
    <div className="flex items-center gap-6">
      <div className="relative hidden lg:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search patient, ID, records..." 
          className="pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-full w-80 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Activity size={20} />
        </button>
      </div>
      <div className="flex items-center gap-3 border-l pl-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">Dr. Sarah Wilson</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Medical Director</p>
        </div>
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1a37aaa5-eb4e-4afd-a788-f1153d147ea2/doctor-avatar-1-7faa5c54-1772251835840.webp" 
          alt="Avatar" 
          className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50 ring-offset-1"
        />
      </div>
    </div>
  </header>
);

const StatCard = ({ title, value, trend, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-semibold">{title}</h3>
    <div className="flex items-baseline gap-2 mt-1">
      <p className="text-2xl font-black text-slate-800">{value}</p>
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
    </div>
  </div>
);

// --- View: Dashboard ---
const DashboardHome = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="1,284" trend={12} icon={Users} color="bg-blue-600" subtext="+48 this week" />
        <StatCard title="Today's Appointments" value="18" trend={-5} icon={Calendar} color="bg-purple-600" subtext="6 remaining" />
        <StatCard title="Monthly Revenue" value="$42,500" trend={8} icon={DollarSign} color="bg-emerald-600" subtext="Goal: 95%" />
        <StatCard title="Avg Consultation" value="24m" trend={2} icon={Clock} color="bg-orange-600" subtext="-1m from last mo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Revenue Performance</h3>
              <p className="text-sm text-slate-400">Comparison of income vs patient visits</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold bg-slate-50 text-slate-500 rounded-md hover:bg-slate-100">D</button>
              <button className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-md">W</button>
              <button className="px-3 py-1 text-xs font-bold bg-slate-50 text-slate-500 rounded-md hover:bg-slate-100">M</button>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="patients" stroke="#9333ea" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Schedule</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-bold">View All</button>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {INITIAL_APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black">
                    {apt.patientName.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    apt.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{apt.patientName}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-tighter">{apt.type}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {apt.time}</span>
                  </div>
                </div>
                <button className="p-2 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-4 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
            <Plus size={20} />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

// --- View: Patients ---
const PatientsView = () => {
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Patient Directory</h2>
          <p className="text-slate-500 font-medium mt-1">Manage health records for 1,284 patients</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={20} />
          </button>
          <button 
            onClick={() => toast.info('Registration module initializing...')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <UserPlus size={20} />
            Add Patient
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Profile</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Info</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Details</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Last Activity</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 shadow-inner">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base">{p.name}</p>
                        <p className="text-xs text-slate-500 font-medium">#{p.id.padStart(5, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase">{p.bloodGroup}</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">{p.gender}</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">{p.age}Y</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-700">{p.phone}</p>
                    <p className="text-xs text-slate-400 font-medium">{p.email}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{p.lastVisit}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${
                      p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                        <FileText size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                        <Settings size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- View: Clinical (Consultation) ---
const ClinicalView = () => {
  const [note, setNote] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAiAnalyze = () => {
    if (!note || note.length < 10) {
      toast.error("Enter more detailed notes for AI analysis");
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiSuggestions([
        "Potential diagnosis: Chronic migraine based on described sensitivity",
        "Clinical Alert: Patient's BP is trending high (138/88)",
        "Plan: Initiate Magnesium supplementation 400mg daily",
        "Recommended: MRI Head to rule out secondary causes if symptoms persist",
        "Billing Note: Code 99214 appropriate for complexity"
      ]);
      setIsAnalyzing(false);
      toast.success("Health Insights Generated");
    }, 1500);
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             {/* Decorative Background Icon */}
            <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] rotate-12">
              <Stethoscope size={200} />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
                  <Activity size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Consultation Room</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-500 font-bold">John Doe</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs text-blue-600 font-black uppercase tracking-widest">Active Session</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex gap-4">
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-lg font-bold text-slate-800">12:45</p>
                 </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-rose-500 mb-2">
                    <Heart size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">BPM</p>
                  </div>
                  <input type="text" defaultValue="72" className="w-full bg-transparent text-xl font-bold outline-none" />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-blue-500 mb-2">
                    <Droplets size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">BP</p>
                  </div>
                  <input type="text" defaultValue="120/80" className="w-full bg-transparent text-xl font-bold outline-none" />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Thermometer size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Temp</p>
                  </div>
                  <input type="text" defaultValue="98.6" className="w-full bg-transparent text-xl font-bold outline-none" />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-500 mb-2">
                    <Activity size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">SpO2</p>
                  </div>
                  <input type="text" defaultValue="98%" className="w-full bg-transparent text-xl font-bold outline-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Impressions & Findings</label>
                   <div className="flex gap-2">
                     <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors"><MoreVertical size={14}/></button>
                   </div>
                </div>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe patient condition, medications, and examination results..."
                  className="w-full h-56 p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-700 font-medium leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={handleAiAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-slate-200 group"
                >
                  {isAnalyzing ? (
                    <Clock className="animate-spin" size={18} />
                  ) : (
                    <BrainCircuit size={18} className="group-hover:scale-125 transition-transform" />
                  )}
                  {isAnalyzing ? "Processing..." : "Run AI Diagnostic Assistant"}
                </button>
                <button className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Finalize & Bill Visit
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
              <FileText className="text-slate-400" size={20} />
              Recent History Summaries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors">
                  <div className="p-3 bg-white rounded-xl h-fit shadow-sm">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-slate-800">Visit Sept 12, 2023</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase">Resolved</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Upper respiratory tract infection. High fever and congestion. Course of Amoxicillin 500mg completed.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={false}
            animate={{ scale: aiSuggestions.length > 0 ? 1 : 0.98 }}
            className={`p-7 rounded-3xl border transition-all duration-500 ${
              aiSuggestions.length > 0 
                ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-transparent shadow-xl shadow-indigo-200' 
                : 'bg-white text-slate-400 border-slate-100'
            }`}
          >
            <div className={`flex items-center gap-3 mb-6 ${aiSuggestions.length > 0 ? 'text-white' : 'text-slate-500'}`}>
              <div className={`p-2 rounded-xl ${aiSuggestions.length > 0 ? 'bg-white/20' : 'bg-slate-100'}`}>
                <BrainCircuit size={20} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em]">Medi-AI Lab</h3>
            </div>
            
            {aiSuggestions.length > 0 ? (
              <div className="space-y-4">
                {aiSuggestions.map((s, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex gap-3 items-start group"
                  >
                    <div className="mt-1.5 p-0.5 bg-indigo-400/30 rounded flex-shrink-0">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <p className="text-xs font-medium leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">{s}</p>
                  </motion.div>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10">
                   <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                     Export Analysis Report <ArrowUpRight size={14} />
                   </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                   <Clock size={20} className="text-slate-300" />
                </div>
                <p className="text-[11px] font-bold leading-relaxed px-4">
                  Awaiting consultation notes to generate real-time diagnostic insights...
                </p>
              </div>
            )}
          </motion.div>

          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-6 uppercase tracking-widest text-[10px]">Upcoming Tests</h3>
            <div className="space-y-4">
               {[
                 { test: 'Full Blood Count', status: 'Pending Lab', color: 'bg-amber-100 text-amber-700' },
                 { test: 'X-Ray Thorax', status: 'Scheduled', color: 'bg-blue-100 text-blue-700' }
               ].map((t, i) => (
                 <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-800 mb-1">{t.test}</p>
                   <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${t.color}`}>
                     {t.status}
                   </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Billing ---
const BillingView = () => {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Financial Hub</h2>
          <p className="text-slate-500 font-medium mt-1">Manage billing, claims, and revenue cycle</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={20} />
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            <Plus size={20} />
            New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Outstanding</p>
            <p className="text-2xl font-black text-slate-800">$12,450.00</p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Collected (MTD)</p>
            <p className="text-2xl font-black text-slate-800">$32,180.00</p>
          </div>
        </div>
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Overdue Claims</p>
            <p className="text-2xl font-black text-slate-800">$4,120.00</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Service Description</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Net Amount</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Date Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_BILLING.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-blue-600 text-sm">{bill.id}</td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{bill.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Reg User</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                      <p className="text-sm font-medium text-slate-600">{bill.service}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-800 text-lg">${bill.amount.toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                      bill.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-medium text-slate-500 text-sm">{bill.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome />;
      case 'patients': return <PatientsView />;
      case 'clinical': return <ClinicalView />;
      case 'billing': return <BillingView />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
            <Activity size={48} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 capitalize">{activeTab} Module</h2>
          <p className="text-slate-500 max-w-sm font-medium">This module is currently being optimized for clinical workflows. Check back in a few moments.</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Sidebar - Desktop */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen transition-all">
        <Header title={activeTab} />
        
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav Trigger */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] md:hidden p-8 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Stethoscope size={20} />
                  </div>
                  <span className="text-2xl font-black tracking-tight">MediCare Pro</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {['dashboard', 'patients', 'appointments', 'clinical', 'billing', 'ai-insights'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left text-2xl font-black py-4 px-4 rounded-2xl transition-all capitalize ${
                      activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-8 border-t border-slate-100">
                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <img 
                      src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1a37aaa5-eb4e-4afd-a788-f1153d147ea2/doctor-avatar-1-7faa5c54-1772251835840.webp" 
                      className="w-12 h-12 rounded-full object-cover"
                      alt="Profile"
                    />
                    <div>
                      <p className="font-black text-slate-800">Dr. Sarah Wilson</p>
                      <p className="text-xs font-bold text-blue-600">Chief Physician</p>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}