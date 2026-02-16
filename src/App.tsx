import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import { RoleEnum } from "./types";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminModules from "./pages/admin/Modules";
import AdminTeachers from "./pages/admin/Teachers";
import AdminEnrollments from "./pages/admin/Enrollments";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherModules from "./pages/teacher/Modules";
import TeacherLessons from "./pages/teacher/Lessons";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import RegisterCourse from "./pages/RegisterCourse";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/register-course/:id" element={<RegisterCourse />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Admin]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Admin]}>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/modules"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Admin]}>
                    <AdminModules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Admin]}>
                    <AdminTeachers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Admin]}>
                    <AdminEnrollments />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Teacher]}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/courses"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Teacher]}>
                    <TeacherCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/modules"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Teacher]}>
                    <TeacherModules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/lessons"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Teacher]}>
                    <TeacherLessons />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[RoleEnum.Student]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
