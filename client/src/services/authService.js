import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if it exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to landing page on auth error
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * Service for handling authentication-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  /**
   * Log in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - API response
   */
  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  /**
   * Log in a user with Hedera account
   * @param {string} accountId - Hedera account ID
   * @param {string} signature - Hedera signature
   * @returns {Promise} - API response or null if fails
   */
  loginWithHedera: async (accountId, signature) => {
    try {
      const response = await axios.post('/auth/hedera', { accountId, signature });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Hedera login error:', error);
      throw error;
    }
  },

  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get the current user's profile
   * @returns {Promise} - API response
   */
  getProfile: async () => {
    try {
      const response = await axios.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Update the user's risk profile
   * @param {Object} riskData - Risk profile data
   * @returns {Promise} - API response
   */
  updateRiskProfile: async (riskData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.put('/auth/risk-profile', riskData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to update risk profile');
    }
  },

  /**
   * Change the user's password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - API response
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data.success;
    } catch (error) {
      console.error('Change password error:', error);
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  /**
   * Request a password reset link
   * @param {string} email - User's email
   * @returns {Promise} - API response
   */
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data || { message: 'Failed to send reset link' };
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} - API response
   */
  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to reset password');
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current user
   * @returns {Object|null} - Current user data
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get authorization header
   * @returns {Object} - Headers with authorization token
   */
  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * Generate a challenge for Hedera wallet authentication
   * @param {string} accountId - Hedera account ID
   * @returns {Promise} - API response
   */
  getAuthChallenge: async (accountId) => {
    try {
      const response = await axios.get(`/auth/challenge?accountId=${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Get challenge error:', error);
      throw error.response?.data || { message: 'Failed to get challenge' };
    }
  },

  /**
   * Link a Hedera account to the user's profile
   * @param {string} accountId - Hedera account ID
   * @param {string} publicKey - Hedera public key
   * @param {string} signature - Hedera signature
   * @returns {Promise} - API response
   */
  linkHederaAccount: async (accountId, publicKey, signature) => {
    try {
      const response = await axios.post('/auth/link-hedera', {
        accountId,
        publicKey,
        signature
      });
      return response.data;
    } catch (error) {
      console.error('Link Hedera account error:', error);
      throw error.response?.data || { message: 'Failed to link Hedera account' };
    }
  },

  /**
   * Unlink a Hedera account from the user's profile
   * @returns {Promise} - API response
   */
  unlinkHederaAccount: async () => {
    try {
      const response = await axios.post('/auth/unlink-hedera');
      return response.data;
    } catch (error) {
      console.error('Unlink Hedera account error:', error);
      throw error.response?.data || { message: 'Failed to unlink Hedera account' };
    }
  },

  /**
   * Validate the current token
   * @returns {Promise} - API response
   */
  validateToken: async () => {
    try {
      const response = await axios.get('/auth/validate');
      return response.data.isValid;
    } catch (error) {
      console.error('Validate token error:', error);
      return false;
    }
  }
};

export default authService; 