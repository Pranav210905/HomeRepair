import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();
  const { Icon, title, description } = service;

  return (
    <div 
      onClick={() => navigate(`/services/${service.id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer 
        transform transition-transform hover:scale-105"
    >
      <div className="flex flex-col items-center text-center">
        <Icon className="w-12 h-12 text-orange-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}