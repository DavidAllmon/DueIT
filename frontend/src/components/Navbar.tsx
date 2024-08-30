'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <span className="text-white text-2xl font-bold">DueIT</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/profile" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center">
              <FaUser className="mr-2" />
              Profile
            </Link>
            <button 
              onClick={logout}
              className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ml-4 flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}