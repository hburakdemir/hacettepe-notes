import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { postsAPI, savedPostsAPI, profileupdateAPI } from "../services/api";
import PostCard from "../components/PostCard";
import { User, Bookmark, FileText, Loader, Edit2, X, AlertCircle, CheckCircle } from "lucide-react";
import { useSavedPosts } from "../context/SavedPostContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const { savedPosts, fetchSavedPosts } = useSavedPosts();
  const [savedPostsData, setSavedPostsData] = useState([]);
  const [activeTab, setActiveTab] = useState("my-posts");
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getPostId = (post) =>
    post._id || post.id || post.postId || post.post_id || post.ID;

  const fetchMyPosts = async () => {
    try {
      const res = await postsAPI.getMyPosts();
      setMyPosts(res.data);
    } catch (err) {
      setMyPosts([]);
    }
  };

  const fetchSavedPostsData = async () => {
    try {
      const res = await savedPostsAPI.getSavedPosts();
      setSavedPostsData(res.data);
    } catch (err) {
      setSavedPostsData([]);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchMyPosts(), fetchSavedPostsData()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Modal açıldığında mevcut bilgileri doldur
  useEffect(() => {
    if (isModalOpen && user) {
      setFormData({
        full_name: user.full_name || "",
        username: user.username || "",
        phone: user.phone || "",
      });
      setError("");
      setSuccess("");
    }
  }, [isModalOpen, user]);

  const handlePostDelete = async (deletedId) => {
    setMyPosts((prev) =>
      prev.filter((p) => String(getPostId(p)) !== String(deletedId))
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError("");
    setSuccess("");

    // Sadece değişen alanları gönder
    const updates = {};
    if (formData.full_name.trim() !== user?.full_name) {
      updates.full_name = formData.full_name.trim();
    }
    if (formData.username.trim() !== user?.username) {
      updates.username = formData.username.trim();
    }
    if (formData.phone.trim() !== (user?.phone || "")) {
      updates.phone = formData.phone.trim();
    }

    // Hiçbir değişiklik yoksa
    if (Object.keys(updates).length === 0) {
      setError("Hiçbir değişiklik yapmadınız.");
      setUpdateLoading(false);
      return;
    }

    try {
      await profileupdateAPI.updateProfile(updates);
      setSuccess("Profil başarıyla güncellendi!");
      
      // 2 saniye sonra modalı kapat ve sayfayı yenile
      setTimeout(() => {
        setIsModalOpen(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Güncelleme başarısız oldu.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-[#2F5755]" />
      </div>
    );
  }

  return (
    <div className="bg-primary dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#2F5755] dark:bg-darktext">
                <User className="h-10 w-10 text-primary dark:text-secondary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-darktext">
                  {user?.username}
                </h1>
                <p className="text-gray-600 dark:text-[#DFD0B8]">{user?.email}</p>
                {user?.phone && (
                  <p className="text-gray-500 dark:text-[#DFD0B8] text-sm mt-1">
                    {user.phone}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#2F5755] hover:bg-[#5A9690] text-primary dark:bg-[#DFD0B8] dark:text-secondary hover:dark:bg-[#331D2C] hover:dark:text-darktext rounded-lg transition"
            >
              <Edit2 className="h-5 w-5" />
              <span className="hidden sm:inline">Profili Düzenle</span>
              <span className="sm:hidden">Düzenle</span>
            </button>
          </div>
        </div>

        <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("my-posts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "my-posts"
                    ? "border-blue-800 text-blue-900 dark:border-darkhover dark:text-darktext"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-primary "
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
                    ? "border-blue-800 text-blue-900 dark:border-darkhover dark:text-darktext"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-primary "
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
                <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Henüz not paylaşmadınız.
                  </p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                  {myPosts.map((post) => (
                    <div key={getPostId(post)} className="break-inside-avoid">
                      <PostCard
                        post={post}
                        onSaveToggle={fetchSavedPosts}
                        onDelete={handlePostDelete}
                        showStatus={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "saved-posts" && (
            <div>
              {savedPostsData.length === 0 ? (
                <div className="bg-primary rounded-lg shadow-md p-12 text-center">
                  <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Henüz not kaydetmediniz.
                  </p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2  gap-6 space-y-6">
                  {savedPostsData.map((post) => (
                    <div key={getPostId(post)} className="break-inside-avoid">
                      <PostCard
                        post={post}
                        isSaved={true}
                        onSaveToggle={fetchSavedPostsData}
                        onDelete={handlePostDelete}
                        showStatus={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

          {/* düzenleme modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-darktext"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-darktext mb-6">
              Profili Düzenle
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darktext mb-1">
                  İsim Soyisim
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755] focus:border-transparent dark:bg-darkbg dark:text-darktext dark:border-gray-600"
                  placeholder="İsim Soyisim"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darktext mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755] focus:border-transparent dark:bg-darkbg dark:text-darktext dark:border-gray-600"
                  placeholder="Kullanıcı Adı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darktext mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755] focus:border-transparent dark:bg-darkbg dark:text-darktext dark:border-gray-600"
                  placeholder="05551234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-[#948979] mb-1">
                  Email (Değiştirilemez)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={updateLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-darktext dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 px-4 py-2 bg-[#2F5755] hover:bg-[#5A9690] text-primary dark:bg-[#DFD0B8] dark:text-secondary hover:dark:bg-[#331D2C] hover:dark:text-darktext rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? "Güncelleniyor..." : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;