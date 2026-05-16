import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center p-4">
    <p className="text-8xl font-black text-brand-600 mb-4">404</p>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard">
      <Button icon={<Home size={16} />}>Back to Dashboard</Button>
    </Link>
  </div>
);

export default NotFoundPage;
