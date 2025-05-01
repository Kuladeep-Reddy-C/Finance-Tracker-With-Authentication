import { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  FileText,
  LoaderCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FillForm = () => {

  const url = "https://finance-tracker-with-authentication-2.onrender.com";
  const { user, isLoaded } = useUser();
  const { isSignedIn, getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Housing', 'Healthcare', 'Education', 'Other'];
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!formData.date || !formData.description || !formData.amount || !formData.category || !formData.paymentMethod) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(parseFloat(formData.amount))) {
      setError('Amount must be a valid number');
      setIsSubmitting(false);
      return;
    }

    const completeData = {
      userId: user.id,
      date: formData.date,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error('Authentication token not available');

      const response = await fetch(`${url}/api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(completeData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save transaction');

      setSuccess(true);
      setFormData({ date: '', description: '', amount: '', category: '', paymentMethod: '' });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'An error occurred when saving the transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500 mb-2" />
        <h2 className="text-xl font-semibold">Loading user data...</h2>
        <p className="text-gray-500">Please wait while we retrieve your information.</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <h2 className="text-xl font-semibold">Authentication Required</h2>
        <p className="text-gray-500">Please sign in to access the transaction form.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">New Transaction</h1>
        <p className="text-gray-500 mb-4">Record your financial activity</p>

        {error && (
          <div className="bg-red-100 text-red-600 flex items-center gap-2 p-3 rounded mb-4">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 flex items-center gap-2 p-3 rounded mb-4">
            <CheckCircle className="w-5 h-5" />
            <p>Transaction saved successfully!</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="What was this transaction for?"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Amount (INR)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              disabled={isSubmitting}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">--Select Category--</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                  className={`px-4 py-2 border rounded ${
                    formData.paymentMethod === method
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoaderCircle className="animate-spin w-4 h-4" />
                Saving...
              </span>
            ) : 'Save Transaction'}
          </button>

          <p className="text-sm text-gray-500 mt-2 text-center">
            Logged in as {user.fullName || user.username}
          </p>
          <Link to="/show-form" >
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl shadow transition">
            Back to Dashboard
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FillForm;
