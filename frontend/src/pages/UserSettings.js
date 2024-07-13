import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Removed useDispatch as it's no longer needed
import Layout from '../components/Layout';
import { getUserSettings, updateUserSettings as updateUserSettingsAPI } from '../services/api';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

const UserSettings = () => {
  // Removed const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [settings, setSettings] = useState({
    email: user?.email || '',
    defaultCurrency: 'ZAR',
    theme: 'light',
    notificationsEnabled: true,
    language: 'en-ZA',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        const data = await getUserSettings();
        setSettings(prevSettings => ({ ...prevSettings, ...data }));
      } catch (err) {
        setError('Failed to fetch user settings');
        toast.error('Failed to fetch user settings');
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
      // Note: We're not dispatching any action here as we're not using Redux for user settings
      toast.success('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
      toast.error('Failed to update settings');
    }
  };

  if (loading) return <Layout><div><FormattedMessage id="loading" /></div></Layout>;
  if (error) return <Layout><div><FormattedMessage id="error" values={{ error }} /></div></Layout>;
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4"><FormattedMessage id="userSettings.title" /></h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2"><FormattedMessage id="userSettings.email" /></label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            disabled // Email field is now disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="defaultCurrency" className="block mb-2"><FormattedMessage id="userSettings.currency" /></label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="ZAR">ZAR</option> {/* Added ZAR option */}
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="theme" className="block mb-2"><FormattedMessage id="userSettings.theme" /></label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="light"><FormattedMessage id="userSettings.theme.light" /></option>
            <option value="dark"><FormattedMessage id="userSettings.theme.dark" /></option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block mb-2"><FormattedMessage id="userSettings.language" /></label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="en-ZA">English (South Africa)</option>
            <option value="en-US">English (United States)</option>
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
            <FormattedMessage id="userSettings.notifications" />
          </label>
        </div>
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors">
          <FormattedMessage id="userSettings.save" />
        </button>
      </form>
    </Layout>
  );
};

export default UserSettings;