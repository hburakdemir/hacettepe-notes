import React, { createContext, useState, useContext, useEffect } from 'react';
import { savedPostsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const SavedPostsContext = createContext();

export const useSavedPosts = () => useContext(SavedPostsContext);

export const SavedPostsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  
  const [loading, setLoading] = useState(true);


  const fetchSavedPosts = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await savedPostsAPI.getSavedPosts();
      const savedIds = res.data.map(p => String(p._id || p.id || p.postId || p.post_id));
      setSavedPosts(savedIds);
    } catch (err) {
      // console.error('Saved posts fetch error:', err);
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSavePost = async (postId) => {
    if (!isAuthenticated) return;
    const id = String(postId);

    try {
      if (savedPosts.includes(id)) {
        await savedPostsAPI.unsavePost(id);
        setSavedPosts(prev => prev.filter(pid => pid !== id));
      } else {
        await savedPostsAPI.savePost(id);
        setSavedPosts(prev => [...prev, id]);
      }
    } catch (err) {
      // console.error(' Toggle save post error:', err);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [isAuthenticated]);

  return (
    <SavedPostsContext.Provider value={{ savedPosts, toggleSavePost, loading, fetchSavedPosts }}>
      {children}
    </SavedPostsContext.Provider>
  );
};
