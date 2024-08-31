'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, changePassword, deleteAccount, updateSmtpSettings, testSmtpSettings } from '@/services/api';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
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
      if (response.data.smtpSettings) {
        setSmtpHost(response.data.smtpSettings.host || '');
        setSmtpPort(response.data.smtpSettings.port?.toString() || '');
        setSmtpSecure(response.data.smtpSettings.secure || false);
        setSmtpUser(response.data.smtpSettings.auth?.user || '');
        setSmtpPass(response.data.smtpSettings.auth?.pass || '');
      }
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

  const handleUpdateSmtpSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await updateSmtpSettings({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpSecure,
        user: smtpUser,
        pass: smtpPass,
      });
      setMessage('SMTP settings updated successfully');
    } catch (error) {
      console.error('Error updating SMTP settings:', error);
      setError('Failed to update SMTP settings');
    }
  };

  const handleTestSmtpSettings = async () => {
    setError('');
    setMessage('');

    try {
      await testSmtpSettings();
      setMessage('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email:', error);
      setError('Failed to send test email');
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
          <form onSubmit={handleUpdateSmtpSettings} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">SMTP Settings</h2>
            <div className="mb-4">
              <label htmlFor="smtpHost" className="block mb-2">SMTP Host</label>
              <input
                type="text"
                id="smtpHost"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="smtpPort" className="block mb-2">SMTP Port</label>
              <input
                type="number"
                id="smtpPort"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="smtpSecure" className="block mb-2">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                  className="mr-2"
                />
                Use SSL/TLS
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="smtpUser" className="block mb-2">SMTP Username</label>
              <input
                type="text"
                id="smtpUser"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="smtpPass" className="block mb-2">SMTP Password</label>
              <input
                type="password"
                id="smtpPass"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-4">
              Update SMTP Settings
            </button>
            <button type="button" onClick={handleTestSmtpSettings} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
              Test SMTP Settings
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