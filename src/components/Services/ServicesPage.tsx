import React from 'react';
import { 
  Plug, 
  PaintBucket, 
  Droplets, 
  Hammer, 
  Trash2, 
  WrenchIcon, 
  Bug, 
  Wind,
  Camera,
  Palette,
  Flower2,
  Laptop
} from 'lucide-react';
import { ServiceCard } from './ServicePageCard';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 'electrical',
    title: 'Electrical Services',
    description: 'Wiring, socket installation, fan repair, lighting setup, and more',
    Icon: Plug,
    details: [
      'Complete house wiring',
      'Socket and switch installation',
      'Fan installation and repair',
      'LED lighting setup',
      'Circuit breaker installation'
    ]
  },
  {
    id: 'painting',
    title: 'Painting Services',
    description: 'Interior & exterior painting, wall texture, waterproofing solutions',
    Icon: PaintBucket,
    details: [
      'Interior wall painting',
      'Exterior house painting',
      'Textured wall finishes',
      'Waterproofing treatment',
      'Wood painting and polishing'
    ]
  },
  {
    id: 'plumbing',
    title: 'Plumbing Services',
    description: 'Leak fixes, pipe installation, bathroom fitting, and maintenance',
    Icon: Droplets,
    details: [
      'Leak detection and repair',
      'Pipe installation and replacement',
      'Bathroom fitting installation',
      'Water heater services',
      'Drainage system maintenance'
    ]
  },
  {
    id: 'carpentry',
    title: 'Carpentry Services',
    description: 'Furniture repair, custom cabinets, door/window fixes',
    Icon: Hammer,
    details: [
      'Custom furniture making',
      'Cabinet installation',
      'Door and window repair',
      'Wood flooring installation',
      'Furniture assembly'
    ]
  },
  {
    id: 'cleaning',
    title: 'Home Cleaning',
    description: 'Deep cleaning, kitchen cleaning, bathroom sanitization',
    Icon: Trash2,
    details: [
      'Deep house cleaning',
      'Kitchen deep cleaning',
      'Bathroom sanitization',
      'Carpet cleaning',
      'Window cleaning'
    ]
  },
  {
    id: 'appliance',
    title: 'Appliance Repair',
    description: 'AC, refrigerator, washing machine, microwave servicing',
    Icon: WrenchIcon,
    details: [
      'AC repair and maintenance',
      'Refrigerator servicing',
      'Washing machine repair',
      'Microwave repair',
      'Dishwasher maintenance'
    ]
  },
  {
    id: 'pest',
    title: 'Pest Control',
    description: 'Termite control, cockroach removal, general pest treatment',
    Icon: Bug,
    details: [
      'Termite treatment',
      'Cockroach control',
      'Rodent control',
      'Bed bug treatment',
      'General pest control'
    ]
  },
  {
    id: 'ac',
    title: 'AC Services',
    description: 'Installation, uninstallation, gas refill, servicing',
    Icon: Wind,
    details: [
      'AC installation',
      'AC uninstallation',
      'Gas refilling',
      'Regular servicing',
      'Repair and maintenance'
    ]
  },
  {
    id: 'security',
    title: 'CCTV & Security',
    description: 'CCTV installation, home security setup, alarm systems',
    Icon: Camera,
    details: [
      'CCTV camera installation',
      'Security system setup',
      'Alarm system installation',
      'Video doorbell setup',
      'Security monitoring'
    ]
  },
  {
    id: 'interior',
    title: 'Interior Designing',
    description: 'Consultation, 3D designs, modular kitchen, space planning',
    Icon: Palette,
    details: [
      '3D interior design',
      'Modular kitchen design',
      'Space planning',
      'Furniture layout',
      'Color consultation'
    ]
  },
  {
    id: 'gardening',
    title: 'Gardening & Landscaping',
    description: 'Lawn maintenance, plant setup, garden design',
    Icon: Flower2,
    details: [
      'Garden design',
      'Lawn maintenance',
      'Plant installation',
      'Irrigation setup',
      'Landscape lighting'
    ]
  },
  {
    id: 'automation',
    title: 'Home Automation',
    description: 'Smart lighting, voice control setup, sensor-based systems',
    Icon: Laptop,
    details: [
      'Smart lighting installation',
      'Voice control setup',
      'Security automation',
      'Climate control automation',
      'Entertainment system automation'
    ]
  }
];

export function ServicesPage() {
  const navigate = useNavigate();

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/service-booking/${serviceId}`);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Professional Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Expert solutions for all your home maintenance and improvement needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                Icon={service.Icon}
                details={service.details}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}