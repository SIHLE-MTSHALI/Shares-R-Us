import React from 'react';

const Notification = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-0 right-0 m-4 p-4 rounded-md text-white ${bgColor}`}>
      {message}
    </div>
  );
};

export default Notification;