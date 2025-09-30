import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI, savedPostsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { User, Bookmark, FileText, Loader } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-posts');
  const [myPosts, setMyPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcının kendi postlarını getir
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await postsAPI.getMyPosts(); // backend’de /posts/my-posts var
      setMyPosts(res.data);
    } catch (err) {
      console.error("My posts fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Kaydedilen postları getir
  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const res = await savedPostsAPI.getSavedPosts();
      setSavedPosts(res.data);
    } catch (err) {
      console.error("Saved posts fetch error:", err);
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
    fetchSavedPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-100">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'my-posts'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Paylaştığım Notlar ({myPosts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('saved-posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'saved-posts'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bookmark className="h-5 w-5" />
                <span>Kaydedilenler ({savedPosts.length})</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'my-posts' && (
          <div>
            {myPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Henüz not paylaşmadınız.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myPosts.map((post) => (
                  <PostCard key={post.id} post={post} onSaveToggle={fetchMyPosts} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved-posts' && (
          <div>
            {savedPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Henüz not kaydetmediniz.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedPosts.map((post) => (
                  <PostCard key={post.id} post={post} onSaveToggle={fetchSavedPosts} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
