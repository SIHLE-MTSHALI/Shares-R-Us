import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../services/api';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const Profile = () => {
  const [settings, setSettings] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getUserSettings();
        setSettings(response.data);
      } catch (error) {
        toast.error('Failed to fetch user settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserSettings(settings);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-2">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={settings.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-2">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={settings.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-accent text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Layout>
  );
};

export default Profile;