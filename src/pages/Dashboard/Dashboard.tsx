import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { formatDistanceToNow } from 'date-fns';
import { Filter, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import RequestCard from '../../components/RequestCard/RequestCard';

interface BookingRequest {
  id: string;
  serviceType: string;
  address: string;
  createdAt: Timestamp;
  status: string;
  isUrgent: boolean;
  date: string;
  specialInstructions?: string;
}

const Dashboard = () => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let q;
        if (filter === 'all') {
          q = query(collection(firestore, 'bookings'), orderBy('createdAt', 'desc'));
        } else if (filter === 'pending') {
          q = query(collection(firestore, 'bookings'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
        } else if (filter === 'accepted') {
          q = query(collection(firestore, 'bookings'), where('status', '==', 'accepted'), orderBy('createdAt', 'desc'));
        } else if (filter === 'urgent') {
          q = query(collection(firestore, 'bookings'), where('isUrgent', '==', true), orderBy('createdAt', 'desc'));
        }
        
        const querySnapshot = await getDocs(q!);
        const requestsData: BookingRequest[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<BookingRequest, 'id'>;
          requestsData.push({ id: doc.id, ...data });
        });
        
        setRequests(requestsData);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load service requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [filter]);
  
  const filterButtons = [
    { id: 'all', label: 'All Requests', icon: <Filter size={16} /> },
    { id: 'pending', label: 'Pending', icon: <Clock size={16} /> },
    { id: 'accepted', label: 'Accepted', icon: <CheckCircle size={16} /> },
    { id: 'urgent', label: 'Urgent', icon: <AlertTriangle size={16} /> },
  ];
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Service Requests</h1>
        <p className="text-blue-600 dark:text-blue-400">
          View and manage incoming service repair requests from customers
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mr-2">Filter:</div>
        {filterButtons.map((button) => (
          <button
            key={button.id}
            onClick={() => setFilter(button.id)}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors border ${
              filter === button.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                : 'bg-white dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-300 dark:border-blue-700'
            }`}
          >
            <span className="mr-1.5">{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-blue-950 rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Filter size={24} className="text-blue-500 dark:text-blue-300" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-1">No requests found</h3>
          <p className="text-blue-600 dark:text-blue-400">
            {filter === 'all'
              ? 'There are no service requests available at the moment.'
              : `There are no ${filter} requests available.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
