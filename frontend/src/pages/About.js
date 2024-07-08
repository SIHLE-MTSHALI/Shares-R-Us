import React from 'react';

const About = () => {
  return (
    <div className="about-container p-4">
      <h1 className="text-3xl mb-4">About Shares'R'Us</h1>
      <p>
        Shares'R'Us is a portfolio management application that helps you keep track of your investments in stocks and cryptocurrencies.
      </p>
      <h2 className="text-2xl mt-4">Founders</h2>
      <p>
        Founded by a team of experienced financial analysts and software engineers, Shares'R'Us aims to provide a comprehensive solution for managing your investments.
      </p>
      <h2 className="text-2xl mt-4">Acknowledgements</h2>
      <p>
        We would like to thank our users and contributors for their valuable feedback and support.
      </p>
      <blockquote className="mt-4">
        "The stock market is filled with individuals who know the price of everything, but the value of nothing." - Philip Fisher
      </blockquote>
    </div>
  );
};

export default About;
