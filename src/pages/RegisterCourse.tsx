import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Course } from '../types';
import apiService from '../api/apiService';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { toast } from 'react-toastify';

const RegisterCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // ✅ SUPPRIMÉ password et password_confirmation
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    birth_date: '',
    educational_level: '',
    lastDiplome: '',
  });

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await apiService.getCourse(parseInt(id!));
      setCourse(response.data || null);
    } catch (error) {
      toast.error('Formation introuvable');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.register({
        ...formData,
        password: '', // ✅ Sera généré par le backend
        password_confirmation: '', // ✅ Sera généré par le backend
        course_id: parseInt(id!),
      });

      toast.success(
        '✅ Votre demande d\'inscription a été soumise avec succès ! ' +
        'Vous recevrez un email avec vos identifiants une fois validée par l\'administrateur.',
        { autoClose: 8000 }
      );
      
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          errors[key].forEach((msg: string) => toast.error(msg));
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate(`/course/${id}`)}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
        >
          ← Retour à la formation
        </button>

        <Card className="mb-6 bg-blue-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Inscription à : {course.title}
          </h2>
          <p className="text-gray-600">
            Remplissez le formulaire ci-dessous pour soumettre votre demande d'inscription.
          </p>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Informations personnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstname"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastname"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="jean.dupont@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cet email sera utilisé pour votre connexion
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+228 XX XX XX XX"
              />
            </div>

            <hr className="my-6" />

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Informations académiques
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                name="birth_date"
                required
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'études *
              </label>
              <select
                name="educational_level"
                required
                value={formData.educational_level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez votre niveau</option>
                <option value="Baccalauréat">Baccalauréat</option>
                <option value="Licence">Licence (Bac+3)</option>
                <option value="Master">Master (Bac+5)</option>
                <option value="Doctorat">Doctorat (Bac+8)</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dernier diplôme obtenu *
              </label>
              <input
                type="text"
                name="lastDiplome"
                required
                value={formData.lastDiplome}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Licence en Informatique"
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-700 font-semibold mb-2">
                📧 Compte et identifiants
              </p>
              <p className="text-sm text-blue-600">
                Une fois votre inscription validée par l'administrateur, vous recevrez un email contenant :
              </p>
              <ul className="text-sm text-blue-600 list-disc list-inside mt-2">
                <li>Votre email de connexion (celui fourni ci-dessus)</li>
                <li>Votre mot de passe temporaire</li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={submitting}
              >
                {submitting ? 'Envoi en cours...' : 'Soumettre ma demande'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate(`/course/${id}`)}
                variant="secondary"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterCourse;