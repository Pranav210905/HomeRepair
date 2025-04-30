import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, PaintBucket, Plug, Hammer, Thermometer, Sprout, Droplets, Brush } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

const services = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    description: 'Expert plumbing services for all your needs',
    longDescription: 'Our plumbing services cover everything from leaks to full system installations.',
    Icon: Droplets
  },
  {
    id: 'electrical',
    title: 'Electrical',
    description: 'Professional electrical repair and installation',
    longDescription: 'We handle wiring, lighting, power backups, and more with certified electricians.',
    Icon: Plug
  },
  {
    id: 'painting',
    title: 'Painting',
    description: 'Transform your space with quality painting',
    longDescription: 'Interior and exterior painting with top-quality materials and expert painters.',
    Icon: PaintBucket
  },
  {
    id: 'carpentry',
    title: 'Carpentry',
    description: 'Custom woodwork and repairs',
    longDescription: 'Custom furniture, door fittings, and wood repairs done by skilled carpenters.',
    Icon: Hammer
  },
  {
    id: 'hvac',
    title: 'HVAC',
    description: 'Heating and cooling system services',
    longDescription: 'Installation, maintenance, and repair of heating, ventilation, and air conditioning.',
    Icon: Thermometer
  },
  {
    id: 'landscaping',
    title: 'Landscaping',
    description: 'Beautiful outdoor space maintenance',
    longDescription: 'Lawn care, garden design, and outdoor upkeep to beautify your surroundings.',
    Icon: Sprout
  },
  {
    id: 'general-repairs',
    title: 'General Repairs',
    description: 'All-around home maintenance and repairs',
    longDescription: 'Minor and major home repairs including fixtures, fittings, and more.',
    Icon: Wrench
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    description: 'Professional cleaning services',
    longDescription: 'Residential and commercial cleaning for a spotless environment.',
    Icon: Brush
  }
];


export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
           <img src="/images/home.jpg" alt="Father's Day" 
            className="w-full h-[480px] object-cover"
          />
      
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-orange sm:text-5xl md:text-6xl">
              <span className="block">Home Service</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-black-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your one-stop destination for all home repair and maintenance needs. We connect you with trusted professionals for quality service and peace of mind.
            </p>
            <div className="mt-10 sm:flex sm:justify-center">
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:text-lg transition duration-150 ease-in-out transform hover:scale-105"
              >
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Professional Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From minor repairs to major renovations, our skilled professionals are here to help with all your home maintenance needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
             <ServiceCard
             key={service.title}
             service={service}
           />           
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Book a service today and experience hassle-free home maintenance
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-orange-500 md:text-lg transition duration-150 ease-in-out"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}