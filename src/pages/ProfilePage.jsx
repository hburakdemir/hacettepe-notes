import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { postsAPI, savedPostsAPI } from "../services/api";
import PostCard from "../components/PostCard";
import { User, Bookmark, FileText, Loader } from "lucide-react";
import { useSavedPosts } from "../context/SavedPostContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const { savedPosts, fetchSavedPosts } = useSavedPosts();
  const [savedPostsData, setSavedPostsData] = useState([]);
  const [activeTab, setActiveTab] = useState("my-posts");
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // gerçek id hangisi bilmiyorum deneye deneye buluyoruz :D
  const getPostId = (post) =>
    post._id || post.id || post.postId || post.post_id || post.ID;

  const fetchMyPosts = async () => {
    try {
      const res = await postsAPI.getMyPosts();
      setMyPosts(res.data);
    } catch (err) {
      console.error(" Kullanıcı postları hatası:", err);
      setMyPosts([]);
    }
  };

  const fetchSavedPostsData = async () => {
    try {
      const res = await savedPostsAPI.getSavedPosts();
      setSavedPostsData(res.data);
    } catch (err) {
      console.error("kaydedilen gönderiler gelmiyo:", err);
      setSavedPostsData([]);
    }
  };
  // İlk yüklemede hem kendi postlarını hem saved posts'ları getir
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchMyPosts(), fetchSavedPostsData()]);
      setLoading(false);
    };
    fetchAll();
  }, []);


   const handlePostDelete = async(deletedId) => {
    setMyPosts(prev => prev.filter(p=> String(getPostId(p)) !== String(deletedId)));
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
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-100">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.username}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "my-posts"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Paylaştığım Notlar ({myPosts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("saved-posts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "saved-posts"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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

      <div>
        {activeTab === "my-posts" && (
          <div>
            {myPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Henüz not paylaşmadınız.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myPosts.map((post) => (
                  <PostCard
                    key={getPostId(post)}
                    post={post}
                    onSaveToggle={fetchSavedPosts} 
                    onDelete={handlePostDelete}

                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "saved-posts" && (
          <div>
            {savedPostsData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Henüz not kaydetmediniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedPostsData.map((post) => (
                  <PostCard
                    key={getPostId(post)}
                    post={post}
                    isSaved={true}
                    onSaveToggle={fetchSavedPostsData}
                    onDelete={handlePostDelete}
                  />
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
