import React, { useState } from "react";
import { User, Calendar, FileText, Bookmark, Trash2, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSavedPosts } from "../context/SavedPostContext";
import { postsAPI } from "../services/api";
import { ratingAPI } from "../services/api";

const PostCard = ({ post, onDelete, showStatus = false, maxLength = 200 }) => {
  const { savedPosts, toggleSavePost } = useSavedPosts();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const user = useAuth();

  const [rating, setRating] = useState(0); 
  const [avgRating, setAvgRating] = useState(post.avg_rating || 0); 
  const [ratingCount, setRatingCount] = useState(post.rating_count || 0);
  const [hoverRating, setHoverRating] = useState(0); 
  const [ratingLoading, setRatingLoading] = useState(false);

  const postOwner = post.user_id === user.user?._id;

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
      alert(
        "Gönderi silinirken bir hata oluştu, lütfen daha sonra tekrar deneyin"
      );
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (fileName) => {
    const apiUrl = import.meta.env.VITE_API_URL.replace("/api", "");

    if (fileName.startsWith("/uploads")) {
      return `${apiUrl}${fileName}`;
    }

    if (!fileName.startsWith("/")) {
      fileName = "/" + fileName;
    }
    return `${apiUrl}/uploads${fileName}`;
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
    fileUrls: post.file_urls || [],
    status: post.status || "pending",
  };
  const [showMore, setShowMore] = useState(false);
  const content = postData.content || "";
  const isLong = content.length > maxLength;
  const displayText =
    showMore || !isLong ? content : content.slice(0, maxLength) + "...";

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

  const getStarType = (index) => {
    if (avgRating >= index) return "full";
    if (avgRating >= index - 0.5) return "half";
    return "empty";
  };

  return (
    <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {showStatus && (
            <div className="mb-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
              >
                {statusBadge.label}
              </span>
            </div>
          )}

          <h3 className="text-xl font-semibold text-gray-900 dark:text-darktext mb-2">
            {postData.title}
          </h3>
          <p className="text-gray-800 dark:text-darktext text-sm mb-3  ">
            {displayText}
          </p>
          <div className="justify-end flex">
            {isLong && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-900 dark:text-primary hover:underline text-sm mt-1 justify-center items-center text-center"
              >
                {showMore ? "Daha az göster" : "Devamını oku"}
              </button>
            )}
          </div>
        </div>

        {isAuthenticated && postOwner && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="ml-4 p-2  rounded-full transition"
          >
            <Trash2 className="h-6 w-6 dark:text-darktext text-secondary" />
          </button>
        )}

        {isAuthenticated && (
          <button
            onClick={handleSaveToggle}
            disabled={loading}
            className="ml-4 p-2  rounded-full transition"
          >
            <Bookmark
              className={`h-6 w-6 ${
                isSaved
                  ? "text-[#003161] fill-[#003161] dark:text-darktext dark:fill-darktext"
                  : "text-gray-900 dark:text-darktext"
              }`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2F5755] text-primary">
          {postData.faculty}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#5A9690] text-primary">
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

      {postData.fileUrls && postData.fileUrls.length > 0 && (
        <div className="space-y-2">
          {postData.fileUrls.map((fileName, index) => (
            <a
              key={index}
              href={getFileUrl(fileName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 dark:text-[#C5D3E8] dark:hover:text-blue-700  hover:text-[#C5D3E8] text-blue-900 font-medium mr-4"
            >
              <FileText className="h-5 w-5" />
              <span>Dosya {fileName}</span>
            </a>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const type = getStarType(star);
          return (
            <Star
              key={star}
              className={`h-4 w-4 cursor-pointer ${
                type === "full"
                  ? "text-yellow-500 fill-yellow-500"
                  : type === "half"
                  ? "text-white fill-yellow-200"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={async () => {
                if (!isAuthenticated) {
                  alert("Oy vermek için giriş yapmalısınız");
                  return;
                }
                try {
                  setRatingLoading(true);
                  const res = await ratingAPI.ratePost(postId, star);
                  setRating(res.data.rated.rating);
                  setAvgRating(parseFloat(res.data.rating_info.avg_rating));
                  setRatingCount(res.data.rating_info.rating_count);
                } catch (err) {
                  alert("Oy verirken hata oluştu");
                } finally {
                  setRatingLoading(false);
                }
              }}
            />
          );
        })}
        <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          ({ratingCount > 0 ? `${parseFloat(avgRating).toFixed(1)}/5` : "0.0/5"})
        </span>
      </div>
    </div>
  );
};

export default PostCard;