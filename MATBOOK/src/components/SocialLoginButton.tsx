
import React from 'react';

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onClick: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClick }) => {
  const getIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.72 16.428C11.588 16.428 10.72 15.56 10.72 14.428C10.72 13.296 11.588 12.428 12.72 12.428H12.732C13.864 12.428 14.732 13.296 14.732 14.428C14.732 15.56 13.864 16.428 12.72 16.428ZM17.266 12.8H16.578C16.364 12.8 16.2 12.636 16.2 12.422C16.2 10.532 14.656 8.988 12.766 8.988H12.726C10.836 8.988 9.292 10.532 9.292 12.422C9.292 12.636 9.128 12.8 8.914 12.8H8.226C8.012 12.8 7.848 12.636 7.848 12.422C7.848 9.728 10.032 7.544 12.726 7.544H12.766C15.46 7.544 17.644 9.728 17.644 12.422C17.644 12.636 17.48 12.8 17.266 12.8Z" fill="#DB4437"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z" fill="#1877F2"/>
          </svg>
        );
      case 'apple':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.94 5.19C16.35 3.545 16.35 1 16.35 1C16.35 1 13.29 1.24 11.87 3.525C10.45 5.81 11.02 8 11.02 8C11.02 8 13.53 6.835 14.94 5.19Z" fill="black"/>
            <path d="M12 8.527C11.02 8.527 10.15 9.254 8.98 9.254C6.97 9.254 5 7.037 5 4.127C5 1.218 7.45 0 8.84 0C10.23 0 11.33 1.1 12.16 1.1C12.99 1.1 14.26 0 15.5 0C16.74 0 19 0.873 19 3.782C19 6.691 17.12 9.254 15.34 9.254C14.47 9.254 13.45 8.527 12 8.527ZM9 10.618C10.15 10.618 10.87 11.691 12 11.691C13.13 11.691 13.85 10.618 15 10.618C15.6 10.618 16.67 11.5 17.36 13.036C16.67 13.618 16.19 14.527 16.19 15.545C16.19 16.564 16.67 17.473 17.36 18.055C16.67 19.591 15.3 21 14.42 21C13.54 21 13.04 20.491 12.29 20.491C11.54 20.491 10.9 21 10.05 21C9.2 21 7.78 19.61 7.12 18.055C7.82 17.473 8.29 16.564 8.29 15.545C8.29 14.527 7.81 13.618 7.12 13.036C7.79 11.5 8.4 10.618 9 10.618Z" fill="black"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (provider) {
      case 'google':
        return 'Log In with Google';
      case 'facebook':
        return 'Log In with Facebook';
      case 'apple':
        return 'Log In with Apple';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full py-2 mt-4 text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
    >
      <span className="mr-2">{getIcon()}</span>
      <span>{getLabel()}</span>
    </button>
  );
};

export default SocialLoginButton;
