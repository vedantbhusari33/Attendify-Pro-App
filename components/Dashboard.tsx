
import React, { useMemo, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  UserCheck, 
  UserX, 
  Users, 
  Download, 
  Calendar, 
  Sparkles,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../types';
import { generateAttendanceInsights } from '../services/geminiService';

interface Props {
  records: AttendanceRecord[];
  students: Student[];
  onExport: () => void;
}

const Dashboard: React.FC<Props> = ({ records, students, onExport }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const stats = useMemo(() => {
    const today = '2026-02-10';
    const todayRecords = records.filter(r => r.date === today);
    const present = todayRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const absent = todayRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    const percentage = students.length > 0 ? (present / students.length) * 100 : 0;

    return {
      total: students.length,
      present,
      absent,
      percentage: percentage.toFixed(1)
    };
  }, [records, students]);

  const pieData = [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
    { name: 'Unmarked', value: Math.max(0, stats.total - stats.present - stats.absent), color: '#64748b' }
  ];

  const barData = useMemo(() => {
    const classes = Array.from(new Set(students.map(s => s.className)));
    return classes.map(cls => {
      const classStudents = students.filter(s => s.className === cls);
      const classToday = records.filter(r => r.className === cls && r.date === '2026-02-10');
      const present = classToday.filter(r => r.status === AttendanceStatus.PRESENT).length;
      return { name: cls, present, total: classStudents.length };
    });
  }, [records, students]);

  const handleGenerateAiReport = async () => {
    setIsAiLoading(true);
    const report = await generateAttendanceInsights(records, students);
    setAiReport(report);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Analytics Suite</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time Excel sync active</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-xs font-medium border border-slate-700">
            <Calendar size={16} />
            <span>Feb 10, 2026</span>
          </button>
          <button 
            onClick={onExport}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-xs font-bold"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards - Grid Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats.total.toString()} icon={<Users className="text-blue-400" />} trend="+2 this month" />
        <StatCard title="Present Today" value={stats.present.toString()} icon={<UserCheck className="text-emerald-400" />} trend="Live Update" />
        <StatCard title="Absent Today" value={stats.absent.toString()} icon={<UserX className="text-rose-400" />} trend="Requires follow-up" />
        <StatCard title="Rate" value={`${stats.percentage}%`} icon={<TrendingUp className="text-amber-400" />} trend="Current" />
      </div>

      {/* Charts Row - Stacked on Mobile */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 glass-card p-4 md:p-6">
          <h3 className="text-sm font-semibold mb-6 flex items-center justify-between uppercase tracking-wider text-slate-400">
            Status Distribution
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-500">Live</span>
          </h3>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#f1f5f9' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 glass-card p-4 md:p-6">
          <h3 className="text-sm font-semibold mb-6 flex items-center justify-between uppercase tracking-wider text-slate-400">
            Class Breakdown
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-500">Compare</span>
          </h3>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI & History Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 glass-card p-4 md:p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
             <h3 className="text-sm font-bold flex items-center uppercase tracking-widest text-blue-400">
              <Sparkles className="mr-2" size={18} />
              AI Intelligence
            </h3>
            <button 
              onClick={handleGenerateAiReport}
              disabled={isAiLoading}
              className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold hover:bg-blue-500/20 active:scale-95 transition-all flex items-center space-x-2"
            >
              {isAiLoading ? <RefreshCw className="animate-spin" size={12} /> : <RefreshCw size={12} />}
              <span>{isAiLoading ? 'GENERATING...' : 'REFRESH INSIGHTS'}</span>
            </button>
          </div>
          
          <div className="bg-slate-900/40 rounded-xl p-4 md:p-6 border border-slate-800/50 min-h-[150px]">
            {aiReport ? (
              <div className="prose prose-invert max-w-none text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                {aiReport}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[150px] text-slate-500 text-center">
                <Sparkles size={32} className="mb-2 opacity-10" />
                <p className="text-[11px]">Generate executive summary from Excel datasets</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3 glass-card p-4 md:p-6">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-slate-500">Export Log</h3>
          <div className="space-y-3">
            <HistoryItem date="2026-02-10" file="Daily_Log_v3.xlsx" />
            <HistoryItem date="2026-02-09" file="Students_Final.xlsx" />
            <HistoryItem date="2026-02-08" file="Attendance_Trend.xlsx" />
          </div>
          <button className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold transition-colors">
            ACCESS ALL FILES
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: string }> = ({ title, value, icon, trend }) => (
  <div className="glass-card p-4 hover:bg-slate-800/80 transition-all duration-300 group touch-manipulation">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2.5 bg-slate-950 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-slate-950 px-2 py-1 rounded">
        Active
      </span>
    </div>
    <div>
      <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h4>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
      </div>
      <p className="text-[10px] text-slate-500 mt-1 flex items-center">
        <span className="w-1 h-1 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
        {trend}
      </p>
    </div>
  </div>
);

const HistoryItem: React.FC<{ date: string, file: string }> = ({ date, file }) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/50 hover:bg-slate-800/40 transition-colors">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-slate-800 rounded-lg">
        <FileSpreadsheet size={14} className="text-emerald-500" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-200">{file}</p>
        <p className="text-[9px] text-slate-500">{date}</p>
      </div>
    </div>
    <button className="p-1.5 text-slate-500 hover:text-blue-400 active:scale-90 transition-all">
      <Download size={14} />
    </button>
  </div>
);

export default Dashboard;
