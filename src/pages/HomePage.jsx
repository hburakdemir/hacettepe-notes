import React, { useState, useEffect } from "react";
import { postsAPI } from "../services/api";
import PostCard from "../components/PostCard";
import { Search, Loader } from "lucide-react";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

 // post ıd deneme yanılma
  const getPostId = (post) =>
    post._id || post.id || post.postId || post.post_id || post.ID;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      // console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = async (deletedId) => {
    setPosts((prev) =>
      prev.filter((p) => String(getPostId(p)) !== String(deletedId))
    );
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty =
      selectedFaculty === "" || post.faculty === selectedFaculty;

    return matchesSearch && matchesFaculty;
  });

  const faculties = [...new Set(posts.map((post) => post.faculty))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <Loader className="h-12 w-12 animate-spin text-[#2F5755]" />
      </div>
    );
  }

  return (
    <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tüm Notlar</h1>
        <p className="text-gray-600">
          Öğrenciler tarafından paylaşılan ders notlarını inceleyin
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5A9690]" />
            <input
              type="text"
              placeholder="Not, açıklama veya bölüm ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg  focus:border-transparent"
            />
          </div>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg  bg-[#E0D9D9] focus:border-transparent"
          >
            <option value="">Tüm Fakülteler</option>
            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Henüz not paylaşılmamış.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {filteredPosts.map((post) => (
            <div key={getPostId(post)} className="break-inside-avoid">
              <PostCard
                post={post}
                onSaveToggle={fetchPosts}
                onDelete={handlePostDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
