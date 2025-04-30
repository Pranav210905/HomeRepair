import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, CheckCircle2, Truck, Phone, AlertCircle, XCircle, CreditCard } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  acceptedAt: any;
  providerName: string;
  preferredProvider: string;
  steps: {
    title: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
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

export function ServiceTracking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId || !user) return;

    const bookingRef = doc(db, 'bookings', serviceId);
    const unsubscribe = onSnapshot(
      bookingRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as Booking;
          const updatedSteps = data.steps.map(step => {
            if (step.title === "Professional Assignment") {
              const isCompleted = data.status === 'accepted' && data.acceptedAt;
              return {
                ...step,
                completed: isCompleted,
                time: isCompleted ? new Date(data.acceptedAt.toDate()).toLocaleTimeString() : ''
              };
            }
            if (step.title === "Service Initiation") {
              const isCompleted = data.status === 'in-progress';
              return {
                ...step,
                completed: isCompleted,
                time: isCompleted ? new Date().toLocaleTimeString() : ''
              };
            }
            if (step.title === "Service Completion") {
              const isCompleted = data.status === 'completed';
              return {
                ...step,
                completed: isCompleted,
                time: isCompleted ? new Date().toLocaleTimeString() : ''
              };
            }
            return step;
          });

          const updatedBooking = { ...data, steps: updatedSteps };
          setBooking(updatedBooking);
          
          if (previousStatus && previousStatus !== data.status) {
            showNotification(`Service status updated to: ${data.status}`);
          }
          setPreviousStatus(data.status);
          
          if (data.providerName && (!booking || !booking.providerName)) {
            showNotification(`Service provider ${data.providerName} has been assigned to your service`);
          }
          
          setLoading(false);
        } else {
          setError('Booking not found');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching booking:', error);
        setError('Error fetching booking details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [serviceId, user, showNotification, booking, previousStatus]);

  const handlePayment = () => {
    if (booking && booking.status === 'completed') {
      navigate(`/payment/${serviceId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-red-500">{error || 'Booking not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Track Your Service
            </h2>
            <div className="flex items-center gap-2 text-orange-500">
              <Clock className="w-5 h-5" />
              <span>Real-time Updates</span>
            </div>
          </div>

          {booking.providerName && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-8">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <User className="w-8 h-8 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {booking.providerName}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Professional Service Agent</p>
              </div>
            </div>
          )}

          <div className="relative">
            {booking.steps.map((step, index) => (
              <div key={index} className="flex gap-4 mb-8 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full" />
                    )}
                  </div>
                  {index < booking.steps.length - 1 && (
                    <div className={`w-0.5 h-16 ${
                      step.completed ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
                  {step.time && (
                    <span className="text-sm text-orange-500">{step.time}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {booking.status === 'completed' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handlePayment}
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}