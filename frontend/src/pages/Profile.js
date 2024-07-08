import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/v1/auth/profile')
      .then(response => setUser(response.data))
      .catch(error => console.error(error));
  }, []);

  if (!user) return <div>Loading...</div>;

  const handleUpdate = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    axios.put('/api/v1/auth/profile', {
      email: email.value,
      password: password.value,
    })
      .then(response => setUser(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div className="profile-container p-4">
      <h1 className="text-3xl mb-4">Profile</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
