import React from 'react';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Shares'R'Us</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Application</h2>
          <p className="text-gray-700 mb-4">
            Shares'R'Us is a comprehensive stock portfolio management application designed to empower investors with powerful tools for tracking, analyzing, and managing their stock investments. Our platform combines cutting-edge technology with user-friendly interfaces to provide a seamless and intuitive experience for both novice and experienced investors.
          </p>
          <p className="text-gray-700 mb-4">
            With Shares'R'Us, users can create and manage multiple portfolios, track real-time stock prices, view detailed analytics on their investments, and stay informed with the latest market news and trends. Our application also features an advanced search functionality, allowing users to discover new investment opportunities and add them to their watchlist.
          </p>
          <p className="text-gray-700">
            Whether you're looking to monitor your long-term investments, analyze your portfolio's performance, or stay on top of market movements, Shares'R'Us provides the tools and insights you need to make informed investment decisions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Sihle Mtshali: Backend Developer</h3>
            <p className="text-gray-700">
              Sihle is the backbone of our backend infrastructure, bringing extensive experience in server-side technologies to Shares'R'Us. With a deep understanding of FastAPI and PostgreSQL, Sihle architects robust and scalable solutions that power our application's core functionalities. His expertise in API integration ensures seamless communication between our frontend and various financial data sources, enabling real-time updates and accurate portfolio management.
            </p>
            <p className="text-gray-700 mt-2">
              Sihle's passion for optimizing database operations and implementing efficient algorithms contributes significantly to the application's performance and reliability. His meticulous approach to security and data integrity guarantees that user information and financial data are protected to the highest standards.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Xola Mthembu: Frontend Developer</h3>
            <p className="text-gray-700">
              Xola leads the charge in creating the visually appealing and highly intuitive user interface of Shares'R'Us. With a keen eye for design and a mastery of React.js and Tailwind CSS, Xola transforms complex financial data into easily digestible visual components. Her focus on user experience ensures that navigating through portfolios, analyzing stocks, and managing investments is not just efficient but also enjoyable.
            </p>
            <p className="text-gray-700 mt-2">
              Xola's expertise in responsive design guarantees that Shares'R'Us performs flawlessly across all devices, from desktop computers to mobile phones. Her innovative approach to frontend development, coupled with a deep understanding of modern web technologies, allows for the seamless integration of real-time data updates and interactive charts, providing users with a dynamic and engaging investment management experience.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;