import React, { useEffect, useState } from 'react';
import { type Course } from '../../types';
import apiService from '../../api/apiService';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { toast } from 'react-toastify';

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'jour' as 'jour' | 'soire',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.adminGetCourses();
      setCourses(response.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des formations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        type: course.type,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        type: 'jour',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      type: 'jour',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        await apiService.adminUpdateCourse(editingCourse.id, formData);
        toast.success('Formation mise à jour avec succès');
      } else {
        await apiService.adminCreateCourse(formData);
        toast.success('Formation créée avec succès');
      }
      
      handleCloseModal();
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      return;
    }

    try {
      await apiService.adminDeleteCourse(id);
      toast.success('Formation supprimée avec succès');
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      console.error(error);
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Formations</h1>
          <Button onClick={() => handleOpenModal()}>
            + Nouvelle Formation
          </Button>
        </div>

        {courses.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Aucune formation disponible. Créez-en une !
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

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleOpenModal(course)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(course.id)}
                    variant="danger"
                    className="flex-1"
                  >
                    Supprimer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingCourse ? 'Modifier la Formation' : 'Nouvelle Formation'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'jour' | 'soire' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="jour">Formation de Jour</option>
                    <option value="soire">Formation du Soir</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingCourse ? 'Mettre à jour' : 'Créer'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="secondary"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;