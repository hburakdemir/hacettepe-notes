import { ratePostModel, getPostRatingModel } from "../models/ratingModel.js";

export async function ratePostController(req, res) {
  try {
    const { post_id, rating } = req.body;
    const user_id = req.user.userId;

    if (!post_id || !rating)
      return res.status(400).json({ message: "Eksik veri" });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating 1-5 arasında olmalı" });

    const rated = await ratePostModel(user_id, post_id, rating);
    const postRating = await getPostRatingModel(post_id);

    res.status(200).json({
      message: "Rating kaydedildi",
      rated,
      rating_info: postRating,
    });

  } catch (err) {
    console.error("Rating hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

export async function getPostRatingController(req, res) {
  try {
    const { post_id } = req.params;

    const ratingInfo = await getPostRatingModel(post_id);
    res.json(ratingInfo);

  } catch (err) {
    console.error("Rating bilgisi alınamadı:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}
