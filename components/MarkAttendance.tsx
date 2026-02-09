
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Check, 
  X, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../types';

interface Props {
  students: Student[];
  records: AttendanceRecord[];
  addRecord: (record: AttendanceRecord) => void;
  date: string;
  setDate: (d: string) => void;
}

const MarkAttendance: React.FC<Props> = ({ students, records, addRecord, date, setDate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  const classes = useMemo(() => ['All', ...Array.from(new Set(students.map(s => s.className)))], [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.includes(searchTerm);
      const matchesClass = filterClass === 'All' || s.className === filterClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, filterClass]);

  const getStatusForToday = (rollNo: string) => {
    return records.find(r => r.rollNo === rollNo && r.date === date)?.status;
  };

  const handleMark = (student: Student, status: AttendanceStatus) => {
    const existing = records.find(r => r.rollNo === student.rollNo && r.date === date);
    if (existing) {
      alert("Attendance already marked for today.");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      ...student,
      status,
      date,
      timestamp: new Date().toLocaleTimeString()
    };
    addRecord(newRecord);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search & Filter Header */}
      <div className="glass-card p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <CheckCircle className="mr-2 text-emerald-400" size={20} />
              Mark Attendance
            </h2>
            <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase font-bold text-slate-500">
              <Clock size={12} />
              <span>Real-time Sync</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Student Name / Roll..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="flex-1 md:flex-none bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
              <div className="flex-1 md:flex-none flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                <CalendarIcon size={16} className="text-blue-500 mr-2" />
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none w-full font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student List - Table on Desktop, Cards on Mobile */}
      <div className="glass-card overflow-hidden">
        {/* Mobile View: Vertical Cards */}
        <div className="md:hidden divide-y divide-slate-800">
          {filteredStudents.map((student) => {
            const status = getStatusForToday(student.rollNo);
            return (
              <div key={student.rollNo} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{student.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      {student.className} • ROLL: {student.rollNo}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {status ? (
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${status === AttendanceStatus.PRESENT ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {status}
                    </span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleMark(student, AttendanceStatus.PRESENT)}
                        className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 active:scale-90 transition-all border border-emerald-500/20"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                         onClick={() => handleMark(student, AttendanceStatus.ABSENT)}
                         className="p-3 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 active:scale-90 transition-all border border-rose-500/20"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Roll</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Student Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Class</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Daily Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.map((student) => {
                const status = getStatusForToday(student.rollNo);
                return (
                  <tr key={student.rollNo} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-blue-400 font-bold">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold border border-slate-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{student.className}</td>
                    <td className="px-6 py-4">
                      {status ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === AttendanceStatus.PRESENT ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {status === AttendanceStatus.PRESENT ? <Check size={10} className="mr-1" /> : <X size={10} className="mr-1" />}
                          {status}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-bold uppercase">Pending Marking</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button 
                          disabled={!!status}
                          onClick={() => handleMark(student, AttendanceStatus.PRESENT)}
                          className={`p-2 rounded-lg transition-all ${status === AttendanceStatus.PRESENT ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/20 text-slate-500 active:scale-95'}`}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                           disabled={!!status}
                           onClick={() => handleMark(student, AttendanceStatus.ABSENT)}
                           className={`p-2 rounded-lg transition-all ${status === AttendanceStatus.ABSENT ? 'bg-rose-500 text-white' : 'hover:bg-rose-500/20 text-slate-500 active:scale-95'}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-16 text-center">
             <Search size={40} className="mx-auto mb-3 text-slate-700 opacity-20" />
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Database Results</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2">
        <div className="flex items-center space-x-2">
          <Database size={12} className="text-blue-500" />
          <span>Syncing: Master_Excel.xlsx</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center hover:text-white active:scale-90 transition-all">
            <ChevronLeft size={14} className="mr-1" /> Back
          </button>
          <span className="text-blue-500">Page 1</span>
          <button className="flex items-center hover:text-white active:scale-90 transition-all">
            Next <ChevronRight size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

import { CheckCircle } from 'lucide-react';

export default MarkAttendance;
