import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import bolumData from '../data/departments';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const AddPostPage = () => {
  const navigate = useNavigate();
  const { faculties, departments } = bolumData;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    faculty: '',
    department: '',
  });
  const [file, setFile] = useState(null);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 40 * 1024 * 1024) {
        setError('Dosya boyutu 40MB\'dan küçük olmalıdır');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
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
      formDataToSend.append('file', file);

      await postsAPI.addPost(formDataToSend);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error adding post:', error);
      setError(error.response?.data?.message || 'Not paylaşılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Not Paylaş</h1>

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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosya Yükle * (Max: 30MB)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                  >
                    <span>Dosya seçin</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">veya sürükleyip bırakın</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, PPT, JPG (max. 30MB)</p>
                {file && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-600 mt-2">
                    <FileText className="h-5 w-5" />
                    <span>{file.name}</span>
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
              className=" bg-[#2F5755] hover:bg-[#5A9690] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostPage;