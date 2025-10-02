import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { postsAPI } from "../services/api";
import PostCard from "../components/PostCard";
import { ArrowLeft, Loader } from "lucide-react";

const DepartmentDetailPage = () => {
  const { faculty, department } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // deneme yanılma helper
  const getPostId = (post) =>
    post._id || post.id || post.postId || post.post_id || post.ID;

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
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = async (deletedId) => {
    setPosts((prev) =>
      prev.filter((p) => String(getPostId(p)) !== String(deletedId))
    );
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
        className="inline-flex items-center space-x-2 text-[#5A9690] hover:text-[#2F5755] mb-6"
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
          <p className="text-gray-600 text-lg mb-4">
            Bu bölüm için henüz not paylaşılmamış.
          </p>
          <Link
            to="/add-post"
            className="bg-[#2F5755] hover:bg-[#5A9690] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
          >
            İlk Notu Siz Paylaşın
          </Link>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {posts.map((post) => (
            <div key={getPostId(post)} className="break-inside-avoid">
              <PostCard
                post={post}
                onSaveToggle={fetchDepartmentPosts}
                onDelete={handlePostDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPage;
