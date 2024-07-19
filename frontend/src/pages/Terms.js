import React from 'react';
import Layout from '../components/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        
        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to Shares'R'Us. By using our application, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not use this application.
          </p>
          
          <h2 className="text-2xl font-semibold">1. Acceptance of Agreement</h2>
          <p>
            You agree to the terms and conditions outlined in this Terms of Use Agreement ("Agreement") with respect to our application (the "Application"). This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties and understandings with respect to the Application, the content, products or services provided by or through the Application, and the subject matter of this Agreement.
          </p>
          
          <h2 className="text-2xl font-semibold">2. Use of the Application</h2>
          <p>
            The Application is provided for informational purposes only. You are solely responsible for your use of the Application and for any investment decisions you make. The content provided through the Application should not be considered as financial advice.
          </p>
          
          <h2 className="text-2xl font-semibold">3. User Account</h2>
          <p>
            To use certain features of the Application, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
          </p>
          
          <h2 className="text-2xl font-semibold">4. Privacy Policy</h2>
          <p>
            Your use of the Application is also governed by our Privacy Policy, which is incorporated into this Agreement by reference.
          </p>
          
          <h2 className="text-2xl font-semibold">5. Disclaimer of Warranties</h2>
          <p>
            The Application is provided "as is" without warranty of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          
          <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
          <p>
            In no event shall Shares'R'Us be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of the Application.
          </p>
          
          <h2 className="text-2xl font-semibold">7. Changes to Agreement</h2>
          <p>
            We reserve the right to modify this Agreement at any time. Your continued use of the Application after any such changes constitutes your acceptance of the new Terms of Use.
          </p>
          
          <h2 className="text-2xl font-semibold">8. Governing Law</h2>
          <p>
            This Agreement shall be governed by and construed in accordance with the laws of South Africa, without giving effect to any principles of conflicts of law.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;