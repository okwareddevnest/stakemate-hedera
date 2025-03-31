import { useState } from 'react';
import { FaEnvelope, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import authService from '../../services/authService';

const ForgotPassword = ({ onLoginClick, onError, setLoading: setParentLoading }) => {
  const [email, setEmail] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      onError && onError('Email is required');
      return;
    }

    try {
      setLocalLoading(true);
      setParentLoading && setParentLoading(true);
      
      // Call the forgot password API
      await authService.forgotPassword(email);
      
      // Mark as submitted - we don't check for errors to prevent email enumeration
      setSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      // We don't show an error to prevent email enumeration attacks
      // Just mark it as submitted regardless
      setSubmitted(true);
    } finally {
      setLocalLoading(false);
      setParentLoading && setParentLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
          <FaCheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Reset link sent</h3>
        <p className="mt-2 text-sm text-gray-500">
          If an account exists with the email {email}, we've sent instructions for resetting your password.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onLoginClick}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
      <p className="mt-2 text-sm text-gray-500">
        Enter the email address associated with your account, and we'll send you a link to reset your password.
      </p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={localLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {localLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onLoginClick}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword; 