'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaEye, FaTrash, FaDownload, FaFileAlt } from 'react-icons/fa';

interface Prospekt {
  _id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isActive: boolean;
  description?: string;
  uploadedBy?: string;
}

interface ProspektModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospekty: Prospekt[];
  onRefresh: () => void;
  onRefreshAfterDelete?: () => void;
}

const ProspektModal: React.FC<ProspektModalProps> = ({
  isOpen,
  onClose,
  prospekty,
  onRefresh,
  onRefreshAfterDelete
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    uploadedBy: 'Admin'
  });

  const activeProspekt = prospekty.find(p => p.isActive);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];
    
    if (!file) {
      alert('Wybierz plik PDF');
      return;
    }

    // Jeśli nazwa nie została ustawiona, użyj nazwy pliku
    const fileName = uploadForm.name.trim() || file.name.replace('.pdf', '') || 'Prospekt informacyjny';

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', fileName);
      formData.append('description', uploadForm.description.trim() || 'Prospekt informacyjny inwestycji');
      formData.append('investment', 'zamoyskiego-2');
      formData.append('uploadedBy', uploadForm.uploadedBy.trim() || 'Admin');

      const response = await fetch('/api/prospekt', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Błąd podczas uploadu');
      }

      setUploadForm({ name: '', description: '', uploadedBy: 'Admin' });
      if (fileInput) fileInput.value = '';
      onRefresh();
      
      alert('Prospekt został przesłany pomyślnie!');

    } catch (error) {
      console.error('Błąd podczas uploadu:', error);
      alert(error instanceof Error ? error.message : 'Wystąpił błąd podczas uploadu');
    } finally {
      setUploading(false);
    }
  };


  const handleDelete = async (prospektId: string, fileName: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć prospekt "${fileName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/prospekt?id=${prospektId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Błąd podczas usuwania');
      }

      // Używaj onRefreshAfterDelete jeśli dostępne, inaczej zwykłe onRefresh
      if (onRefreshAfterDelete) {
        onRefreshAfterDelete();
      } else {
        onRefresh();
      }
      alert('Prospekt został usunięty!');

    } catch (error) {
      console.error('Błąd podczas usuwania:', error);
      alert(error instanceof Error ? error.message : 'Wystąpił błąd podczas usuwania');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#d7c28d] to-[#c4a76a] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Zarządzanie plikiem</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Current File Status */}
              {activeProspekt ? (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#d7c28d] rounded-lg flex items-center justify-center">
                      <FaFileAlt className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">{activeProspekt.fileName}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Przesłany: {formatDate(activeProspekt.uploadedAt)}
                      </p>
                      <p className="text-sm text-gray-600">Typ: Prospekt</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => window.open(activeProspekt.fileUrl, '_blank')}
                      className="flex-1 bg-[#d7c28d] text-white py-2 px-4 rounded-lg hover:bg-[#c4a76a] transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FaEye className="w-4 h-4" />
                      Zobacz plik
                    </button>
                    <a
                      href={activeProspekt.fileUrl}
                      download={activeProspekt.fileName}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-2 no-underline"
                    >
                      <FaDownload className="w-4 h-4" />
                      Pobierz
                    </a>
                    <button
                      onClick={() => handleDelete(activeProspekt._id, activeProspekt.fileName)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FaTrash className="w-4 h-4" />
                      Usuń plik z serwera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                  <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Brak przesłanych plików</p>
                </div>
              )}

              {/* Replace File Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = '.pdf';
                    fileInput.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setUploadForm({ ...uploadForm, name: file.name.replace('.pdf', '') });
                        if (fileInputRef.current) {
                          fileInputRef.current.files = (e.target as HTMLInputElement).files;
                        }
                        // Automatycznie prześlij plik
                        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                        handleUpload(fakeEvent);
                      }
                    };
                    fileInput.click();
                  }}
                  disabled={uploading}
                  className="bg-[#d7c28d] hover:bg-[#c4a76a] text-white py-3 px-8 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  <FaUpload className="w-4 h-4" />
                  {uploading ? 'Przesyłanie...' : 'Zastąp plik'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProspektModal;
