
export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent'
}

export interface Student {
  rollNo: string;
  name: string;
  className: string;
}

export interface AttendanceRecord {
  id: string;
  rollNo: string;
  name: string;
  className: string;
  status: AttendanceStatus;
  date: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendancePercentage: number;
}

export type ViewType = 'dashboard' | 'attendance' | 'master' | 'settings';
