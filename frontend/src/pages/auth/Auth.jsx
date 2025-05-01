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
  const { isSignedIn, isLoaded } = useAuth(); // Add isLoaded

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }

  // Redirect to homepage if signed in
  if (isSignedIn) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <div
      className='sign-in-container'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}
    >
      <SignedOut>
        <h2>Welcome! Please sign in or sign up to continue.</h2>
        <SignUpButton mode='modal'  />
        <SignInButton mode='modal'  />
      </SignedOut>

      <SignedIn>
        <h2>You are signed in!</h2>
        <UserButton  />
        <SignOutButton >
          <button style={{ marginTop: '1rem' }}>Sign Out</button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
};

export default Auth;