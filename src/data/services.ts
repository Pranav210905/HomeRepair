import { Wrench, PaintBucket, Plug, Hammer, Thermometer, Sprout, Droplets, Brush } from 'lucide-react';
import type { Service } from '../types';

export const services: Service[] = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    description: 'Expert plumbing services for all your needs',
    Icon: Droplets,
    longDescription: 'Professional plumbing services including leak fixes, pipe installation, bathroom fitting, and emergency repairs. Our certified plumbers ensure quality workmanship and reliable solutions for all your plumbing needs.'
  },
  {
    id: 'electrical',
    title: 'Electrical',
    description: 'Professional electrical repair and installation',
    Icon: Plug,
    longDescription: 'Comprehensive electrical services including wiring, socket installation, fan repair, and lighting setup. Our licensed electricians prioritize safety and efficiency in all electrical works.'
  },
  {
    id: 'painting',
    title: 'Painting',
    description: 'Transform your space with quality painting',
    Icon: PaintBucket,
    longDescription: 'Expert painting services for both interior and exterior spaces. We offer wall texturing, waterproofing, and custom paint solutions to bring your vision to life.'
  },
  {
    id: 'carpentry',
    title: 'Carpentry',
    description: 'Custom woodwork and repairs',
    Icon: Hammer,
    longDescription: 'Skilled carpentry services including furniture repair, custom cabinets, and door/window fixes. Our experienced carpenters deliver precision and quality in every project.'
  },
  {
    id: 'hvac',
    title: 'HVAC',
    description: 'Heating and cooling system services',
    Icon: Thermometer,
    longDescription: 'Complete HVAC solutions including installation, maintenance, and repair of heating and cooling systems. We ensure your comfort in all seasons.'
  },
  {
    id: 'landscaping',
    title: 'Landscaping',
    description: 'Beautiful outdoor space maintenance',
    Icon: Sprout,
    longDescription: 'Professional landscaping services including lawn maintenance, garden design, and plant care. Transform your outdoor space into a beautiful and sustainable environment.'
  },
  {
    id: 'general-repairs',
    title: 'General Repairs',
    description: 'All-around home maintenance and repairs',
    Icon: Wrench,
    longDescription: 'Comprehensive home maintenance and repair services. From minor fixes to major repairs, we keep your home in perfect condition.'
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    description: 'Professional cleaning services',
    Icon: Brush,
    longDescription: 'thorough cleaning services for homes and offices. We provide deep cleaning, sanitization, and specialized cleaning solutions for all your needs.'
  }
];