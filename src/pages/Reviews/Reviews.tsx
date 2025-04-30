import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Star, ThumbsUp, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: string;
  customerName?: string;
  additionalFeedback: string;
  experienceRating: string;
  workQuality: number;
  serviceUsed: string;
  timestamp: Timestamp;
  providerOnTime: boolean;
  recommendation: string;
  serviceCompletion: string;
  issueResolution: string;
}

const Reviews = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);

        const q = query(
          collection(firestore, 'feedbacks'),
          where('providerId', '==', currentUser.uid),
          where('serviceCompletion', 'in', ['Completed', 'Partially Completed']),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviewsData: Review[] = [];

        querySnapshot.forEach((doc) => {
          reviewsData.push({
            id: doc.id,
            ...doc.data() as Omit<Review, 'id'>
          });
        });

        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [currentUser]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Customer Reviews</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          See what customers are saying about your services
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Star size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">No reviews yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Complete more services to receive customer reviews
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">
                    {review.serviceUsed} Service
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{renderStars(review.workQuality)}</div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {review.experienceRating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                  <Calendar size={16} className="mr-1" />
                  {format(review.timestamp.toDate(), 'MMM d, yyyy')}
                </div>
              </div>

              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                {review.additionalFeedback}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <Clock className="h-4 w-4 mr-2" />
                  {review.providerOnTime ? 'On time' : 'Delayed'}
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {review.recommendation === 'Yes' ? 'Recommended' : 'Not recommended'}
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <Star className="h-4 w-4 mr-2" />
                  Issue {review.issueResolution === 'Yes' ? 'resolved' : 'not resolved'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;