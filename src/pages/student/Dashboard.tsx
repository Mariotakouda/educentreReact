import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import apiService from '../../api/apiService';
import { type Course, type Enrollment } from '../../types';
import { toast } from 'react-toastify';

const StudentDashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, coursesRes] = await Promise.all([
        apiService.studentGetEnrollments(),
        apiService.getCourses(),
      ]);
      
      setEnrollments(enrollmentsRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      validated: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    const labels = {
      pending: 'En attente',
      validated: 'Validée',
      rejected: 'Rejetée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mon Espace Étudiant
        </h1>

        {/* Mes Inscriptions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
          
          {enrollments.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                Vous n'avez pas encore d'inscription. Parcourez nos formations ci-dessous !
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusBadge(enrollment.status)}
                        <span className="text-sm text-gray-500">
                          Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {enrollment.course?.title}
                      </h3>

                      <p className="text-gray-600 mb-3">
                        {enrollment.course?.description}
                      </p>

                      {enrollment.admin_comment && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Commentaire admin :</strong> {enrollment.admin_comment}
                          </p>
                        </div>
                      )}
                    </div>

                    {enrollment.status === 'validated' && (
                      <Link
                        to={`/student/course/${enrollment.course_id}`}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Accéder au cours
                      </Link>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Formations Disponibles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Formations Disponibles</h2>
          
          {courses.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 py-8">
                Aucune formation disponible pour le moment.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.type === 'jour' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {course.type === 'jour' ? 'Jour' : 'Soir'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {course.modules && (
                    <p className="text-sm text-gray-500 mb-4">
                      📚 {course.modules.length} module(s)
                    </p>
                  )}

                  <Link
                    to={`/student/course/${course.id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Voir les détails
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;