import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Loader,
  Shield,
} from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending-posts");
  const [pendingPosts, setPendingPosts] = useState([]);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";
  const isModerator = user?.role === "moderator" || user?.role === "admin";

  useEffect(() => {
    if (user?.role) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    // console.log("fetchData başladı...");
    setLoading(true);
    try {
      const userRole = user?.role;

      if (userRole === "moderator" || userRole === "admin") {
        // Pending posts
        try {
          const pendingRes = await adminAPI.getPendingPosts();
          setPendingPosts(pendingRes.data);
        } catch (err) {
          // console.error("Pending posts hatası:", err);
        }

        // Approved posts
        try {
          const approvedRes = await adminAPI.getApprovedPosts();
          // console.log(" APPROVED POSTS  DATA:", approvedRes.data);
          setApprovedPosts(approvedRes.data);
        } catch (err) {
          // console.error(" Approved posts hatası:", err);
          // console.error("Approved posts hatası:", err);
        }

        // All posts with status (rejected için)
        try {
          const allPostsRes = await adminAPI.getAllPostsWithStatus();
          const rejected = allPostsRes.data.filter(
            (post) => post.status === "rejected"
          );
          setRejectedPosts(rejected);
        } catch (err) {
          // console.error("All posts hatası:", err);
        }
      }

      if (userRole === "admin") {
        try {
          const usersRes = await adminAPI.getAllUsers();
          // console.log(" Gelen kullanıcı verisi:", usersRes.data);
          setAllUsers(usersRes.data);
        } catch (err) {
          // console.error("Users hatası:", err);
        }
      }
    } catch (err) {
      // console.error("Genel veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (fileUrl) => {
    const apiUrl = import.meta.env.VITE_API_URL.replace("/api", "");

    if (fileUrl.startsWith("/uploads")) {
      return `${apiUrl}${fileUrl}`;
    }

    if (!fileUrl.startsWith("/")) {
      fileUrl = "/" + fileUrl;
    }
    return `${apiUrl}/uploads${fileUrl}`;
  };

  const handleApprove = async (postId) => {
    // console.log(" Post onaylanıyor:", postId);
    try {
      const response = await adminAPI.approvePost(postId);
      // console.log(" Approve response:", response);
      alert("Post onaylandı!");
      fetchData();
    } catch (err) {
      // console.error(" Onaylama hatası:", err);
      // console.error(" Error response:", err.response);
      alert("Post onaylanırken hata oluştu");
    }
  };

  const handleReject = async (postId) => {
    // console.log(" Post reddediliyor:", postId);
    try {
      const response = await adminAPI.rejectPost(postId);
      // console.log(" Reject response:", response);
      alert("Post reddedildi!");
      fetchData();
    } catch (err) {
      // console.error(" Reddetme hatası:", err);
      // console.error("Error response:", err.response);
      alert("Post reddedilirken hata oluştu");
    }
  };

  const handleDelete = async (postId) => {
    if (
      !window.confirm(
        "Bu postu kalıcı olarak silmek istediğinize emin misiniz?"
      )
    ) {
      return;
    }
    // console.log(" Post siliniyor:", postId);
    try {
      const response = await adminAPI.deletePostAdmin(postId);
      // console.log(" Delete response:", response);
      alert("Post silindi!");
      fetchData();
    } catch (err) {
      // console.error(" Silme hatası:", err);
      // console.error(" Error response:", err.response);
      alert("Post silinirken hata oluştu");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (
      !window.confirm(
        `Bu kullanıcının rolünü ${newRole} olarak değiştirmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }
    // console.log(" Rol değiştiriliyor:", userId, "=>", newRole);
    try {
      const response = await adminAPI.updateUserRole(userId, newRole);
      // console.log(" Role update response:", response);
      alert("Kullanıcı rolü güncellendi!");
      fetchData();
    } catch (err) {
      // console.error(" Rol güncelleme hatası:", err);
      // console.error(" Error response:", err.response);
      alert("Rol güncellenirken hata oluştu");
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) {
      return;
    }
    try {
      const response = await adminAPI.deleteUser(userId);
      console.log("silinen kullanıcı", response);
      setAllUsers((prev) => prev.filter((user) => user.id !== userId));
      alert("kullanıcı silindi");
    } catch (err) {
      alert("kullanıcı silinirken bi şeyler yanlış gitti");
      console.error(err);
    }
  };

  const handleEmailVerificationToggle = async (userId, currentStatus) => {
    if (
      !window.confirm(
        `Bu kullanıcının email onayını ${currentStatus ? "iptal etmek" : "onaylamak"} istediğine emin misiniz?`
      )
    ) {
      return;
    }
    try {
      await adminAPI.updateUserEmail(userId, !currentStatus);
      alert("Değiştiridn");
      fetchData();
    } catch (err) {
      alert("Başarısız oldu");
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-[#2F5755]" />
      </div>
    );
  }

  if (!isModerator) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            Yetkisiz Erişim
          </h2>
          <p className="text-red-700">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-primary mb-2 flex items-center">
            <Shield className="h-10 w-10 mr-3 text-[#2F5755] dark:text-primary" />
            {isAdmin ? "Admin Paneli" : "Moderatör Paneli"}
          </h1>
          <p className="text-gray-600 dark:text-darktext">
            Hoşgeldiniz, {user?.username} ({user?.role})
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 md:space-x-8 px-4 md:px-6 overflow-x-auto scrollbar-hide">
              {isModerator && (
                <>
                  <button
                    onClick={() => setActiveTab("pending-posts")}
                    className={`py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
                      activeTab === "pending-posts"
                        ? "border-[#2F5755] text-[#2F5755]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 dark:text-darktext" />
                      <span className="hidden sm:inline dark:text-darktext ">
                        Onay Bekleyenler ({pendingPosts.length})
                      </span>
                      <span className="sm:hidden">
                        Bekleyen ({pendingPosts.length})
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("approved-posts")}
                    className={`py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
                      activeTab === "approved-posts"
                        ? "border-[#2F5755] text-[#2F5755]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 dark:text-darktext" />
                      <span className="hidden sm:inline dark:text-darktext">
                        Onaylananlar ({approvedPosts.length})
                      </span>
                      <span className="sm:hidden">
                        Onaylı ({approvedPosts.length})
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("rejected-posts")}
                    className={`py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
                      activeTab === "rejected-posts"
                        ? "border-[#2F5755] text-[#2F5755]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 dark:text-darktext" />
                      <span className="hidden sm:inline dark:text-darktext">
                        Reddedilenler ({rejectedPosts.length})
                      </span>
                      <span className="sm:hidden">
                        Reddedilen ({rejectedPosts.length})
                      </span>
                    </div>
                  </button>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={() => setActiveTab("users")}
                  className={`py-4 px-2 md:px-1 border-b-2 font-medium text-xs md:text-sm transition whitespace-nowrap ${
                    activeTab === "users"
                      ? "border-[#2F5755] text-[#2F5755]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Users className="h-4 w-4 md:h-5 md:w-5 dark:text-darktext" />
                    <span className="hidden sm:inline dark:text-darktext">
                      Kullanıcılar ({allUsers.length})
                    </span>
                    <span className="sm:hidden">
                      Kullanıcı ({allUsers.length})
                    </span>
                  </div>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Content bölümü */}
        <div>
          {/* Onay Bekleyen Postlar */}
          {activeTab === "pending-posts" && (
            <div>
              {pendingPosts.length === 0 ? (
                <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Onay bekleyen gönderi bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div
                      key={post.post_id}
                      className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-3 py-1 bg-[#E9E294] text-[#344F1F] text-xs font-medium rounded-full">
                              Onay Bekliyor
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(post.created_at)}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-darktext">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-3 dark:text-darktext">
                            {post.content}
                          </p>
                          {post.file_urls && post.file_urls.length > 0 && (
                            <div className="mb-3">
                              {post.file_urls.map((fileName, index) => (
                                <a
                                  key={index}
                                  href={getFileUrl(fileName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mr-3"
                                >
                                  <FileText className="h-5 w-5" />
                                  <span>Dosya {index + 1}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#2F5755] text-primary text-sm rounded-full text-center">
                              {post.faculty}
                            </span>
                            <span className="px-3 py-1 bg-[#5A9690] text-primary text-sm rounded-full text-center">
                              {post.department}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Paylaşan: <strong>{post.username}</strong> (
                            {post.full_name})
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprove(post.post_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#2F5755] hover:bg-[#5A9690] text-primary rounded-lg transition"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Onayla</span>
                        </button>
                        <button
                          onClick={() => handleReject(post.post_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#C59560] hover:bg-[#FCC61D] text-primary rounded-lg transition"
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Reddet</span>
                        </button>
                        <button
                          onClick={() => handleDelete(post.post_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#660B05] hover:bg-[#8C1007] text-primary rounded-lg transition"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Onaylanan Postlar */}
          {activeTab === "approved-posts" && (
            <div>
              {approvedPosts.length === 0 ? (
                <div className="bg-primary rounded-lg shadow-md p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Onaylanmış gönderi bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedPosts.map((post) => (
                    <div
                      key={post.post_id}
                      className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-3 py-1 bg-[#5A9690] text-primary text-xs font-medium rounded-full">
                              Onaylandı
                            </span>
                            <span className="text-sm text-gray-500">
                              Paylaşılma: {formatDate(post.created_at)}
                            </span>
                            {post.approved_at && (
                              <span className="text-sm text-[#5A9690] font-medium">
                                Onaylanma: {formatDate(post.approved_at)}
                              </span>
                            )}
                          </div>

                          {post.approver_username && (
                            <div className="mb-2">
                              <span className="text-sm bg-[#239BA7] text-primary px-3 py-1 rounded-full">
                                Onaylayan: <strong>{post.approver_name}</strong>{" "}
                                (@{post.approver_username})
                              </span>
                            </div>
                          )}

                          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-darktext">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-darktext mb-3 ">
                            {post.content}
                          </p>
                          {post.file_urls && post.file_urls.length > 0 && (
                            <div className="mb-3">
                              {post.file_urls.map((fileName, index) => (
                                <a
                                  key={index}
                                  href={getFileUrl(fileName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mr-3"
                                >
                                  <FileText className="h-5 w-5" />
                                  <span>Dosya {index + 1}</span>
                                </a>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#2F5755] text-primary text-sm rounded-full text-center">
                              {post.faculty}
                            </span>
                            <span className="px-3 py-1 bg-[#5A9690] text-primary text-sm rounded-full text-center">
                              {post.department}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Paylaşan: <strong>{post.username}</strong>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(post.post_id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#660B05] hover:bg-[#8C1007] text-primary rounded-lg transition"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>Kalıcı Sil</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reddedilen Postlar */}
          {activeTab === "rejected-posts" && (
            <div>
              {rejectedPosts.length === 0 ? (
                <div className="bg-primary rounded-lg shadow-md p-12 text-center">
                  <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Reddedilen gönderi bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rejectedPosts.map((post) => (
                    <div
                      key={post.post_id}
                      className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-3 py-1 bg-[#660B05] text-primary text-xs font-medium rounded-full">
                              Reddedildi
                            </span>
                            <span className="text-sm text-gray-500">
                              Paylaşılma: {formatDate(post.created_at)}
                            </span>
                            {post.rejected_at && (
                              <span className="text-sm text-[#8C1007] font-medium">
                                Reddedilme: {formatDate(post.rejected_at)}
                              </span>
                            )}
                          </div>

                          {post.rejecter_username && (
                            <div className="mb-2">
                              <span className="text-sm text-primary bg-[#9e2d2d] px-3 py-1 rounded-full">
                                Reddeden: <strong>{post.rejecter_name}</strong>{" "}
                                (@
                                {post.rejecter_username})
                              </span>
                            </div>
                          )}

                          <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-darktext">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-3 dark:text-darktext">
                            {post.content}
                          </p>
                          {post.file_urls && post.file_urls.length > 0 && (
                            <div className="mb-3">
                              {post.file_urls.map((fileName, index) => (
                                <a
                                  key={index}
                                  href={getFileUrl(fileName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mr-3"
                                >
                                  <FileText className="h-5 w-5" />
                                  <span>Dosya {index + 1}</span>
                                </a>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#2F5755] text-primary text-sm rounded-full text-center">
                              {post.faculty}
                            </span>
                            <span className="px-3 py-1 bg-[#5A9690] text-primary text-sm rounded-full text-center">
                              {post.department}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Paylaşan: <strong>{post.username}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprove(post.post_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#2F5755] hover:bg-[#5A9690] text-primary rounded-lg transition"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Onayla</span>
                        </button>
                        <button
                          onClick={() => handleDelete(post.post_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#660B05] hover:bg-[#8C1007] text-primary rounded-lg transition"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span>Kalıcı Sil</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Kullanıcılar f (Sadece Admin) */}
          {activeTab === "users" && isAdmin && (
            <div>
              {allUsers.length === 0 ? (
                <div className="bg-primary  rounded-lg shadow-md p-12 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-darktext text-lg">
                    Kullanıcı bulunmuyor.
                  </p>
                </div>
              ) : (
                <>
                  {/* normal menü  */}
                  <div className="hidden lg:block bg-primary dark:bg-darkbgbutton rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-darkbgbutton">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-secondary dark:text-darktext uppercase tracking-wider">
                            Kullanıcı
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-secondary dark:text-darktext uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-secondary dark:text-darktext uppercase tracking-wider">
                            Telefon
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-secondary dark:text-darktext uppercase tracking-wider">
                            Rol
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-secondary dark:text-darktext uppercase tracking-wider">
                            Email Doğrulandı
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-secondary dark:text-darktext uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-primary dark:bg-darkbgbutton divide-y divide-gray-200">
                        {allUsers.map((userItem) => (
                          <tr key={userItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-secondary dark:text-darktext">
                                  {userItem.full_name}
                                </div>
                                <div className="text-sm text-secondary dark:text-darktext">
                                  @{userItem.username}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary dark:text-darktext">
                              {userItem.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary dark:text-darktext">
                              {userItem.phone || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  userItem.role === "admin"
                                    ? "bg-[#FAB12F] text-[#134686]"
                                    : userItem.role === "moderator"
                                      ? "bg-[#004030] text-[#FFF9E5]"
                                      : "bg-black text-[#FFE8DB]"
                                }`}
                              >
                                {userItem.role || "user"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm items-center space-x-2">
                              <button
                                onClick={() =>
                                  handleEmailVerificationToggle(
                                    userItem.id,
                                    userItem.email_verified
                                  )
                                }
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                                  userItem.email_verified
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                {userItem.email_verified
                                  ? "Doğrulandı"
                                  : " Doğrulanmadı"}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-2">
                              <select
                                value={userItem.role || "user"}
                                onChange={(e) =>
                                  handleRoleChange(userItem.id, e.target.value)
                                }
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                disabled={userItem.id === user?.id}
                              >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>

                              <button
                                onClick={() => handleUserDelete(userItem.id)}
                                className="text-[#660B05] hover:text-[#8C1007] "
                              >
                                <Trash2 className="h-6 w-6" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* mobil kart layout  */}
                  <div className="lg:hidden space-y-4">
                    {allUsers.map((userItem) => (
                      <div
                        key={userItem.id}
                        className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-4"
                      >
                        {/* /bilgiler  */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-secondary dark:text-darktext">
                              {userItem.full_name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-darktext">
                              @{userItem.username}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              userItem.role === "admin"
                                ? "bg-[#FAB12F] text-[#134686]"
                                : userItem.role === "moderator"
                                  ? "bg-[#004030] text-[#FFF9E5]"
                                  : "bg-black text-[#FFE8DB]"
                            }`}
                          >
                            {userItem.role || "user"}
                          </span>
                          <button
                            onClick={() => handleUserDelete(userItem.id)}
                            className="text-[#660B05] hover:text-[#8C1007]"
                          >
                            <Trash2 className="h-6 w-6" />
                          </button>
                        </div>

                        {/* bilgiler */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 dark:text-[#948979]  w-16">
                              Email:
                            </span>
                            <span className="text-secondary dark:text-darktext flex-1 break-all">
                              {userItem.email}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 w-16 dark:text-[#948979]">
                              Telefon:
                            </span>
                            <span className="text-secondary dark:text-darktext">
                              {userItem.phone || "-"}
                            </span>
                          </div>
                        </div>

                        {/* rol değişim açılır menü */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 ">
                          <span className="text-sm text-gray-600 dark:text-darktext">
                            Rol Değiştir:
                          </span>

                          <select
                            value={userItem.role || "user"}
                            onChange={(e) =>
                              handleRoleChange(userItem.id, e.target.value)
                            }
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-primary dark:bg-darkbgbutton dark:text-darktext"
                            disabled={userItem.id === user?.id}
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
