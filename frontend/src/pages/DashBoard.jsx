import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignUpButton,
  SignOutButton,
} from '@clerk/clerk-react';

const DashBoard = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center">
        <img
          src="https://www.svgrepo.com/show/354262/finance.svg"
          alt="Finance Tracker"
          className="w-48 mx-auto mb-6"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
          Welcome {user?.firstName || 'Guest'} 👋
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          This is your personal <strong>Finance Tracker</strong> — built with care by a budget-conscious developer for budget-conscious students!
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link
            to="/show-form"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl shadow-md transition duration-300"
          >
            📊 Show Expenses
          </Link>
          <Link
            to="/fill-form"
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-xl shadow-md transition duration-300"
          >
            ➕ Add Expense
          </Link>
        </div>

        <SignedIn>
          <div className="mb-4">
            <UserButton />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">You're signed in!</h2>
          <SignOutButton>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-full mt-2 transition">
              🚪 Sign Out
            </button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Please sign in or sign up to continue.
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-xl transition">
                ✍️ Sign Up
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl transition">
                🔐 Sign In
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export default DashBoard;
