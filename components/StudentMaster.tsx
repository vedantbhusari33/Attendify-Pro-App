
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Search,
  Users
} from 'lucide-react';
import { Student } from '../types';

interface Props {
  students: Student[];
  updateStudents: (newStudents: Student[]) => void;
}

const StudentMaster: React.FC<Props> = ({ students, updateStudents }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState<Student>({ rollNo: '', name: '', className: '' });

  const handleAdd = () => {
    if (!newStudent.rollNo || !newStudent.name || !newStudent.className) return;
    updateStudents([...students, newStudent]);
    setNewStudent({ rollNo: '', name: '', className: '' });
    setIsAdding(false);
  };

  const handleDelete = (rollNo: string) => {
    if (confirm("Permanently delete this student from the Excel Master Database?")) {
      updateStudents(students.filter(s => s.rollNo !== rollNo));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Student Master</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Core Database Engine</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors text-xs font-bold border border-slate-700">
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 active:scale-95 transition-all font-bold shadow-lg shadow-blue-600/20 text-xs"
          >
            <Plus size={18} />
            <span>New Student</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300">
                <Users size={16} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Active Database ({students.length})</span>
              </div>
              <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Quick Search..." 
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Responsive List/Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 bg-slate-900/20">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Roll</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Full Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Class</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {students.map((student) => (
                    <tr key={student.rollNo} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-blue-400 font-bold">{student.rollNo}</td>
                      <td className="px-6 py-4">
                         <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold">{student.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{student.className}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 active:scale-90 transition-all">
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.rollNo)}
                            className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-500 hover:text-rose-400 active:scale-90 transition-all"
                          >
                            <Trash2 size={14} />
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

        <div className="lg:w-1/4 space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-xs font-bold mb-4 flex items-center uppercase tracking-widest text-emerald-400">
              <FileSpreadsheet className="mr-2" size={16} />
              Excel File Status
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Target</p>
                <p className="text-xs font-mono text-slate-200">Students_Master.xlsx</p>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Last Sync</p>
                <p className="text-xs font-mono text-slate-200">2026-02-10 09:42</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95">
              Sync to Cloud Excel
            </button>
          </div>

          {isAdding && (
            <div className="glass-card p-5 border-blue-500/50 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-blue-400">Add Entry</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5 ml-1">Roll No</label>
                  <input 
                    type="text" 
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                    placeholder="e.g. 005"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5 ml-1">Student Name</label>
                  <input 
                    type="text" 
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Enter Full Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block mb-1.5 ml-1">Class</label>
                  <input 
                    type="text" 
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({...newStudent, className: e.target.value})}
                    placeholder="e.g. A1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    Save Entry
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMaster;
