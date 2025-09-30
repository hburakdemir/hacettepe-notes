import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { ArrowLeft, Loader } from 'lucide-react';

const DepartmentDetailPage = () => {
  const { faculty, department } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentPosts();
  }, [faculty, department]);

  const fetchDepartmentPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      const filteredPosts = response.data.filter(
        (post) =>
          post.faculty === decodeURIComponent(faculty) &&
          post.department === decodeURIComponent(department)
      );
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/departments"
        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Bölümlere Dön</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {decodeURIComponent(department)}
        </h1>
        <p className="text-gray-600">{decodeURIComponent(faculty)}</p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            Bu bölüm için henüz not paylaşılmamış.
          </p>
          <Link to="/add-post" className="btn-primary inline-block">
            İlk Notu Siz Paylaşın
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onSaveToggle={fetchDepartmentPosts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPage;