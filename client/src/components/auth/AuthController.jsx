import { useState, useEffect } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import HederaAuth from './HederaAuth';

/**
 * Authentication controller modal that handles Hedera authentication
 */
const AuthController = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Close modal if authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-auto relative z-10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary-dark p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Hedera Authentication
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <FaSpinner className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
                <p className="text-gray-600">Processing...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}

                <HederaAuth
                  onSuccess={handleAuthSuccess}
                  onError={setError}
                  setLoading={setLoading}
                />
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    StakeMate uses Hedera accounts for secure, passwordless authentication.
                  </p>
                  <p className="mt-2">
                    Your Hedera account provides direct access to infrastructure investment tokens.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthController; 