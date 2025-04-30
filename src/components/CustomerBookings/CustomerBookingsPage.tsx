import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Clock, Calendar, PenTool, CheckCircle2, XCircle, AlertCircle, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: any;
  providerName:string;
  acceptedAt: any;
  serviceProvider: {
    name: string;
    phone: string;
  } | null;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-purple-100 text-purple-800'
};

const statusIcons = {
  pending: AlertCircle,
  accepted: CheckCircle2,
  rejected: XCircle,
  completed: CheckCircle2,
  'in-progress': Clock
};

export function CustomerBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getBookingStatus = (booking: Booking) => {
    if (booking.status === 'completed') return 'completed';
    if (booking.status === 'rejected') return 'rejected';
    if (booking.acceptedAt) return 'accepted';
    return 'pending';
  };

  const getStatusTime = (booking: Booking) => {
    if (booking.acceptedAt) {
      return format(new Date(booking.acceptedAt.toDate()), 'PPp');
    }
    return format(new Date(booking.createdAt.toDate()), 'PPp');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your bookings
          </h2>
          <Link
            to="/login"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Your Service Bookings
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <PenTool className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No bookings yet
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Start by booking a service from our services page.
              </p>
              <Link
                to="/services"
                className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const currentStatus = getBookingStatus(booking);
                const StatusIcon = statusIcons[currentStatus as keyof typeof statusIcons] || AlertCircle;
                
                return (
                  <div
                    key={booking.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {booking.serviceType}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">                     <span>Service Provider: {booking.providerName}</span>
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(booking.date), 'PPP')}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{booking.timeSlot}</span>
                         
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {currentStatus === 'accepted' ? 'Accepted at: ' : 'Requested at: '}
                          {getStatusTime(booking)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[currentStatus as keyof typeof statusColors]
                        }`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                        </span>
                        <Link
                          to={`/tracking/${booking.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          Track Service
                        </Link>
                      </div>
                    </div>

                    {booking.serviceProvider && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <User className="w-4 h-4" />
                          <span>Service Provider: {booking.providerName}</span>
                          <span className="mx-2">•</span>
                          <Phone className="w-4 h-4" />
                          <a
                            href={`tel:${booking.serviceProvider.phone}`}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            {booking.serviceProvider.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}