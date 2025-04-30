import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  details: string[];
}

export function ServiceCard({ title, description, Icon, details }: ServiceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
      <div className="flex flex-col items-center text-center">
        <Icon className="w-12 h-12 text-orange-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


