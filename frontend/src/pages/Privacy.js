import React from 'react';
import Layout from '../components/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <p>
            At Shares'R'Us, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
          
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and financial information related to your portfolios.
          </p>
          
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate, maintain, and provide you with the features and functionality of the Application, as well as to communicate directly with you, such as to send you email messages and push notifications.
          </p>
          
          <h2 className="text-2xl font-semibold">3. Sharing of Your Information</h2>
          <p>
            We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. We may share your information with third-party service providers who perform services on our behalf, such as hosting and data analysis.
          </p>
          
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p>
            We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error-free.
          </p>
          
          <h2 className="text-2xl font-semibold">5. Your Choices</h2>
          <p>
            You may update, correct, or delete your account information at any time by logging into your account or by contacting us directly. You may also opt-out of receiving promotional communications from us by following the instructions in those communications.
          </p>
          
          <h2 className="text-2xl font-semibold">6. Changes to This Privacy Policy</h2>
          <p>
            We may modify this Privacy Policy from time to time. If we make material changes to this policy, we will notify you by email or by posting a notice on our Application prior to the effective date of the changes.
          </p>
          
          <h2 className="text-2xl font-semibold">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or the Application, please contact us at privacy@sharesrus.com.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;