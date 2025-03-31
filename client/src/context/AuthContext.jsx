import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Create auth context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hederaClient, setHederaClient] = useState(null);
  const [hederaAccount, setHederaAccount] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Clear any invalid tokens first
        const token = localStorage.getItem('token');
        if (token) {
          try {
            // Verify token with backend
            const response = await authService.getProfile();
            
            // Check if response has the expected structure
            if (response && response.success && response.data) {
              setUser(response.data);
              setIsAuthenticated(true);
              
              // Initialize Hedera client if user has Hedera account
              if (response.data.hederaAccountId) {
                initHederaClient(response.data.hederaAccountId);
              }
            } else {
              console.warn('Invalid response structure:', response);
              // Token is invalid or response is malformed, clear it
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.warn('Could not verify token with backend:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token found
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear any invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Initialize Hedera client
  const initHederaClient = (accountId) => {
    try {
      // For browser compatibility we'll defer real SDK initialization
      // and just track the account information
      
      console.log('Initializing Hedera client for account:', accountId);
      
      const mockHederaAccount = {
        accountId,
        network: import.meta.env.VITE_HEDERA_NETWORK || 'testnet',
        isConnected: true,
        balance: '100.00 HBAR', // Mock balance
        lastChecked: new Date().toISOString()
      };
      
      setHederaAccount(mockHederaAccount);
      return true;
    } catch (error) {
      console.error('Error initializing Hedera client:', error);
      return false;
    }
  };
  
  // Connect Hedera wallet (such as HashPack)
  const connectHederaWallet = async (userProvidedAccountId) => {
    try {
      // Use the user-provided account ID if available, otherwise fall back to env variable
      const accountId = userProvidedAccountId || import.meta.env.VITE_HEDERA_ACCOUNT_ID;
      
      if (!accountId) {
        return { 
          success: false, 
          error: "No Hedera account ID provided" 
        };
      }
      
      // Update user profile with Hedera account
      const updatedUser = await authService.updateProfile({
        ...user,
        hederaAccountId: accountId
      });
      
      if (updatedUser) {
        setUser(updatedUser);
        const success = initHederaClient(accountId);
        return { success, accountId };
      }
      
      return { success: false, error: "Failed to update user profile" };
    } catch (error) {
      console.error("Error connecting Hedera wallet:", error);
      return { success: false, error: error.message };
    }
  };
  
  // Disconnect Hedera wallet
  const disconnectHederaWallet = async () => {
    try {
      // Remove Hedera account from user profile
      const updatedUser = await authService.updateProfile({
        ...user,
        hederaAccountId: null
      });
      
      if (updatedUser) {
        setUser(updatedUser);
        setHederaAccount(null);
        setHederaClient(null);
        return { success: true };
      }
      
      return { success: false, error: "Failed to update user profile" };
    } catch (error) {
      console.error("Error disconnecting Hedera wallet:", error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Authenticate user with Hedera account and signature
   * @param {string} accountId - Hedera account ID (e.g., "0.0.123456")
   * @param {string} signature - Signature to verify
   * @returns {Object} - Response with success status and user data or error
   */
  const loginWithHedera = async (accountId, signature) => {
    try {
      setLoading(true);
      
      // Call backend to verify Hedera signature and get JWT token
      const response = await authService.loginWithHedera(accountId, signature);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update state
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Initialize Hedera client
        initHederaClient(accountId);
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Hedera login error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Initialize Hedera client if user has Hedera account
        if (userData.hederaAccountId) {
          initHederaClient(userData.hederaAccountId);
        }
      }
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  /**
   * Log in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - API response
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Initialize Hedera client if user has Hedera account
        if (response.user.hederaAccountId) {
          initHederaClient(response.user.hederaAccountId);
        }
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setHederaClient(null);
    setHederaAccount(null);
  };

  /**
   * Update the user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - API response
   */
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    hederaClient,
    hederaAccount,
    register,
    login,
    loginWithHedera,
    logout,
    updateProfile,
    connectHederaWallet,
    disconnectHederaWallet,
    initHederaClient
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This is needed for Fast Refresh to work properly
export default AuthContext; 