import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { updateUserSettings } from '../redux/reducers/userReducer';
import { getUserSettings, updateUserSettings as updateUserSettingsAPI } from '../services/api';

const UserSettings = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    email: '',
    defaultCurrency: 'USD',
    theme: 'light',
    notificationsEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        const data = await getUserSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to fetch user settings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserSettingsAPI(settings);
      dispatch(updateUserSettings(settings));
      alert('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">User Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="defaultCurrency" className="block mb-2">Default Currency</label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="theme" className="block mb-2">Theme</label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleChange}
              className="mr-2"
            />
            Enable Notifications
          </label>
        </div>
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
          Save Settings
        </button>
      </form>
    </Layout>
  );
};

export default UserSettings;