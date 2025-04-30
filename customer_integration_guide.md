# Customer Website Integration Guide

This guide explains how to integrate the service provider website with your existing customer website, focusing on real-time updates when a service provider accepts a booking.

## Overview

When a service provider accepts a booking request, the following happens:

1. The booking document in Firestore is updated with:
   - `status` changed to "accepted"
   - `preferredProvider` set to the provider's ID
   - `providerName` set to the provider's name
   - `acceptedAt` timestamp added

2. The customer website needs to listen for these changes and update the UI accordingly.

## Integration Steps

### 1. Add Firestore Listener to Customer Dashboard

Add this code to your customer dashboard page to listen for updates to the customer's bookings:

```javascript
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// In your component
useEffect(() => {
  // Assuming you have the booking ID and are logged in as the customer
  if (!bookingId) return;
  
  // Set up a real-time listener for the booking document
  const bookingRef = doc(firestore, 'bookings', bookingId);
  const unsubscribe = onSnapshot(bookingRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const bookingData = docSnapshot.data();
      
      // Check if the booking status has changed to accepted
      if (bookingData.status === 'accepted') {
        // Update your UI to show the booking has been accepted
        setBookingStatus('accepted');
        setProviderName(bookingData.providerName || 'A service provider');
        
        // Optionally show a notification
        notifyUser(`Your booking has been accepted by ${bookingData.providerName || 'a service provider'}`);
      }
    }
  }, (error) => {
    console.error("Error listening to booking updates:", error);
  });
  
  // Clean up the listener when component unmounts
  return () => unsubscribe();
}, [bookingId]);
```

### 2. Add Notification Component to Your Customer Website

Create a notification component to alert customers when their booking is accepted:

```jsx
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-4 max-w-md border-l-4 border-green-500 animate-slide-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Bell className="h-6 w-6 text-green-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="ml-auto flex-shrink-0 text-neutral-400 hover:text-neutral-500"
        >
          <span className="sr-only">Close</span>
          <span className="text-lg">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default Notification;
```

### 3. Update Booking Status UI on Customer Website

Modify your booking details component to reflect the accepted status:

```jsx
const BookingStatusBadge = ({ status, providerName }) => {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  } else if (status === 'accepted') {
    return (
      <div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Accepted
        </span>
        {providerName && (
          <p className="text-sm text-neutral-600 mt-1">
            Your service will be provided by {providerName}
          </p>
        )}
      </div>
    );
  }
  
  return null;
};
```

### 4. Testing the Integration

To test the integration:
1. Create a new booking from the customer website
2. Log in to the service provider website
3. Accept the booking request
4. Verify that the customer website updates the status in real-time

## Security Rules

Ensure your Firestore security rules allow reading booking documents for the customer who created them:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // Allow read access for customers to their own bookings
      allow read: if request.auth != null && resource.data.customerId == request.auth.uid;
      
      // Allow service providers to read all booking requests
      allow read: if request.auth != null && 
                   exists(/databases/$(database)/documents/service_providers/$(request.auth.uid));
                   
      // Only allow service providers to update specific fields
      allow update: if request.auth != null && 
                    exists(/databases/$(database)/documents/service_providers/$(request.auth.uid)) &&
                    request.resource.data.diff(resource.data).affectedKeys()
                    .hasOnly(['status', 'preferredProvider', 'providerName', 'acceptedAt']);
    }
  }
}
```

This ensures that only service providers can update the booking status while customers can view their own bookings.