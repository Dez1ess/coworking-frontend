import React, { useState, useEffect } from "react";
import axios from "axios";

interface Review {
  review_id: number;
  username: string;
  review_date: string;
  rating: number;
  review_text: string;
  user_id: number;
}

interface ReviewStats {
  total_reviews: number;
  average_rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="reviews-card-top-stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`star ${
            i < Math.round(rating) ? "star--filled" : "star--empty"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Reviews_Section() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total_reviews: 0,
    average_rating: 0,
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        // Декодуйте токен щоб отримати user_id
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload:", tokenPayload);
        console.log("User ID from token:", tokenPayload.id);

        const reviewsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReviews(reviewsRes.data);
        console.log("Reviews data:", reviewsRes.data);

        // calculate stats locally
        const total_reviews = reviewsRes.data.length;
        const average_rating =
          total_reviews > 0
            ? reviewsRes.data.reduce(
                (acc: number, r: Review) => acc + r.rating,
                0
              ) / total_reviews
            : 0;

        setStats({ total_reviews, average_rating });

        // Використовуйте user_id з токена
        setCurrentUserId(tokenPayload.id);
        console.log("Current User ID set to:", tokenPayload.id);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, []);
  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setRating(5);
    setText("");
    setShowModal(true);
  };

  const openEditModal = (review: Review) => {
    setIsEditing(true);
    setEditId(review.review_id);
    setRating(review.rating);
    setText(review.review_text);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      if (isEditing && editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/reviews/${editId}`,
          { rating, review_text: text },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReviews((prev) =>
          prev.map((r) => (r.review_id === editId ? { ...r, ...res.data } : r))
        );
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/reviews`,
          { rating, review_text: text },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReviews((prev) => [res.data, ...prev]);
      }

      // recalc stats
      const total_reviews = reviews.length + 1;
      const average_rating =
        (reviews.reduce((acc, r) => acc + r.rating, 0) + rating) /
        total_reviews;
      setStats({ total_reviews, average_rating });

      closeModal();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (reviewId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));

    // recalc stats
    const total_reviews = reviews.length - 1;
    const average_rating =
      total_reviews > 0
        ? reviews
            .filter((r) => r.review_id !== reviewId)
            .reduce((acc, r) => acc + r.rating, 0) / total_reviews
        : 0;

    setStats({ total_reviews, average_rating });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <>
      <section className="reviews">
        <div className="reviews__title">
          <h1>Your Reviews</h1>
        </div>
        <div className="reviews__descr">
          <p>Share your experience and help others</p>
        </div>

        <div className="reviews__stats">
          <div className="reviews-stat">
            <div className="reviews-stat__value">{stats.total_reviews}</div>
            <div className="reviews-stat__title">Total Reviews</div>
          </div>
          <div className="reviews-stat">
            <div className="reviews-stat__value">
              {stats.average_rating.toFixed(1)}
            </div>
            <div className="reviews-stat__title">Average Rating</div>
          </div>
        </div>

        <div className="reviews__add" onClick={openCreateModal}>
          ⭐ Leave a Review
        </div>

        <div className="reviews__cards">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className="reviews-card">
                <div className="reviews-card-top">
                  <div className="reviews-card-top-info">
                    <div className="reviews-card-top-info__name">
                      {review.username}
                    </div>
                    <div className="reviews-card-top-info__date">
                      {formatDate(review.review_date)}
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <div className="reviews-card__descr">{review.review_text}</div>

                {currentUserId && currentUserId === Number(review.user_id) && (
                  <div className="reviews-card__actions">
                    <div
                      className="reviews-card__actions--edit"
                      onClick={() => openEditModal(review)}
                    >
                      ✏️ Edit
                    </div>
                    <div
                      className="reviews-card__actions--delete"
                      onClick={() => handleDelete(review.review_id)}
                    >
                      🗑️ Delete
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? "Edit Review" : "Leave a Review"}</h2>
            <label>Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <label>Review</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your review..."
              style={{ width: "100%", height: "100px", marginTop: "10px" }}
            />

            <div className="modal-buttons">
              <button onClick={handleSubmit} className="btn-save">
                {isEditing ? "Update" : "Submit"}
              </button>
              <button onClick={closeModal} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Reviews_Section;
