import { useState } from 'react';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onSuccess, onRegisterClick, onForgotClick, onError, setLoading: setParentLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      onError && onError('Email and password are required');
      return;
    }

    try {
      setLocalLoading(true);
      setParentLoading && setParentLoading(true);
      
      const result = await login(email, password);
      
      if (result.success) {
        onSuccess && onSuccess();
      } else {
        onError && onError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      onError && onError(error.message || 'An unexpected error occurred');
    } finally {
      setLocalLoading(false);
      setParentLoading && setParentLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
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

        <div>
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotClick}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </button>
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={localLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {localLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Don't have an account?</span>{' '}
        <button
          type="button"
          onClick={onRegisterClick}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Create one
        </button>
      </div>
    </form>
  );
};

export default Login; 