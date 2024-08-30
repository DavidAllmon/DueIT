'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, changePassword, deleteAccount } from '@/services/api';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount();
        logout();
        router.push('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        setError('Failed to delete account');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <p className="mb-4">Email: {email}</p>
          <form onSubmit={handleChangePassword} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block mb-2">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Change Password
            </button>
          </form>
          <div>
            <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
            <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}