import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2,
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Booking {
  serviceType: string;
  providerName: string;
  preferredProvider: string;
}

const upiMethods: PaymentMethod[] = [
  {
    id: 'gpay',
    name: 'Google Pay',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Pay_Logo.svg',
    description: 'Fast, reliable, and reward-based UPI payments'
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.png/640px-PhonePe_Logo.png',
    description: 'All-in-one app with UPI, recharge, investments'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%282019%29.svg',
    description: 'Combines UPI, wallet, shopping, ticket booking'
  }
];

export function PaymentPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [amount] = useState(() => Math.floor(Math.random() * (1000 - 400 + 1)) + 400);

  useEffect(() => {
    async function fetchBooking() {
      if (!serviceId) return;

      try {
        const bookingDoc = await getDoc(doc(db, 'bookings', serviceId));
        if (bookingDoc.exists()) {
          setBooking(bookingDoc.data() as Booking);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [serviceId]);

  const handlePayment = async () => {
    if (!user || !booking || !serviceId) {
      showNotification('Missing required information for payment');
      return;
    }

    try {
      // Update the booking document with payment information
      await updateDoc(doc(db, 'bookings', serviceId), {
        paymentAmount: amount,
        paymentMethod: selectedMethod,
        paymentTimestamp: new Date(),
        paymentStatus: 'completed'
      });

      showNotification('Payment successful!');
      navigate(`/feedback/${serviceId}`, {
        state: { 
          providerId: booking.preferredProvider,
          providerName: booking.providerName
        }
      });
    } catch (err) {
      console.error('Error processing payment:', err);
      showNotification('Payment failed. Please try again.');
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
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'Unable to load payment details'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Payment
            </h2>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {amount}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Service Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Service Type</span>
                  <span className="text-gray-900 dark:text-white">{booking.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Service ID</span>
                  <span className="text-gray-900 dark:text-white">{serviceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Provider</span>
                  <span className="text-gray-900 dark:text-white">{booking.providerName}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-600 dark:text-gray-300">Total Amount</span>
                  <span className="text-orange-500">₹{amount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upiMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={method.icon} 
                      alt={method.name}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod}
              className={`w-full py-3 px-4 rounded-md transition-colors ${
                selectedMethod
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
