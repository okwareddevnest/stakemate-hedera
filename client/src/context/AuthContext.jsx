import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          
          // Validate token by fetching profile
          try {
            const profileResponse = await authService.getProfile();
            if (profileResponse.success) {
              setUser(prevUser => ({
                ...prevUser,
                ...profileResponse.data
              }));
            }
          } catch (profileError) {
            // If token is invalid, log out
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data
        }));
      }
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 