import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Course } from '../types';
import apiService from '../api/apiService';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { toast } from 'react-toastify';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await apiService.getCourse(parseInt(id!));
      setCourse(response.data || null);
    } catch (error) {
      toast.error('Erreur lors du chargement de la formation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRIGÉ : Redirection directe vers le formulaire d'inscription
  const handleEnroll = () => {
    navigate(`/register-course/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Formation non trouvée</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Retour aux formations
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
              <div className="flex-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  course.type === 'jour' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {course.type === 'jour' ? 'Formation de Jour' : 'Formation du Soir'}
                </span>
                <h1 className="text-4xl font-bold text-gray-800 mt-4">
                  {course.title}
                </h1>
              </div>
              
              <Button onClick={handleEnroll} className="text-lg px-8 py-3 whitespace-nowrap">
                S'inscrire maintenant
              </Button>
            </div>

            <p className="text-gray-600 text-lg mb-6">
              {course.description}
            </p>

            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <span className="text-2xl mr-2">📚</span>
                <span>{course.modules?.length || 0} modules</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📝</span>
                <span>
                  {course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0} leçons
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules et Leçons */}
        {course.modules && course.modules.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Programme de la formation
            </h2>

            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <Card key={module.id}>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {module.title}
                      </h3>
                      
                      {module.lessons && module.lessons.length > 0 && (
                        <div className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center text-gray-600 ml-4"
                            >
                              <span className="mr-2">📄</span>
                              <span>{lesson.title}</span>
                              {lesson.video && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Vidéo
                                </span>
                              )}
                              {lesson.content_pdf && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  PDF
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-6">
            Inscrivez-vous maintenant et démarrez votre apprentissage
          </p>
          <Button
            onClick={handleEnroll}
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            S'inscrire à cette formation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;