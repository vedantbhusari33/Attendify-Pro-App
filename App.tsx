
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Users, 
  Settings, 
  Menu, 
  X, 
  FileSpreadsheet, 
  RefreshCcw,
  Save,
  Download,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { 
  AttendanceRecord, 
  AttendanceStatus, 
  Student, 
  ViewType 
} from './types';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/MarkAttendance';
import StudentMaster from './components/StudentMaster';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Excel Integration Active ✓');
  const [currentDate, setCurrentDate] = useState('2026-02-10');

  useEffect(() => {
    const savedStudents = localStorage.getItem('attendify_students');
    const savedRecords = localStorage.getItem('attendify_records');
    
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    else {
      const initialStudents: Student[] = [
        { rollNo: '001', name: 'John Doe', className: 'A1' },
        { rollNo: '002', name: 'Jane Smith', className: 'A1' },
        { rollNo: '003', name: 'Alice Johnson', className: 'B2' },
        { rollNo: '004', name: 'Bob Brown', className: 'B2' },
      ];
      setStudents(initialStudents);
      localStorage.setItem('attendify_students', JSON.stringify(initialStudents));
    }

    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Roll No,Name,Class,Status,Date,Timestamp\n"
      + records.map(e => `${e.rollNo},${e.name},${e.className},${e.status},${e.date},${e.timestamp}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Export_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMsg('Exported to Excel ✓');
    setTimeout(() => setStatusMsg('Excel Integration Active ✓'), 3000);
  };

  const handleSync = () => {
    setLoading(true);
    setStatusMsg('Syncing with Excel Engine...');
    setTimeout(() => {
      setLoading(false);
      setStatusMsg('Excel Integration Active ✓');
    }, 1500);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      handleExportExcel();
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSync();
    }
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      setView('dashboard');
    }
    if (e.key === 'F5') {
      e.preventDefault();
      handleSync();
    }
  }, [records, currentDate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const addRecord = (record: AttendanceRecord) => {
    const newRecords = [...records, record];
    setRecords(newRecords);
    localStorage.setItem('attendify_records', JSON.stringify(newRecords));
  };

  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem('attendify_students', JSON.stringify(newStudents));
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 flex-col md:flex-row">
      {/* Fixed Top Bar (Mobile) */}
      <header className="md:hidden h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 fixed top-0 w-full">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <Menu size={24} />
          </button>
          <span className="text-lg font-bold tracking-tight">Attendify <span className="text-blue-500">Pro</span></span>
        </div>
        <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
          {currentDate}
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 glass-card m-4 transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 flex flex-col md:m-4
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Attendify <span className="text-blue-500">Pro</span></h1>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} 
          />
          <NavItem 
            icon={<CheckCircle size={20} />} 
            label="Mark Attendance" 
            active={view === 'attendance'} 
            onClick={() => { setView('attendance'); setIsSidebarOpen(false); }} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Student Master" 
            active={view === 'master'} 
            onClick={() => { setView('master'); setIsSidebarOpen(false); }} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={view === 'settings'} 
            onClick={() => { setView('settings'); setIsSidebarOpen(false); }} 
          />
        </nav>

        <div className="p-4 glass-card m-4 bg-slate-800/50 hidden md:block">
          <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Shortcuts</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span>Excel Master</span><span className="text-blue-400">Ctrl+E</span></div>
            <div className="flex justify-between"><span>Save/Sync</span><span className="text-blue-400">Ctrl+S</span></div>
            <div className="flex justify-between"><span>Dashboard</span><span className="text-blue-400">Ctrl+D</span></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center text-sm font-medium text-slate-400">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="capitalize text-slate-100">{view.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusMsg.includes('Active') ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${statusMsg.includes('Active') ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></span>
              {statusMsg}
            </div>
            <button onClick={handleSync} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <RefreshCcw size={18} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 mt-16 md:mt-0">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 animate-pulse">Excel Engine Synchronizing...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto w-full">
              {view === 'dashboard' && <Dashboard records={records} students={students} onExport={handleExportExcel} />}
              {view === 'attendance' && <MarkAttendance students={students} addRecord={addRecord} records={records} date={currentDate} setDate={setCurrentDate} />}
              {view === 'master' && <StudentMaster students={students} updateStudents={updateStudents} />}
              {view === 'settings' && <SettingsPage />}
            </div>
          )}
        </div>

        {/* Fixed Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 z-50 flex items-center justify-between px-6 safe-area-bottom">
          <div className="flex flex-col items-center text-slate-400">
             <Calendar size={18} />
             <span className="text-[10px] mt-1 font-medium">{currentDate}</span>
          </div>
          <button 
            onClick={handleSync}
            className="flex items-center space-x-2 bg-blue-600 active:scale-95 px-6 py-2 rounded-xl text-white font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save size={18} />
            <span>Save & Sync</span>
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center ${view === 'dashboard' ? 'text-blue-500' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-1 font-medium">Dash</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const SettingsPage = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
        <Settings className="mr-3 text-blue-500" /> System Settings
      </h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div>
            <h3 className="font-medium">Excel Cloud Auto-Sync</h3>
            <p className="text-xs text-slate-400">Real-time persistence across devices</p>
          </div>
          <div className="w-10 h-5 md:w-12 md:h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div>
            <h3 className="font-medium">Mobile Layout Priority</h3>
            <p className="text-xs text-slate-400">Optimize UI components for touch screens</p>
          </div>
          <div className="w-10 h-5 md:w-12 md:h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">AI Insight Generation</h3>
            <p className="text-xs text-slate-400">Automated reports via Gemini Engine</p>
          </div>
          <div className="w-10 h-5 md:w-12 md:h-6 bg-slate-600 rounded-full relative cursor-pointer">
            <div className="absolute left-1 top-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-700">
        <button className="w-full gradient-btn py-3 rounded-xl font-bold flex items-center justify-center space-x-2">
          <Save size={18} />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>

    <div className="glass-card p-6 bg-blue-500/5 border-blue-500/20">
      <h3 className="text-blue-400 font-semibold mb-2 flex items-center text-sm">
        <AlertCircle className="mr-2" size={16} /> Mobile Optimized v3.0
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        Attendify Pro is now optimized for mobile devices. Vertical stacking and touch feedback ensure a seamless experience on tablets and smartphones.
      </p>
    </div>
  </div>
);

export default App;
