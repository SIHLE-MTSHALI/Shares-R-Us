import React from 'react';
import axios from 'axios'; // Ensure axios is correctly imported

const Contact = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, message } = event.target.elements;

    axios.post('/api/v1/contact', {
      name: name.value,
      email: email.value,
      message: message.value,
    })
      .then(response => alert('Message sent!'))
      .catch(error => console.error(error));
  };

  return (
    <div className="contact-container p-4">
      <h1 className="text-3xl mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>Message</label>
          <textarea
            name="message"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
