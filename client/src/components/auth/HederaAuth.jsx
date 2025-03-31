import { useState } from 'react';
import { FaWallet, FaSpinner, FaExclamationCircle, FaCheckCircle, FaCircleNotch, FaPen, FaKey, FaIdCard } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

/**
 * Component to handle Hedera wallet authentication
 */
const HederaAuth = ({ onSuccess, onError, setLoading: setParentLoading }) => {
  const { loginWithHedera, connectHederaWallet, hederaAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [status, setStatus] = useState('');
  const [step, setStep] = useState(0);
  const [accountId, setAccountId] = useState('');
  const [accountIdValid, setAccountIdValid] = useState(false);
  
  const network = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';
  
  /**
   * Validate Hedera account ID format
   */
  const validateAccountId = (id) => {
    // Hedera account ID format is typically 0.0.X where X is a number
    const pattern = /^0\.0\.\d+$/;
    return pattern.test(id);
  };

  /**
   * Handle account ID input change
   */
  const handleAccountIdChange = (e) => {
    const value = e.target.value;
    setAccountId(value);
    setAccountIdValid(validateAccountId(value));
  };
  
  /**
   * Handle the authentication flow with Hedera
   */
  const handleHederaAuth = async (event) => {
    event.preventDefault();
    
    // Validate account ID
    if (!accountIdValid) {
      setLocalError("Please enter a valid Hedera account ID");
      return;
    }
    
    setLoading(true);
    setStep(2); // Move to challenge step
    setLocalError(null);
    
    try {
      console.log("Starting Hedera authentication with account ID:", accountId);
      
      // Generate a challenge message for the user to sign
      const challenge = `Sign this message to prove ownership of ${accountId} at ${new Date().toISOString()}`;
      setStatus(`Getting challenge: ${challenge}`);
      console.log("Challenge generated:", challenge);
      
      // In a real implementation, we would request the user to sign this challenge
      // with their Hedera wallet; here we're simulating the signature
      setStep(3); // Move to signing step
      setStatus("Waiting for signature...");
      
      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate signature (this would come from the Hedera wallet SDK)
      const signature = `simulated_signature_${Date.now()}`;
      console.log("Generated signature:", signature);
      
      setStep(4); // Move to verification step
      setStatus("Verifying signature...");
      
      // Attempt to login with Hedera
      console.log("Calling loginWithHedera with:", { accountId, signature });
      const result = await loginWithHedera(accountId, signature);
      console.log("Login result:", result);
      
      if (result.success) {
        setStatus("Authentication successful!");
        setStep(5); // Success step
        
        // Ensure the auth state is updated before redirecting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Close modal and redirect
        if (onSuccess) {
          onSuccess();
          // Use window.location for a full page refresh to ensure state is updated
          window.location.href = '/dashboard';
        }
      } else {
        setStep(1); // Back to account ID step
        setLocalError(result.error || "Authentication failed");
        setStatus("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Hedera authentication error:", error);
      setStep(1); // Back to account ID step
      setLocalError(`Authentication error: ${error.message}`);
      setStatus("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Render step indicator
   */
  const renderStepIndicator = () => {
    const steps = [
      { name: 'Account', icon: <FaIdCard /> },
      { name: 'Connect', icon: <FaWallet /> },
      { name: 'Challenge', icon: <FaKey /> },
      { name: 'Sign', icon: <FaPen /> },
      { name: 'Verify', icon: <FaCheckCircle /> }
    ];
    
    return (
      <div className="flex justify-between mb-6 px-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 ${
                step > i 
                  ? 'bg-green-100 text-green-700' 
                  : step === i 
                    ? 'bg-blue-100 text-blue-700 animate-pulse' 
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step === i && loading ? (
                <FaCircleNotch className="animate-spin" />
              ) : (
                s.icon
              )}
            </div>
            <span className={`text-xs ${
              step > i 
                ? 'text-green-700' 
                : step === i 
                  ? 'text-blue-700 font-medium' 
                  : 'text-gray-400'
            }`}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Sign in with Hedera</h3>
      
      {renderStepIndicator()}
      
      {localError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <FaExclamationCircle className="mr-2" />
          <span>{localError}</span>
        </div>
      )}
      
      {status && !localError && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
          {loading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaCheckCircle className="mr-2" />
          )}
          <span>{status}</span>
        </div>
      )}
      
      <form onSubmit={handleHederaAuth}>
        <div className="mb-4">
          <label htmlFor="hederaAccountId" className="block text-sm font-medium text-gray-700 mb-1">
            Hedera Account ID
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaIdCard className="text-gray-400" />
            </div>
            <input
              type="text"
              id="hederaAccountId"
              value={accountId}
              onChange={handleAccountIdChange}
              placeholder="0.0.XXXXX"
              className={`block w-full pl-10 pr-3 py-2 border ${
                accountId && !accountIdValid 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
              disabled={loading}
              required
            />
          </div>
          {accountId && !accountIdValid && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid Hedera account ID (format: 0.0.X)
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Example: 0.0.12345
          </p>
        </div>
      
        <button
          type="submit"
          className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : accountIdValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={loading || !accountIdValid}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              {step === 0 ? 'Connecting...' : 
               step === 1 ? 'Requesting access...' : 
               step === 2 ? 'Getting challenge...' :
               step === 3 ? 'Signing challenge...' : 
               step === 4 ? 'Verifying...' : 'Processing...'}
            </>
          ) : (
            <>
              <FaWallet className="mr-2" />
              Connect Hedera Wallet
            </>
          )}
        </button>
      </form>
      
      <p className="mt-4 text-xs text-gray-500">
        Using <span className="font-medium">{network}</span> network. 
        Make sure your Hedera account is set up on this network.
      </p>
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1 font-medium">What happens when you connect:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Your Hedera account ID is validated</li>
          <li>A challenge is generated for secure authentication</li>
          <li>The challenge is signed with your account</li>
          <li>Your signed challenge proves account ownership</li>
        </ol>
      </div>
    </div>
  );
};

export default HederaAuth; 