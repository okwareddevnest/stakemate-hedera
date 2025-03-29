import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';

/**
 * Controller for auth modals
 * Manages which modal is shown and handles transitions between them
 */
const AuthController = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [currentModal, setCurrentModal] = useState(initialMode);

  // Skip rendering if modals are closed
  if (!isOpen) return null;

  const showLogin = () => setCurrentModal('login');
  const showRegister = () => setCurrentModal('register');
  const showForgotPassword = () => setCurrentModal('forgotPassword');

  return (
    <>
      <LoginModal
        isOpen={currentModal === 'login'}
        onClose={onClose}
        onShowRegister={showRegister}
        onShowForgotPassword={showForgotPassword}
      />
      
      <RegisterModal
        isOpen={currentModal === 'register'}
        onClose={onClose}
        onShowLogin={showLogin}
      />
      
      <ForgotPasswordModal
        isOpen={currentModal === 'forgotPassword'}
        onClose={onClose}
        onShowLogin={showLogin}
      />
    </>
  );
};

export default AuthController; 