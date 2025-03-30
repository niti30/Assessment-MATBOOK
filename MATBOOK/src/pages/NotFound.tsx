
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-highbridge-cream">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-highbridge-green">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
