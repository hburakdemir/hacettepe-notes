import React, { useState } from 'react';
import { User, Calendar, FileText, Bookmark } from 'lucide-react';
import { savedPostsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onSaveToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [loading, setLoading] = useState(false);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      alert('Kaydetmek için giriş yapmalısınız');
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await savedPostsAPI.unsavePost(post._id);
        setIsSaved(false);
      } else {
        await savedPostsAPI.savePost(post._id);
        setIsSaved(true);
      }
      if (onSaveToggle) onSaveToggle();
    } catch (error) {
      console.error('Save/Unsave error:', error);
      alert('İşlem başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{post.content}</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={handleSaveToggle}
            disabled={loading}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Bookmark 
              className={`h-6 w-6 ${isSaved ? 'text-primary-600 fill-primary-600' : 'text-gray-400'}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          {post.faculty}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          {post.department}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{post.author?.username || 'Anonim'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {post.file_url && (
        <a
          href={`http://localhost:5000/uploads/${post.file_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <FileText className="h-5 w-5" />
          <span>Dosyayı Görüntüle</span>
        </a>
      )}
    </div>
  );
};

export default PostCard;