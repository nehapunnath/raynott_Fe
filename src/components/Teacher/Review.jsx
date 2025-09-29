import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaReply, FaChalkboardTeacher } from 'react-icons/fa';
import { teacherApi } from '../../services/TeacherApi';

const Review = ({ teacherId, type = 'professional', teacherName, teacherSubject }) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic titles and labels based on type
  const title = type === 'professional' ? 'Teachers Reviews' : 'Mentors Reviews';
  const summaryTitle = type === 'professional' ? 'Teachers Rating Summary' : 'Mentors Rating Summary';
  const reviewLabel = type === 'professional' ? 'Review a Teacher' : 'Review a Mentor';
  const audience = type === 'professional' ? 'Parents/Students' : 'Mentees';

  // Calculate average rating
  const teachersAvgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const teachersReviewCount = reviews.length;

  useEffect(() => {
    fetchReviews();
  }, [teacherId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherApi.getReviews(teacherId, type);
      if (response.success) {
        setReviews(response.data || []);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (userRating > 0 && reviewText.trim()) {
      const reviewData = {
        text: reviewText,
        rating: userRating,
        subject: teacherSubject // Include subject for consistency
      };
      try {
        const response = await teacherApi.addReview(teacherId, reviewData, type);
        if (response.success) {
          setReviews([{
            id: response.data.id,
            teacher: teacherName,
            subject: teacherSubject,
            text: reviewText,
            rating: userRating,
            author: 'Anonymous', // Default to Anonymous
            likes: 0,
            dislikes: 0,
            date: new Date().toISOString().split('T')[0]
          }, ...reviews]);
          setUserRating(0);
          setReviewText('');
          fetchReviews(); // Refresh to update avg rating
        }
      } catch (err) {
        alert(`Failed to submit review: ${err.message}`);
      }
    }
  };

  const handleLike = async (id) => {
    try {
      await teacherApi.likeReview(teacherId, id, type);
      fetchReviews();
    } catch (err) {
      alert(`Failed to like: ${err.message}`);
    }
  };

  const handleDislike = async (id) => {
    try {
      await teacherApi.dislikeReview(teacherId, id, type);
      fetchReviews();
    } catch (err) {
      alert(`Failed to dislike: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-4">Loading reviews...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          {title}
        </span>
      </h2>

      {/* Rating Summary Card */}
      <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow mb-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <FaChalkboardTeacher className="text-amber-600 mr-2" />
          {summaryTitle}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-amber-600 mr-4">{teachersAvgRating.toFixed(1)}</div>
            <div>
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(teachersAvgRating) ? (
                    <FaStar key={i} className="text-yellow-400" />
                  ) : i < teachersAvgRating ? (
                    <FaStar key={i} className="text-yellow-400 opacity-70" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-300" />
                  )
                ))}
              </div>
              <div className="text-sm text-gray-500">{teachersReviewCount} reviews</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {teachersAvgRating >= 4.5 ? 'Excellent' : teachersAvgRating >= 3.5 ? 'Good' : 'Average'}
          </div>
        </div>
      </div>

      {/* Rating and Review Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaChalkboardTeacher className="text-amber-600 mr-2" />
          {reviewLabel}
        </h3>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                {star <= userRating ? (
                  <FaStar size={28} className="text-amber-500 hover:text-amber-600" />
                ) : (
                  <FaRegStar size={28} className="text-gray-300 hover:text-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleReviewSubmit}>
          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`Share your experience with ${teacherName}...`}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
              rows="5"
            />
          </div>
          <button
            type="submit"
            disabled={!userRating || !reviewText.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition ${!userRating || !reviewText.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
              }`}
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            What {audience} Say About {teacherName}
          </span>
          <span className="ml-auto bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {teachersReviewCount} Reviews
          </span>
        </h3>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-amber-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  {/* <h4 className="font-bold text-lg text-amber-700">{review.author}</h4> */}
                  {/* <p className="text-gray-600 mb-2">{review.subject} {type === 'professional' ? 'Teacher' : 'Mentor'}</p> */}
                  <div className="flex items-center">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? (
                          <FaStar key={i} className="text-yellow-400" size={16} />
                        ) : (
                          <FaRegStar key={i} className="text-gray-300" size={16} />
                        )
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.createdAt.split('T')[0]}</span>

                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center text-green-600 hover:text-green-800 transition"
                  >
                    <FaThumbsUp className="mr-1" /> {review.likes || 0}
                  </button>
                  <button
                    onClick={() => handleDislike(review.id)}
                    className="flex items-center text-red-600 hover:text-red-800 transition"
                  >
                    <FaThumbsDown className="mr-1" /> {review.dislikes || 0}
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.text}</p>

              <div className="flex justify-between items-center">
                {/* <button className="text-amber-600 hover:text-amber-800 font-medium flex items-center transition text-sm">
                  <FaReply className="mr-2" /> Reply
                </button> */}
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-center text-gray-500">No reviews yet. Be the first!</p>}
        </div>
      </div>
    </div>
  );
};

export default Review;