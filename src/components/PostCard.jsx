import React, { useState } from "react";
import { User, Calendar, FileText, Bookmark, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSavedPosts } from "../context/SavedPostContext";
import { postsAPI } from "../services/api";

const PostCard = ({ post, onDelete, showStatus = false }) => {
  const { savedPosts, toggleSavePost } = useSavedPosts();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const user = useAuth();

  console.log("postlar", post);

  const postOwner = post.user_id === user.user?._id;
  console.log("post sahibi :::", postOwner);

  // Post ID normalize deneme yanılma
  const getPostId = (post) =>
    post._id || post.id || post.postId || post.post_id;
  const postId = String(getPostId(post));
  const isSaved = savedPosts.includes(postId);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      alert("Kaydetmek için giriş yapmalısınız");
      return;
    }

    if (!postId) {
      console.error("❌ POST ID BULUNAMADI!", post);
      alert("Post ID bulunamadı. Lütfen sayfayı yenileyin.");
      return;
    }

    setLoading(true);
    await toggleSavePost(postId);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert("oturum süreniz dolmuştur lütfen tekrar giriş yapın");
      return;
    }
    if (!postId) {
      console.error("post ıd yok ", post);
      alert(
        "post zaten silinmiş, sayfayı yenileyin ya da daha sonra tekrar deneyin"
      );
      return;
    }
    if (!window.confirm("Bu gönderiyi silecek misiniz ?")) {
      return;
    }

    try {
      setLoading(true);
      await postsAPI.deletePost(postId);
      if (onDelete) onDelete(postId);
      alert("Gönderi başarıyla silindi");
    } catch (err) {
      console.error("frontend silme hatası", err);
      alert(
        "Gönderi silinirken bir hata oluştu, lütfen daha sonra tekrar deneyin"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const postData = {
    title: post.title,
    content: post.content,
    faculty: post.faculty,
    department: post.department,
    username: post.username,
    full_name: post.full_name,
    createdAt: post.createdAt || post.created_at,
    fileUrl: post.fileUrl || post.file_url,
    status: post.status || "pending",
  };

  // status badge renkleri
  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Onaylandı",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Onay Bekliyor",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Reddedildi",
      },
    };
    return badges[status] || badges.pending;
  };

  const statusBadge = getStatusBadge(postData.status);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {/* Status Badge - Sadece showStatus true ise göster */}
          {showStatus && (
            <div className="mb-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
              >
                {statusBadge.label}
              </span>
            </div>
          )}

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {postData.title}
          </h3>
          <p className="text-gray-800 text-sm mb-3">{postData.content}</p>
        </div>

        {isAuthenticated && postOwner && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Trash2 className="h-6 w-6" />
          </button>
        )}

        {isAuthenticated && (
          <button
            onClick={handleSaveToggle}
            disabled={loading}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Bookmark
              className={`h-6 w-6 ${
                isSaved ? "text-[#003161] fill-[#003161]" : "text-gray-900"
              }`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2F5755] text-white">
          {postData.faculty}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#5A9690] text-white">
          {postData.department}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{postData.username || "Anonim"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(postData.createdAt)}</span>
          </div>
        </div>
      </div>
      {postData.fileUrl && (
        <a
          href={postData.fileUrl}
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
