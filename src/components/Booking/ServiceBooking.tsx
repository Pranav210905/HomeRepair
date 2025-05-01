import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin,
  AlertCircle,
  Tag,
  Info,
  Plus,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  alternateContact?: string;
}

const serviceTypes = [
  { id: 'ac', name: 'AC Service' },
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'cleaning', name: 'Home Cleaning' },
  { id: 'painting', name: 'Painting' },
  { id: 'carpentry', name: 'Carpentry' },
  { id: 'pest_control', name: 'Pest Control' },
  { id: 'appliance', name: 'Appliance Repair' }
];

const timeSlots: TimeSlot[] = [
  { id: '1', time: '09:00 AM - 11:00 AM', available: true },
  { id: '2', time: '11:00 AM - 01:00 PM', available: true },
  { id: '3', time: '02:00 PM - 04:00 PM', available: true },
  { id: '4', time: '04:00 PM - 06:00 PM', available: true },
  { id: '5', time: '06:00 PM - 08:00 PM', available: true }
];

export function ServiceBooking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [useProfileData, setUseProfileData] = useState(true);
  const [bookingData, setBookingData] = useState({
    serviceType: serviceId || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    timeSlot: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    location: { lat: 0, lng: 0 },
    isUrgent: false,
    promoCode: '',
    saveAddress: false,
    specialInstructions: '',
    preferredProvider: '',
    additionalServices: [] as string[]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;

      try {
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          const profile = profileDoc.data() as UserProfile;
          setUserProfile(profile);
          if (useProfileData) {
            setBookingData(prev => ({
              ...prev,
              fullName: profile.fullName,
              email: user.email || '',
              phone: profile.phone,
              address: profile.address,
              serviceType: serviceId || prev.serviceType
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    fetchUserProfile();
  }, [user, useProfileData, serviceId]);

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBookingData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        userId: user.uid,
        userProfile: {
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
          address: bookingData.address
        },
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        providerName: null,
        steps: [
          {
            title: 'Service Requested',
            description: 'Your service request has been received',
            time: format(new Date(), 'p'),
            completed: true
          },
          {
            title: 'Professional Assignment',
            description: 'Waiting for professional assignment',
            time: '',
            completed: false
          },
          {
            title: 'Service Initiation',
            description: 'Service will begin soon',
            time: '',
            completed: false
          },
          {
            title: 'Service Completion',
            description: 'Service completion and feedback',
            time: '',
            completed: false
          }
        ]
      });

      showNotification('Service booked successfully!');
      navigate(`/my-bookings`);
    } catch (error) {
      console.error('Error creating booking:', error);
      showNotification('Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Book Your Service
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {userProfile && (
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useProfileData}
                    onChange={(e) => setUseProfileData(e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Use profile information
                  </span>
                </label>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={bookingData.fullName}
                  onChange={(e) => setBookingData({ ...bookingData, fullName: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </div>
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Service Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Type
              </label>
              <select
                value={bookingData.serviceType}
                onChange={(e) => setBookingData({ ...bookingData, serviceType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a service</option>
                {serviceTypes.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Preferred Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Time Slot</span>
                  </div>
                </label>
                <select
                  value={bookingData.timeSlot}
                  onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.time} disabled={!slot.available}>
                      {slot.time} {!slot.available && '(Unavailable)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location and Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Service Address</span>
                </div>
              </label>
              <div className="flex gap-2">
                <textarea
                  value={bookingData.address}
                  onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                  rows={3}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your address"
                />
                <button
                  type="button"
                  onClick={handleLocationAccess}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bookingData.saveAddress}
                    onChange={(e) => setBookingData({ ...bookingData, saveAddress: e.target.checked })}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Save this address for future bookings
                  </span>
                </label>
              </div>
            </div>

            {/* Urgent Service Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={bookingData.isUrgent}
                  onChange={(e) => setBookingData({ ...bookingData, isUrgent: e.target.checked })}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                  Urgent Service (Additional charges apply)
                </label>
              </div>
              <div className="text-sm text-orange-500">+₹299</div>
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <span>Promo Code</span>
                </div>
              </label>
              <input
                type="text"
                value={bookingData.promoCode}
                onChange={(e) => setBookingData({ ...bookingData, promoCode: e.target.value })}
                placeholder="Enter promo code"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Instructions
              </label>
              <textarea
                value={bookingData.specialInstructions}
                onChange={(e) => setBookingData({ ...bookingData, specialInstructions: e.target.value })}
                rows={3}
                placeholder="Any special instructions for the service provider?"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
