export type Theme = 'light' | 'dark';

export interface ServiceRequest {
  location: string;
  serviceType: string;
  description: string;
}


export interface FeedbackData {
  timestamp: string;
  serviceUsed: string;
  serviceCompletion: string;
  experienceRating: string;
  providerOnTime: boolean;
  workQuality: number;
  issueResolution: string;
  recommendation: string;
  additionalFeedback: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
}


export interface ServiceProvider {
  id: string;
  fullName: string;
  shopName: string;
  serviceCategory: string;
  specificServices: string[];
  rating: number;
  address: string;
  experience: number;
  phone: string;
  email: string;
  availability: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  Icon: React.ComponentType<any>;
  longDescription: string;
}





export interface User {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  mobileNumber?: string;
  preferredLanguage?: string;
  addresses?: Address[];
  defaultAddressId?: string;
}

export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>
}