import React, { useState } from "react";
import { User, Calendar, FileText, Bookmark, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSavedPosts } from "../context/SavedPostContext";
import { postsAPI } from "../services/api";

const PostCard = ({ post, onDelete }) => {
  const { savedPosts, toggleSavePost } = useSavedPosts();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const user = useAuth();


  const postOwner = post.author?._id === user.user?._id;

  // Post ID normalize
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
      console.error("post ıd yok ", post9);
      alert(
        "post zaten silinmiş, sayfayı yenileyin ya da daha sonra tekrar deneyin"
      );
      return;
    }
    if (!window.confirm("Bu gönderiyi silicek misiniz ?")) {
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
    content: post.content || post.content,
    faculty: post.faculty,
    department: post.department,
    author: {
      username: post.username || post.author?.username,
      full_name: post.full_name || post.author?.full_name,
    },
    createdAt: post.created_at || post.createdAt,
    fileUrl: post.file_url || post.fileUrl,
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {postData.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{postData.content}</p>
        </div>

        {isAuthenticated && user?.username === postOwner && (
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
                isSaved ? "text-primary-600 fill-primary-600" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          {postData.faculty}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          {postData.department}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{postData.author.username || "Anonim"}</span>
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
