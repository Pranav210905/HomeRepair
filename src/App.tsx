import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar/Navbar';
import { HomePage } from './components/Home/HomePage';
import { ServicesPage } from './components/Services/ServicesPage';
import { ServiceBooking } from './components/Booking/ServiceBooking';
import { ServiceTracking } from './components/Tracking/ServiceTracking';
import { PaymentPage } from './components/Payment/PaymentPage';
import { FeedbackPage } from './components/Feedback/FeedbackPage';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { CustomerBookingsPage } from './components/CustomerBookings/CustomerBookingsPage';
import ChatBot from './components/HelpandSupport';
import { ProfilePage } from './pages/Profile/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path='/help' element={<ChatBot />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/service-booking/:serviceId" element={<ServiceBooking />} />
                <Route path="/tracking/:serviceId" element={<ServiceTracking />} />
                <Route path="/payment/:serviceId" element={<PaymentPage />} />
                <Route path="/feedback/:serviceId" element={<FeedbackPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/my-bookings" element={<CustomerBookingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;