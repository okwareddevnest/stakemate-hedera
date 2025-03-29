import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  /**
   * Log in a user
   * @param {Object} credentials - Login credentials
   * @returns {Promise} - API response
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Login failed');
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch profile');
    }
  },

  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to update profile');
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

      const response = await axios.put(`${API_URL}/auth/risk-profile`, riskData, {
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
   * @param {Object} passwordData - Password change data
   * @returns {Promise} - API response
   */
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.put(`${API_URL}/auth/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to change password');
    }
  },

  /**
   * Request a password reset
   * @param {string} email - User's email
   * @returns {Promise} - API response
   */
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to request password reset');
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
  }
};

export default authService; 