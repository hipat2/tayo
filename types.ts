
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  // Extended fields
  studentPhone?: string;
  parentPhone?: string;
  age?: string;
  placeOfBirth?: string;
  dob?: string;
  paymentRef?: string;
  senderPhone?: string;
  // Status fields
  isBlacklisted?: boolean;
  paidAmount?: number;
  totalFee?: number;
}

export interface BlacklistRequest {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
}

export interface Grade {
  studentId: string;
  subject: string;
  score: number;
}

export interface ActivityLogEntry {
  id: string;
  description: string;
  points: number;
  date: string;
}

export interface CompetitionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}
