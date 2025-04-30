import React from 'react';
import { useParams } from 'react-router-dom';
import { services } from '../../data/services';
import { serviceProviders } from '../../data/serviceProviders';
import { Star } from 'lucide-react';

export function ServicePage() {
  const { serviceId } = useParams();
  const service = services.find(s => s.id === serviceId);
  const providers = serviceProviders.filter(p => p.serviceCategory === service?.title);

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {service.longDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={provider.image} 
                  alt={provider.fullName}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {provider.fullName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{provider.shopName}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-700 dark:text-gray-300">
                  {provider.rating.toFixed(1)} / 5
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Services:</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                  {provider.specificServices.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>

              <div className="text-gray-600 dark:text-gray-300">
                <p className="mb-1"><strong>Experience:</strong> {provider.experience} years</p>
                <p className="mb-1"><strong>Address:</strong> {provider.address}</p>
                <p><strong>Availability:</strong> {provider.availability}</p>
              </div>

              <button className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-lg 
                hover:bg-orange-600 transition-colors">
                Book Service
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}