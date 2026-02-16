import React, { useEffect, useState } from "react";
import { type Enrollment } from "../../types";
import apiService from "../../api/apiService";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import { toast } from "react-toastify";

const AdminEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "validated" | "rejected"
  >("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [comment, setComment] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState<string>(""); // ✅ État pour le mot de passe

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminGetEnrollments(
        filter === "all" ? undefined : filter
      );
      setEnrollments(response.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des inscriptions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setComment(enrollment.admin_comment || "");
    setShowModal(true);
  };

  // ✅ Fonction de fermeture unique et complète
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEnrollment(null);
    setComment("");
    setGeneratedPassword("");
  };

  const handleValidate = async (status: "validated" | "rejected") => {
    if (!selectedEnrollment) return;

    try {
      const response = await apiService.adminValidateEnrollment(
        selectedEnrollment.id,
        status,
        comment || undefined
      );

      // ✅ TypeScript reconnaît maintenant temporary_password
      if (status === "validated" && response.temporary_password) {
        setGeneratedPassword(response.temporary_password);
        toast.success("Inscription validée ! Mot de passe généré.", {
          autoClose: 10000,
        });
      } else {
        toast.success(
          status === "validated"
            ? "Inscription validée avec succès"
            : "Inscription rejetée"
        );
        handleCloseModal();
      }

      fetchEnrollments();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la validation"
      );
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      validated: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const labels = {
      pending: "En attente",
      validated: "Validée",
      rejected: "Rejetée",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          badges[status as keyof typeof badges]
        }`}
      >
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
          Gestion des Inscriptions
        </h1>

        {/* Filtres */}
        <div className="mb-6 flex space-x-2 md:space-x-4">
          {(["all", "pending", "validated", "rejected"] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? "primary" : "secondary"}
            >
              {f === "all"
                ? "Toutes"
                : f === "pending"
                ? "En attente"
                : f === "validated"
                ? "Validées"
                : "Rejetées"}
            </Button>
          ))}
        </div>

        {enrollments.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              Aucune inscription trouvée.
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
                        {new Date(enrollment.enrolled_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Étudiant
                        </h3>
                        <p className="text-gray-600">
                          {enrollment.student?.user?.firstname}{" "}
                          {enrollment.student?.user?.lastname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {enrollment.student?.user?.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Formation
                        </h3>
                        <p className="text-gray-600">
                          {enrollment.course?.title}
                        </p>
                      </div>
                    </div>

                    {enrollment.admin_comment && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Commentaire :</strong>{" "}
                          {enrollment.admin_comment}
                        </p>
                      </div>
                    )}
                  </div>

                  {enrollment.status === "pending" && (
                    <div className="ml-4">
                      <Button
                        onClick={() => handleOpenModal(enrollment)}
                        variant="primary"
                      >
                        Traiter
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de validation */}
        {showModal && selectedEnrollment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
              {generatedPassword ? (
                // ✅ VUE : MOT DE PASSE GÉNÉRÉ
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold mb-4 text-green-600">
                    ✅ Inscription Validée !
                  </h2>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-6">
                    <p className="text-sm text-green-700 font-semibold mb-2">
                      Identifiants de connexion générés
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-green-600 uppercase font-bold">
                          Email :
                        </p>
                        <p className="font-mono bg-white p-2 rounded border">
                          {selectedEnrollment.student?.user?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase font-bold">
                          Mot de passe temporaire :
                        </p>
                        <p className="font-mono bg-white p-2 rounded border text-lg font-bold text-gray-800">
                          {generatedPassword}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6 text-sm text-yellow-700">
                    ⚠️ <strong>Important :</strong> Copiez ce mot de passe pour
                    l'étudiant. Il ne sera plus affiché après fermeture.
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPassword);
                        toast.success("Mot de passe copié !");
                      }}
                      variant="success"
                      className="flex-1"
                    >
                      📋 Copier le mot de passe
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      variant="secondary"
                      className="flex-1"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              ) : (
                // ✅ VUE : FORMULAIRE DE VALIDATION
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Traiter l'inscription
                  </h2>
                  <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">
                      <strong>Étudiant :</strong>{" "}
                      {selectedEnrollment.student?.user?.firstname}{" "}
                      {selectedEnrollment.student?.user?.lastname}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Formation :</strong>{" "}
                      {selectedEnrollment.course?.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Inscrit le :</strong>{" "}
                      {new Date(
                        selectedEnrollment.enrolled_at
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Message pour l'étudiant..."
                    />
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6 text-sm text-blue-700">
                    💡 Un mot de passe temporaire sera généré automatiquement à
                    la validation.
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleValidate("validated")}
                      variant="success"
                      className="flex-1 min-w-[150px]"
                    >
                      ✓ Valider et Générer
                    </Button>
                    <Button
                      onClick={() => handleValidate("rejected")}
                      variant="danger"
                      className="flex-1 min-w-[150px]"
                    >
                      ✗ Rejeter
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      variant="secondary"
                      className="flex-1 min-w-[150px]"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnrollments;
