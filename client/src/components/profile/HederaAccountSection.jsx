import { useState } from 'react';
import { FaLink, FaExternalLinkAlt, FaUnlink, FaWallet, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

/**
 * Component to display and manage the user's Hedera account
 */
const HederaAccountSection = () => {
  const { user, hederaAccount, connectHederaWallet, disconnectHederaWallet } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get network from environment variables
  const network = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';

  /**
   * Connect to Hedera wallet
   */
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await connectHederaWallet();
      
      if (result.success) {
        setSuccess(`Successfully connected to your Hedera account ${result.accountId}`);
      } else {
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Disconnect Hedera wallet
   */
  const handleDisconnectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await disconnectHederaWallet();
      
      if (result.success) {
        setSuccess('Successfully disconnected your Hedera account');
      } else {
        setError(result.error || 'Failed to disconnect wallet');
      }
    } catch (error) {
      console.error('Disconnect wallet error:', error);
      setError(error.message || 'Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  };

  const formatAccountId = (accountId) => {
    if (!accountId) return null;
    
    // If it's a short ID, display as is
    if (accountId.length < 15) return accountId;
    
    // Truncate in the middle for long account IDs
    return `${accountId.substring(0, 6)}...${accountId.substring(accountId.length - 4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Hedera Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}
      
      {hederaAccount?.isConnected ? (
        <div>
          <div className="flex items-center p-3 bg-gray-50 rounded-md mb-4">
            <FaWallet className="text-primary mr-2" />
            <div>
              <div className="font-medium">Connected Account</div>
              <div className="text-sm text-gray-600 flex items-center">
                {formatAccountId(hederaAccount.accountId || user?.hederaAccountId)}
                <a 
                  href={`https://${network !== 'mainnet' ? network + '.' : ''}hashscan.io/${network}/account/${hederaAccount.accountId || user?.hederaAccountId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  <FaExternalLinkAlt className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDisconnectWallet}
            disabled={loading}
            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaUnlink className="mr-2" />
            )}
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Connect your Hedera wallet to easily manage your infrastructure investments and track your tokens.
          </p>
          
          <button
            onClick={handleConnectWallet}
            disabled={loading}
            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaLink className="mr-2" />
            )}
            Connect Hedera Wallet
          </button>
        </div>
      )}
      
      <div className="mt-4 border-t pt-4">
        <h3 className="text-sm font-medium mb-2">About Hedera Authentication</h3>
        <p className="text-sm text-gray-600">
          Connecting your Hedera account provides a secure, password-less authentication method and allows you to directly interact with your tokenized infrastructure investments.
        </p>
      </div>
    </div>
  );
};

export default HederaAccountSection; 