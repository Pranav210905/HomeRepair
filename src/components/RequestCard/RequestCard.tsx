import { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, CalendarDays, Clock, MapPin, AlertTriangle, PenTool as Tool } from 'lucide-react';

interface RequestCardProps {
  request: {
    id: string;
    serviceType: string;
    address: string;
    createdAt: Timestamp;
    status: string;
    isUrgent: boolean;
    date: string;
    specialInstructions?: string;
  };
}

const RequestCard = ({ request }: RequestCardProps) => {
  const { currentUser } = useAuth();
  console.log(currentUser)
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAccept = async () => {
    if (!currentUser) return;
    
    try {
      setIsAccepting(true);
      setError(null);
      
      const requestRef = doc(firestore, 'bookings', request.id);
      await updateDoc(requestRef, {
        status: 'accepted',
        preferredProvider: currentUser.uid,
        providerName: currentUser.displayName,
        acceptedAt: new Date()
      });
      
      // After successfully updating, we could reload the data
      // But for better UX, we'll just update the local state
      request.status = 'accepted';
      
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };
  
  const getStatusBadge = () => {
    if (request.status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          <Clock size={12} className="mr-1" /> Pending
        </span>
      );
    } else if (request.status === 'accepted') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle2 size={12} className="mr-1" /> Accepted
        </span>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-md mr-3">
              <Tool size={18} className="text-primary-700 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">
                {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex">
            {request.isUrgent && (
              <span className="inline-flex items-center mr-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                <AlertTriangle size={12} className="mr-1" /> Urgent
              </span>
            )}
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start text-sm">
            <MapPin size={16} className="text-neutral-500 dark:text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-neutral-700 dark:text-neutral-300">{request.address}</span>
          </div>
          <div className="flex items-center text-sm">
            <CalendarDays size={16} className="text-neutral-500 dark:text-neutral-400 mr-2 flex-shrink-0" />
            <span className="text-neutral-700 dark:text-neutral-300">
              {request.date}
            </span>
          </div>
        </div>
        
        {request.specialInstructions && (
          <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded p-2 mb-4">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
              <span className="font-medium">Instructions:</span> {request.specialInstructions}
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-2 text-xs rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="flex space-x-2">
          <Link 
            to={`/requests/${request.id}`}
            className="flex-1 text-center py-2 px-4 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            View Details
          </Link>
          
          {request.status === 'pending' && (
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAccepting ? 'Accepting...' : 'Accept Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;