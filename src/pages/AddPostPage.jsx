import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import bolumData from '../data/departments';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

const AddPostPage = () => {
  const navigate = useNavigate();
  const { faculties, departments } = bolumData;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    faculty: '',
    department: '',
  });
  const [files, setFiles] = useState([]); // DEĞİŞTİ: file → files (array)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFacultyChange = (e) => {
    setFormData({
      ...formData,
      faculty: e.target.value,
      department: '',
    });
    setError('');
  };

  // DEĞİŞTİ: Çoklu dosya seçimi
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 5) {
      setError('Maksimum 5 dosya yükleyebilirsiniz');
      return;
    }

    // Dosya boyutu kontrolü
    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Her dosya 10MB\'dan küçük olmalıdır');
      return;
    }

    setFiles(selectedFiles);
    setError('');
  };

  // YENİ: Dosya kaldırma
  const handleRemoveFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.title || !formData.content || !formData.faculty || !formData.department) {
      setError('Lütfen tüm alanları doldurun');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('faculty', formData.faculty);
      formDataToSend.append('department', formData.department);
      
      // DEĞİŞTİ: Birden fazla dosyayı ekle
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      await postsAPI.addPost(formDataToSend);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message;
  setError(message || 'Not paylaşılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary dark:bg-darkbg min-h-screen">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-darktext mb-6 ">Not Paylaş</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">Not başarıyla paylaşıldı! Yönlendiriliyorsunuz...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-darktext mb-2">
              Başlık *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Örn: Matematik 101 Final Soruları"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-darktext mb-2">
              Açıklama *
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              required
              value={formData.content}
              onChange={handleChange}
              className="input-field"
              placeholder="Notlar hakkında kısa bir açıklama yazın..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-darktext mb-2">
                Fakülte *
              </label>
              <select
                id="faculty"
                name="faculty"
                required
                value={formData.faculty}
                onChange={handleFacultyChange}
                className="input-field"
              >
                <option value="">Fakülte Seçin</option>
                {faculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-darktext mb-2">
                Bölüm *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                disabled={!formData.faculty}
              >
                <option value="">Bölüm Seçin</option>
                {formData.faculty &&
                  departments[formData.faculty]?.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-darktext mb-2">
              Dosya Yükle (Opsiyonel, Max: 5 dosya, Her biri 10MB)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-primary rounded-md font-medium p-1 text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <span>Dosya seçin</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1 dark:text-darktext">veya sürükleyip bırakın</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-darktext">PDF, DOC, PPT, JPG (max. 10MB her biri)</p>
                
                {/* DEĞİŞTİ: Seçilen dosyaları göster */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-center space-x-2 text-sm text-green-600">
                        <FileText className="h-5 w-5" />
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 dark:text-darktext mt-2">
                      {files.length} dosya seçildi
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className=" bg-[#2F5755] hover:bg-[#5A9690] text-primary font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddPostPage;