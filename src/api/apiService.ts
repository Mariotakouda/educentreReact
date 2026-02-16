import axios, {  AxiosError, type AxiosInstance } from 'axios';
import type {
    User,
    Course,
    Module,
    Lesson,
    Enrollment,
    LoginResponse,
    RegisterData,
    ApiResponse,
    EnrollmentValidationResponse
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token à chaque requête
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // === AUTHENTIFICATION ===
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await this.api.post<LoginResponse>('/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    const { data } = await this.api.post<ApiResponse<User>>('/register', userData);
    return data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const { data } = await this.api.get<ApiResponse<User>>('/user');
    return data;
  }

  // === FORMATIONS (PUBLIC) ===

  async getCourses(): Promise<ApiResponse<Course[]>> {
  const { data } = await this.api.get<ApiResponse<Course[]>>('/courses'); // ✅ Route publique
  return data;
}

async getCourse(id: number): Promise<ApiResponse<Course>> {
  const { data } = await this.api.get<ApiResponse<Course>>(`/courses/${id}`); // ✅ Route publique
  return data;
}


  // === ADMIN - COURSES ===
  async adminGetCourses(): Promise<ApiResponse<Course[]>> {
    const { data } = await this.api.get<ApiResponse<Course[]>>('/admin/courses');
    return data;
  }

  async adminCreateCourse(courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    const { data } = await this.api.post<ApiResponse<Course>>('/admin/courses', courseData);
    return data;
  }

  async adminGetCourse(id: number): Promise<ApiResponse<Course>> {
    const { data } = await this.api.get<ApiResponse<Course>>(`/admin/courses/${id}`);
    return data;
  }

  async adminUpdateCourse(id: number, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    const { data } = await this.api.put<ApiResponse<Course>>(`/admin/courses/${id}`, courseData);
    return data;
  }

  async adminDeleteCourse(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.api.delete<ApiResponse<void>>(`/admin/courses/${id}`);
    return data;
  }

  // === ADMIN - MODULES ===
  async adminGetModules(): Promise<ApiResponse<Module[]>> {
    const { data } = await this.api.get<ApiResponse<Module[]>>('/admin/modules');
    return data;
  }

  async adminCreateModule(moduleData: Partial<Module>): Promise<ApiResponse<Module>> {
    const { data } = await this.api.post<ApiResponse<Module>>('/admin/modules', moduleData);
    return data;
  }

  async adminUpdateModule(id: number, moduleData: Partial<Module>): Promise<ApiResponse<Module>> {
    const { data } = await this.api.put<ApiResponse<Module>>(`/admin/modules/${id}`, moduleData);
    return data;
  }

  async adminDeleteModule(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.api.delete<ApiResponse<void>>(`/admin/modules/${id}`);
    return data;
  }

  // === ADMIN - TEACHERS ===
  async adminGetTeachers(): Promise<ApiResponse<User[]>> {
    const { data } = await this.api.get<ApiResponse<User[]>>('/admin/teachers');
    return data;
  }

  async adminCreateTeacher(teacherData: any): Promise<ApiResponse<User>> {
    const { data } = await this.api.post<ApiResponse<User>>('/admin/teachers', teacherData);
    return data;
  }

  async adminUpdateTeacher(id: number, teacherData: any): Promise<ApiResponse<User>> {
    const { data } = await this.api.put<ApiResponse<User>>(`/admin/teachers/${id}`, teacherData);
    return data;
  }

  async adminDeleteTeacher(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.api.delete<ApiResponse<void>>(`/admin/teachers/${id}`);
    return data;
  }

  // === ADMIN - ENROLLMENTS ===
async adminGetEnrollments(status?: string): Promise<ApiResponse<Enrollment[]>> {
  const url = status ? `/admin/enrollments?status=${status}` : '/admin/enrollments';
  const { data } = await this.api.get<ApiResponse<Enrollment[]>>(url);
  return data;
}

async adminValidateEnrollment(
  id: number, 
  status: string, 
  comment?: string
): Promise<EnrollmentValidationResponse> { // ✅ Type spécifique
  const { data } = await this.api.put<EnrollmentValidationResponse>(
    `/admin/enrollments/${id}`, 
    { status, admin_comment: comment }
  );
  return data;
}

  // === TEACHER - COURSES ===
  async teacherGetCourses(): Promise<ApiResponse<Course[]>> {
    const { data } = await this.api.get<ApiResponse<Course[]>>('/teacher/courses');
    return data;
  }

  async teacherCreateCourse(courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    const { data } = await this.api.post<ApiResponse<Course>>('/teacher/courses', courseData);
    return data;
  }

  async teacherUpdateCourse(id: number, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    const { data } = await this.api.put<ApiResponse<Course>>(`/teacher/courses/${id}`, courseData);
    return data;
  }

  async teacherDeleteCourse(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.api.delete<ApiResponse<void>>(`/teacher/courses/${id}`);
    return data;
  }

  // === TEACHER - MODULES ===
  async teacherGetModules(courseId?: number): Promise<ApiResponse<Module[]>> {
    const url = courseId ? `/teacher/modules?course_id=${courseId}` : '/teacher/modules';
    const { data } = await this.api.get<ApiResponse<Module[]>>(url);
    return data;
  }

  async teacherCreateModule(moduleData: Partial<Module>): Promise<ApiResponse<Module>> {
    const { data } = await this.api.post<ApiResponse<Module>>('/teacher/modules', moduleData);
    return data;
  }

  async teacherUpdateModule(id: number, moduleData: Partial<Module>): Promise<ApiResponse<Module>> {
    const { data } = await this.api.put<ApiResponse<Module>>(`/teacher/modules/${id}`, moduleData);
    return data;
  }

  async teacherDeleteModule(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.api.delete<ApiResponse<void>>(`/teacher/modules/${id}`);
    return data;
  }

  // === TEACHER - LESSONS ===
  async teacherGetLessons(moduleId?: number): Promise<ApiResponse<Lesson[]>> {
    const url = moduleId ? `/teacher/lessons?module_id=${moduleId}` : '/teacher/lessons';
    const { data } = await this.api.get<ApiResponse<Lesson[]>>(url);
    return data;
  }

  async teacherCreateLesson(lessonData: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
    const { data } = await this.api.post<ApiResponse<Lesson>>('/teacher/lessons', lessonData);
    return data;
  }

  async teacherUpdateLesson(id: number, lessonData: Partial<Lesson>): Promise<ApiResponse<Lesson>> {
    const { data } = await this.api.put<ApiResponse<Lesson>>(`/teacher/lessons/${id}`, lessonData);
    return data;
  }

  async teacherDeleteLesson(id: number): Promise<ApiResponse<void>> {
    const { data } = await this.api.delete<ApiResponse<void>>(`/teacher/lessons/${id}`);
    return data;
  }

  // === STUDENT ===
  async studentGetEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    const { data } = await this.api.get<ApiResponse<Enrollment[]>>('/student/my-enrollments');
    return data;
  }

  async studentGetCourseModules(courseId: number): Promise<ApiResponse<Module[]>> {
    const { data } = await this.api.get<ApiResponse<Module[]>>(`/student/courses/${courseId}/modules`);
    return data;
  }

  async studentGetModuleLessons(moduleId: number): Promise<ApiResponse<Lesson[]>> {
    const { data } = await this.api.get<ApiResponse<Lesson[]>>(`/student/modules/${moduleId}/lessons`);
    return data;
  }
}

export default new ApiService();