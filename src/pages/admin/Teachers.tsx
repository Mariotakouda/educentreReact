import React, { useEffect, useState } from 'react';
import { type User } from '../../types';
import apiService from '../../api/apiService';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { toast } from 'react-toastify';

const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    specialty: '',
    bio: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await apiService.adminGetTeachers();
      setTeachers(response.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des enseignants');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (teacher?: User) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        email: teacher.email,
        phone: teacher.phone || '',
        specialty: teacher.teacher?.specialty || '',
        bio: teacher.teacher?.bio || '',
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        specialty: '',
        bio: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTeacher) {
        await apiService.adminUpdateTeacher(editingTeacher.id, formData);
        toast.success('Enseignant mis à jour avec succès');
      } else {
        await apiService.adminCreateTeacher(formData);
        toast.success('Enseignant créé avec succès');
      }
      
      handleCloseModal();
      fetchTeachers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      return;
    }

    try {
      await apiService.adminDeleteTeacher(id);
      toast.success('Enseignant supprimé avec succès');
      fetchTeachers();
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
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Enseignants</h1>
          <Button onClick={() => handleOpenModal()}>
            + Nouvel Enseignant
          </Button>
        </div>

        {teachers.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Aucun enseignant disponible. Créez-en un !
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.id}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {teacher.firstname.charAt(0)}{teacher.lastname.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {teacher.firstname} {teacher.lastname}
                    </h3>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                  </div>
                </div>

                {teacher.teacher?.specialty && (
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {teacher.teacher.specialty}
                    </span>
                  </div>
                )}

                {teacher.teacher?.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {teacher.teacher.bio}
                  </p>
                )}

                {teacher.phone && (
                  <p className="text-gray-600 text-sm mb-4">
                    📞 {teacher.phone}
                  </p>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleOpenModal(teacher)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(teacher.id)}
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
                {editingTeacher ? 'Modifier l\'Enseignant' : 'Nouvel Enseignant'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingTeacher}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Développement Web, Design, Marketing..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Présentez l'enseignant..."
                  />
                </div>

                {!editingTeacher && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-yellow-700">
                      ℹ️ Le mot de passe par défaut sera : <strong>password123</strong>
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingTeacher ? 'Mettre à jour' : 'Créer'}
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

export default AdminTeachers;