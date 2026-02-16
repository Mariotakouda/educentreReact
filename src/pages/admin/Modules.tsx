import React, { useEffect, useState } from 'react';
import { type Course, type Module } from '../../types';
import apiService from '../../api/apiService';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { toast } from 'react-toastify';

const AdminModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({
    course_id: 0,
    title: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesRes, coursesRes] = await Promise.all([
        apiService.adminGetModules(),
        apiService.adminGetCourses(),
      ]);
      
      setModules(modulesRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (module?: Module) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        course_id: module.course_id,
        title: module.title,
      });
    } else {
      setEditingModule(null);
      setFormData({
        course_id: courses[0]?.id || 0,
        title: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingModule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingModule) {
        await apiService.adminUpdateModule(editingModule.id, formData);
        toast.success('Module mis à jour avec succès');
      } else {
        await apiService.adminCreateModule(formData);
        toast.success('Module créé avec succès');
      }
      
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      return;
    }

    try {
      await apiService.adminDeleteModule(id);
      toast.success('Module supprimé avec succès');
      fetchData();
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
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Modules</h1>
          <Button onClick={() => handleOpenModal()} disabled={courses.length === 0}>
            + Nouveau Module
          </Button>
        </div>

        {courses.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Veuillez d'abord créer une formation avant d'ajouter des modules.
            </p>
          </Card>
        ) : modules.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Aucun module disponible. Créez-en un !
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.id}>
                <div className="mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {module.course?.title || 'Formation non définie'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {module.title}
                </h3>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleOpenModal(module)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(module.id)}
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
                {editingModule ? 'Modifier le Module' : 'Nouveau Module'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formation
                  </label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une formation</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du Module
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingModule ? 'Mettre à jour' : 'Créer'}
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

export default AdminModules;