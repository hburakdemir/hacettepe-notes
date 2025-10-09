import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { postsAPI, savedPostsAPI, profileupdateAPI } from "../services/api";
import PostCard from "../components/PostCard";
import { User, Bookmark, FileText, Loader, Edit2, X, AlertCircle, CheckCircle } from "lucide-react";
import { useSavedPosts } from "../context/SavedPostContext";

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
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

    if (Object.keys(updates).length === 0) {
      setError("Hiçbir değişiklik yapmadınız.");
      setUpdateLoading(false);
      return;
    }

    try {
      const response = await profileupdateAPI.updateProfile(updates);
      
      // console.log('backend responsu', response.data);
      

      updateUser(response.data.user);
      
      setSuccess("Profil başarıyla güncellendi!");
      
      // 2 saniye sonra modalı kapat
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Güncelleme hatası:', err);
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
        {/* Profil Kartı */}
        <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-4 sm:p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
            {/* Sol taraf - Profil bilgileri */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2F5755] dark:bg-darktext flex-shrink-0">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary dark:text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-darktext truncate">
                 {user?.username}
                </h1>
                <p className="text-md sm:text-sm text-gray-600 dark:text-[#948c80] truncate">
                  {user?.full_name}
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-[#DFD0B8] truncate">
                  {user?.email}
                </p>
                {user?.phone && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-[#DFD0B8] mt-1">
                    {user.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Sağ taraf - Düzenle butonu */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#2F5755] hover:bg-[#5A9690] text-primary dark:bg-[#DFD0B8] dark:text-secondary hover:dark:bg-[#331D2C] hover:dark:text-darktext rounded-lg transition w-full sm:w-auto text-sm sm:text-base flex-shrink-0"
            >
              <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Düzenle</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("my-posts")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition whitespace-nowrap ${
                  activeTab === "my-posts"
                    ? "border-blue-800 text-blue-900 dark:border-darkhover dark:text-darktext"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-primary "
                }`}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Paylaştığım ({myPosts.length})</span>
                  <span className="xs:hidden">Postlar ({myPosts.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("saved-posts")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition whitespace-nowrap ${
                  activeTab === "saved-posts"
                    ? "border-blue-800 text-blue-900 dark:border-darkhover dark:text-darktext"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-primary "
                }`}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Kaydedilenler ({savedPosts.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Posts Content */}
        <div>
          {activeTab === "my-posts" && (
            <div>
              {myPosts.length === 0 ? (
                <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-8 sm:p-12 text-center">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">
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
                <div className="bg-primary rounded-lg shadow-md p-8 sm:p-12 text-center">
                  <Bookmark className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">
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

      {/* Düzenleme Modalı - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-xl w-full max-w-md mx-auto p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Kapat Butonu */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 dark:text-darktext z-10"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Başlık */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-darktext mb-4 sm:mb-6 pr-8">
              Profili Düzenle
            </h2>

            {/* Hata Mesajı */}
            {error && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}

            {/* Başarı Mesajı */}
            {success && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2 text-green-700">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm">{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* İsim Soyisim */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-darktext mb-1">
                  İsim Soyisim
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755] focus:border-transparent dark:bg-darkbg dark:text-darktext dark:border-gray-600"
                  placeholder="İsim Soyisim"
                />
              </div>

              {/* Kullanıcı Adı */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-darktext mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755] focus:border-transparent dark:bg-darkbg dark:text-darktext dark:border-gray-600"
                  placeholder="Kullanıcı Adı"
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-darktext mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5755] focus:border-transparent dark:bg-darkbg dark:text-darktext dark:border-gray-600"
                  placeholder="05551234567"
                />
              </div>

              {/* Email (disabled) */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-[#948979] mb-1">
                  Email (Değiştirilemez)
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                />
              </div>

              {/* Butonlar */}
              <div className="flex flex-col-reverse sm:flex-row space-y-reverse space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={updateLoading}
                  className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition dark:border-gray-600 dark:text-darktext dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-[#2F5755] hover:bg-[#5A9690] text-primary dark:bg-[#DFD0B8] dark:text-secondary hover:dark:bg-[#331D2C] hover:dark:text-darktext rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-2 sm:mb-0"
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