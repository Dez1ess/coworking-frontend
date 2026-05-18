import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaSearch } from "react-icons/fa";

interface Comment {
  comment_id: number;
  comment_text: string;
  created_at: string;
  admin_name: string;
}

interface Review {
  review_id: number;
  review_text: string;
  rating: number;
  review_date: string;
  username: string;
  comments: Comment[];
}

const API = `${import.meta.env.VITE_API_URL}/api/admin/reviews`;

function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("newest");

  const [ratingOpen, setRatingOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [commentInputs, setCommentInputs] = useState<{
    [key: number]: string;
  }>({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReviews();
  }, [search, rating, sort]);

  useEffect(() => {
    const close = () => {
      setRatingOpen(false);
      setSortOpen(false);
    };

    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          rating,
          sort,
        },
      });

      setReviews(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (reviewId: number) => {
    try {
      const text = commentInputs[reviewId];

      if (!text?.trim()) return toast.error("Comment required");

      await axios.post(
        `${API}/${reviewId}/comments`,
        { comment_text: text },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Comment added");

      setCommentInputs((prev) => ({
        ...prev,
        [reviewId]: "",
      }));

      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!confirm("Delete comment?")) return;

    try {
      await axios.delete(`${API}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Comment deleted");
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const deleteReview = async (reviewId: number) => {
    if (!confirm("Delete review?")) return;

    try {
      await axios.delete(`${API}/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));

      toast.success("Review deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const ratingOptions = [
    { label: "All Ratings", value: "" },
    { label: "1 Star", value: "1" },
    { label: "2 Stars", value: "2" },
    { label: "3 Stars", value: "3" },
    { label: "4 Stars", value: "4" },
    { label: "5 Stars", value: "5" },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest Rating", value: "highest" },
    { label: "Lowest Rating", value: "lowest" },
  ];

  return (
    <section className="admin-reviews">
      <div className="admin-reviews__container">
        <Toaster position="top-center" />

        <div className="admin-reviews-top">
          <h1>Reviews Management</h1>

          <div className="admin-reviews-filters">
            <div className="search-box">
              <FaSearch />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* CUSTOM RATING */}
            <div className="custom-select">
              <button
                className={`custom-select-trigger ${
                  ratingOpen ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setRatingOpen((p) => !p);
                  setSortOpen(false);
                }}
              >
                {ratingOptions.find((o) => o.value === rating)?.label}
                <span>▼</span>
              </button>

              {ratingOpen && (
                <div className="custom-select-dropdown">
                  {ratingOptions.map((o) => (
                    <div
                      key={o.value}
                      className={`custom-option ${
                        rating === o.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setRating(o.value);
                        setRatingOpen(false);
                      }}
                    >
                      {o.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CUSTOM SORT */}
            <div className="custom-select">
              <button
                className={`custom-select-trigger ${sortOpen ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen((p) => !p);
                  setRatingOpen(false);
                }}
              >
                {sortOptions.find((o) => o.value === sort)?.label}
                <span>▼</span>
              </button>

              {sortOpen && (
                <div className="custom-select-dropdown">
                  {sortOptions.map((o) => (
                    <div
                      key={o.value}
                      className={`custom-option ${
                        sort === o.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSort(o.value);
                        setSortOpen(false);
                      }}
                    >
                      {o.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-reviews-grid">
            {reviews.map((review) => (
              <div key={review.review_id} className="admin-review-card">
                <div className="admin-review-top">
                  <div>
                    <h3>{review.username}</h3>
                    <span>
                      {new Date(review.review_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="rating-badge">⭐ {review.rating}</div>
                </div>

                <p className="review-text">{review.review_text}</p>

                <div className="comments-section">
                  <h4>Admin Comments</h4>

                  {review.comments.length ? (
                    review.comments.map((c) => (
                      <div key={c.comment_id} className="comment-box">
                        <div className="comment-top">
                          <strong>
                            {c.admin_name} <span>(admin)</span>
                          </strong>
                          <button
                            className="delete-comment-btn"
                            onClick={() => deleteComment(c.comment_id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <p>{c.comment_text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-comments">No comments yet</p>
                  )}

                  <textarea
                    placeholder="Write comment..."
                    value={commentInputs[review.review_id] || ""}
                    onChange={(e) =>
                      setCommentInputs((p) => ({
                        ...p,
                        [review.review_id]: e.target.value,
                      }))
                    }
                  />
                </div>

                <button
                  className="comment-btn"
                  onClick={() => addComment(review.review_id)}
                >
                  Add Comment
                </button>

                <button
                  className="delete-review-btn"
                  onClick={() => deleteReview(review.review_id)}
                >
                  <FaTrash />
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminReviews;
