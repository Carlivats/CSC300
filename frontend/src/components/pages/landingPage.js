import React from 'react';

const Landingpage = () => {
  const handleGuestAccess = () => {
    // Clear any existing tokens to ensure guest status
    localStorage.removeItem("accessToken");
    // Set a flag to indicate guest status
    localStorage.setItem("guestUser", "true");
    window.location.href = "/mbtaLayout";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center text-gray-900">
        <h1 className="text-3xl font-bold mb-4">🚆 MBTA PTAR</h1>
        <h2 className="text-lg font-semibold text-indigo-600 mb-6">MBTA Public Transit Activity Reporter</h2>
        <p className="mb-8">
          Track real-time train locations, view occupancy levels, and get live updates from Boston's transit system.
        </p>
        <div className="flex flex-col space-y-4">
          <a
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl font-semibold transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="text-indigo-600 hover:underline text-sm"
          >
            Already have an account? Log in
          </a>
          <button
            onClick={handleGuestAccess}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-xl font-semibold transition mt-2"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
