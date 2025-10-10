import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';
import { collegeApi } from '../../services/collegeApi';
import { useParams } from 'react-router-dom';
import "tailwindcss";


const Review = () => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: collegeId } = useParams();

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await collegeApi.getReviews(collegeId);
        setReviews(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [collegeId]);

  const handleStarClick = (rating) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (userRating > 0 && reviewText.trim()) {
      try {
        const newReview = {
          text: reviewText,
          rating: userRating,
          collegeId,
          author: 'You' // Replace with actual user data if available
        };
        const response = await collegeApi.addReview(collegeId, newReview);
        setReviews([response.data, ...reviews]);
        setUserRating(0);
        setReviewText('');
      } catch (err) {
        const errorMessage = err.response?.data?.errors
          ? err.response.data.errors.join(', ')
          : err.message || 'Failed to submit review';
        setError(errorMessage);
      }
    }
  };

  const handleLike = async (reviewId) => {
    try {
      await collegeApi.likeReview(collegeId, reviewId);
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, likes: (review.likes || 0) + 1 } : review
      ));
    } catch (err) {
      setError(err.message || 'Failed to like review');
    }
  };

  const handleDislike = async (reviewId) => {
    try {
      await collegeApi.dislikeReview(collegeId, reviewId);
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, dislikes: (review.dislikes || 0) + 1 } : review
      ));
    } catch (err) {
      setError(err.message || 'Failed to dislike review');
    }
  };

  // Calculate average ratings
  const parentsAvgRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const parentsReviewCount = reviews.length;

  if (loading) {
    return <div className="text-center text-gray-600">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border border-orange-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
          College Reviews
        </span>
      </h2>

      {/* Rating Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Parents Rating Card */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Parents/Students Rating</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-4xl font-bold text-amber-600 mr-4">{parentsAvgRating}</div>
              <div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(parentsAvgRating) ? 
                      <FaStar key={i} className="text-yellow-400" /> : 
                      (i < parentsAvgRating ? <FaStar key={i} className="text-yellow-400 opacity-70" /> : <FaRegStar key={i} className="text-gray-300" />)
                  ))}
                </div>
                <div className="text-sm text-gray-500">{parentsReviewCount} reviews</div>
              </div>
            </div>
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {parentsAvgRating >= 4 ? 'Excellent' : parentsAvgRating >= 3 ? 'Good' : 'Average'}
            </div>
          </div>
        </div>
      </div>

      {/* Rating and Review Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Experience</h3>
        
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
              placeholder="Share details of your experience at this college..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition"
              rows="5"
            />
          </div>
          <button
            type="submit"
            disabled={!userRating || !reviewText.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition ${!userRating || !reviewText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'}`}
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            What Parents/Students Say
          </span>
          <span className="ml-auto bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {reviews.length} Reviews
          </span>
        </h3>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center mb-1">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? 
                          <FaStar key={i} className="text-yellow-400" size={18} /> : 
                          <FaRegStar key={i} className="text-gray-300" size={18} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.createdAt.split('T')[0]}</span>
                  </div>
                  {/* <h4 className="font-medium text-gray-800">{review.author}</h4> */}
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
              
              {/* <button className="text-amber-600 hover:text-amber-800 font-medium flex items-center transition">
                <FaReply className="mr-2" /> Reply
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;