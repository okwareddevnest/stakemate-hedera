import React, { useState } from 'react';
import { FaWallet, FaChartBar, FaTools, FaExchangeAlt, FaCalculator, FaInfoCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import TransactionVerifier from '../components/projects/TransactionVerifier';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  const getTabClassName = (tabName) => {
    return `px-4 py-2 rounded-lg flex items-center ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hedera Toolkit</h1>
        <p className="text-gray-600">
          A suite of tools to help you interact with the Hedera network and manage your infrastructure investments.
        </p>
      </div>

      {/* Tool Navigation */}
      <div className="flex flex-wrap space-x-2 mb-8">
        <button
          onClick={() => setActiveTab('transactions')}
          className={getTabClassName('transactions')}
        >
          <FaExchangeAlt className="mr-2" /> Transaction Verifier
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={getTabClassName('calculator')}
        >
          <FaCalculator className="mr-2" /> Investment Calculator
        </button>
        <button
          onClick={() => setActiveTab('explorer')}
          className={getTabClassName('explorer')}
        >
          <FaInfoCircle className="mr-2" /> Token Explorer
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={getTabClassName('reports')}
        >
          <FaFileInvoiceDollar className="mr-2" /> Reports Generator
        </button>
      </div>

      {/* Tool Content */}
      <div>
        {activeTab === 'transactions' && (
          <div className="grid grid-cols-1 gap-6">
            <TransactionVerifier />
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About Hedera Transactions</h2>
              <p className="mb-4">
                Hedera's distributed ledger provides a fast, fair, and secure platform for processing transactions. 
                Each transaction on the Hedera network has a unique Transaction ID and is verified by the network's 
                consensus mechanism.
              </p>
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-700 mb-2">Transaction Facts</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Transactions are finalized in seconds, not minutes</li>
                  <li>Hedera uses a proof-of-stake consensus mechanism</li>
                  <li>Transaction fees are typically fractions of a cent</li>
                  <li>All transactions are cryptographically secured</li>
                  <li>The Hedera ledger is publicly auditable</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Investment Calculator</h2>
            <p className="text-gray-600 mb-8">Coming soon - A tool to calculate returns on infrastructure token investments.</p>
            
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FaCalculator className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Investment Calculator</h3>
                <p className="mt-1 text-sm text-gray-500">This feature is under development</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Token Explorer</h2>
            <p className="text-gray-600 mb-8">Coming soon - Explore tokenized infrastructure assets on the Hedera network.</p>
            
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FaInfoCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Token Explorer</h3>
                <p className="mt-1 text-sm text-gray-500">This feature is under development</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Reports Generator</h2>
            <p className="text-gray-600 mb-8">Coming soon - Generate detailed reports on your tokenized infrastructure investments.</p>
            
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Reports Generator</h3>
                <p className="mt-1 text-sm text-gray-500">This feature is under development</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools; 