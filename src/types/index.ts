export const RoleEnum = {
  Admin: "admin",
  Teacher: "teacher",
  Student: "student",
} as const;
export type RoleEnum = (typeof RoleEnum)[
    keyof typeof RoleEnum
];

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: RoleEnum;
  phone?: string;
  student?: Student;
  teacher?: Teacher;
  created_at?: string;
  updated_at?: string;
}

export interface Student {
  id: number;
  user_id: number;
  address?: string;
  birth_date: string;
  educational_level: string;
  lastDiplome: string;
  user?: User;
  enrollments?: Enrollment[];
  created_at?: string;
  updated_at?: string;
}

export interface Teacher {
  id: number;
  user_id: number;
  bio?: string;
  specialty?: string;
  salary?: number;
  phone?: string;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  type: 'jour' | 'soire';
  modules?: Module[];
  enrollments?: Enrollment[];
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  course?: Course;
  lessons?: Lesson[];
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  video?: string;
  content_pdf?: string;
  module?: Module;
  created_at?: string;
  updated_at?: string;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  status: 'pending' | 'validated' | 'rejected';
  admin_comment?: string;
  enrolled_at: string;
  student?: Student;
  course?: Course;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_id?: number;
  amount: number;
  transaction_id?: string;
  student?: Student;
  course?: Course;
  enrollment?: Enrollment;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface LoginResponse {
  status: string;
  token: string;
  user: User;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  birth_date: string;
  educational_level: string;
  lastDiplome: string;
  course_id: number;
}

// ✅ NOUVEAU TYPE
export interface EnrollmentValidationResponse {
  status: string;
  message: string;
  temporary_password?: string;
  data: Enrollment;
}