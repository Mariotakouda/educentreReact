import React, { useEffect, useState } from 'react';
import { type Lesson, type Module } from '../../types';
import apiService from '../../api/apiService';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { toast } from 'react-toastify';

const TeacherLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    module_id: 0,
    title: '',
    video: '',
    content_pdf: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, modulesRes] = await Promise.all([
        apiService.teacherGetLessons(),
        apiService.teacherGetModules(),
      ]);
      
      setLessons(lessonsRes.data || []);
      setModules(modulesRes.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        module_id: lesson.module_id,
        title: lesson.title,
        video: lesson.video || '',
        content_pdf: lesson.content_pdf || '',
      });
    } else {
      setEditingLesson(null);
      setFormData({
        module_id: modules[0]?.id || 0,
        title: '',
        video: '',
        content_pdf: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLesson) {
        await apiService.teacherUpdateLesson(editingLesson.id, formData);
        toast.success('Leçon mise à jour avec succès');
      } else {
        await apiService.teacherCreateLesson(formData);
        toast.success('Leçon créée avec succès');
      }
      
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      return;
    }

    try {
      await apiService.teacherDeleteLesson(id);
      toast.success('Leçon supprimée avec succès');
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
          <h1 className="text-3xl font-bold text-gray-800">Mes Leçons</h1>
          <Button onClick={() => handleOpenModal()} disabled={modules.length === 0}>
            + Nouvelle Leçon
          </Button>
        </div>

        {modules.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Veuillez d'abord créer un module avant d'ajouter des leçons.
            </p>
          </Card>
        ) : lessons.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Vous n'avez pas encore créé de leçon. Commencez maintenant !
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <div className="mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    {lesson.module?.title || 'Module non défini'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {lesson.title}
                </h3>

                <div className="space-y-2 mb-4">
                  {lesson.video && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🎥</span>
                      <span className="truncate">Vidéo disponible</span>
                    </div>
                  )}
                  {lesson.content_pdf && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📄</span>
                      <span className="truncate">PDF disponible</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleOpenModal(lesson)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(lesson.id)}
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
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingLesson ? 'Modifier la Leçon' : 'Nouvelle Leçon'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module
                  </label>
                  <select
                    required
                    value={formData.module_id}
                    onChange={(e) => setFormData({ ...formData, module_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un module</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la Leçon
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
                    URL de la Vidéo (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du PDF (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.content_pdf}
                    onChange={(e) => setFormData({ ...formData, content_pdf: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingLesson ? 'Mettre à jour' : 'Créer'}
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

export default TeacherLessons;