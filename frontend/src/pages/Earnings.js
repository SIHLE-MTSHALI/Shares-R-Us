import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/earnings')
      .then(response => setEarnings(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="earnings-container p-4">
      <h1 className="text-3xl mb-4">Earnings Calendar</h1>
      <ul>
        {earnings.map(earning => (
          <li key={earning.id} className="mb-4">
            <p className="text-xl">{earning.company}</p>
            <p className="text-sm text-gray-600">Date: {new Date(earning.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Earnings: {earning.earnings}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Earnings;
