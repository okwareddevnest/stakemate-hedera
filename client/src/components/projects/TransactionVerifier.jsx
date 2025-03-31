import { useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSearch, FaSpinner, FaFileAlt, FaExternalLinkAlt } from 'react-icons/fa';
import hederaService from '../../services/hederaService';

const TransactionVerifier = () => {
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  /**
   * Handle form submission to verify transaction
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setError('Please enter a transaction ID');
      return;
    }

    setLoading(true);
    setError(null);
    setTransaction(null);

    try {
      // Get transaction data from Hedera Mirror Node
      const transactionData = await hederaService.verifyTransaction(transactionId);
      
      if (transactionData) {
        // Format the data for display
        const formattedTransaction = {
          id: transactionId,
          type: transactionData.name || 'TRANSACTION',
          status: transactionData.result || 'SUCCESS',
          fee: transactionData.charged_tx_fee || 
               (transactionData.transaction_fee ? transactionData.transaction_fee.toString() : '0'),
          timestamp: transactionData.consensus_timestamp || new Date().toISOString(),
          memo: transactionData.memo_base64 ? atob(transactionData.memo_base64) : '',
          transfers: transactionData.transfers || [],
          tokenId: transactionData.token_id || null,
          amount: transactionData.amount || null,
          consensusTimestamp: transactionData.consensus_timestamp
        };
        
        setTransaction(formattedTransaction);
      } else {
        setError('No transaction data found for the provided ID');
      }
    } catch (err) {
      console.error('Error verifying transaction:', err);
      setError('Failed to verify transaction. ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format timestamp to readable date/time
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  /**
   * Get status badge with appropriate color
   */
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusColors = {
      'SUCCESS': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'SUCCESS' && <FaCheckCircle className="mr-1" />}
        {status === 'PENDING' && <FaExclamationTriangle className="mr-1" />}
        {status === 'FAILED' && <FaExclamationTriangle className="mr-1" />}
        {status}
      </span>
    );
  };

  const network = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Hedera Transaction Verifier</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter Hedera transaction ID (e.g., 0.0.1234@1624150338.453212356)"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white ${
              loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaSearch className="mr-2" />
            )}
            Verify
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {transaction && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">Transaction Details</h3>
            <div className="flex space-x-2">
              {getStatusBadge(transaction.status)}
              <a
                href={`https://${network !== 'mainnet' ? network + '.' : ''}hashscan.io/${network}/transaction/${encodeURIComponent(transaction.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark"
              >
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm break-all">{transaction.id}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Type</p>
                <p>{transaction.type}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Timestamp</p>
                <p>{formatDate(transaction.timestamp)}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-500">Fee</p>
                <p>{transaction.fee} ℏ</p>
              </div>
            </div>
            
            <div>
              {transaction.memo && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Memo</p>
                  <p>{transaction.memo}</p>
                </div>
              )}
              
              {transaction.tokenId && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Token ID</p>
                  <p className="font-mono text-sm">{transaction.tokenId}</p>
                </div>
              )}
              
              {transaction.amount && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p>{transaction.amount}</p>
                </div>
              )}
            </div>
          </div>
          
          {transaction.transfers && transaction.transfers.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Transfers</h4>
              <div className="bg-white rounded border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transaction.transfers.map((transfer, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-mono">
                          {transfer.account || transfer.account_id}
                        </td>
                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-right ${
                          parseFloat(transfer.amount) < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {parseFloat(transfer.amount) < 0 ? '' : '+'}
                          {transfer.amount} {transaction.tokenId ? 'tokens' : 'ℏ'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button 
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary bg-primary-50 hover:bg-primary-100"
              onClick={() => window.print()}
            >
              <FaFileAlt className="mr-1" />
              Export Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionVerifier; 