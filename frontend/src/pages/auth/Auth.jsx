import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignUpButton,
  SignInButton,
  SignOutButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return <div className="text-center text-xl text-gray-500">Loading authentication...</div>;
  }

  // Redirect to homepage if signed in
  if (isSignedIn) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full sm:w-96'>
        <SignedOut>
          <h2 className='text-3xl font-semibold text-center text-gray-800 mb-6'>Welcome! Please sign in or sign up to continue.</h2>
          <div className='flex justify-center gap-4'>
            <SignUpButton mode='modal'>
              <button className='px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200'>Sign Up</button>
            </SignUpButton>
            <SignInButton mode='modal'>
              <button className='px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-200'>Sign In</button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <h2 className='text-3xl font-semibold text-center text-gray-800 mb-6'>You are signed in!</h2>
          <div className='flex justify-center'>
            <UserButton />
          </div>
          <div className='mt-4 text-center'>
            <SignOutButton>
              <button className='px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200'>
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Auth;
