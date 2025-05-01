import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const ShowForm = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isLoaded } = useUser();
  const { isSignedIn, getToken } = useAuth();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:3000/api/getAll/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch transactions');
        }

        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);


  const handleDelete = async (_id) => {
    try {
   
      const token = await getToken();
      const response = await fetch(`http://localhost:3000/api/${_id}`,{
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },

      })
      setTransactions(transactions.filter(transaction => transaction._id !== _id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again.');
      setLoading(false);
    }
  }

  const handleUpdate = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleSave = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3000/api/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingTransaction)
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update transaction');
      }
  
      const updated = await response.json();
      setTransactions(prev =>
        prev.map(tx => (tx._id === updated._id ? updated : tx))
      );
      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">📑 Transaction List</h1>
          <p className="text-gray-600">View all your recorded expenses in one place</p>
        </div>

        {loading && (
          <div className="text-center text-blue-500 font-medium text-lg">Loading transactions...</div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold text-lg">{error}</div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="text-center text-gray-600 font-medium">No transactions available.</div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl shadow">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount (INR)</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Edit/Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-t hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{transaction.description}</td>
                    <td className="px-4 py-2">₹{transaction.amount}</td>
                    <td className="px-4 py-2">{transaction.category}</td>
                    <td className="px-4 py-2">{transaction.paymentMethod}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdate(transaction)}
                        className="text-blue-500 hover:underline"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {isModalOpen && editingTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
              <div className="space-y-4">
                <input
                  type="date"
                  value={editingTransaction.date?.split('T')[0] || ''}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, date: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  value={editingTransaction.description}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full border rounded p-2"
                />
                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, amount: e.target.value })
                  }
                  placeholder="Amount"
                  className="w-full border rounded p-2"
                />
                <select
                  value={editingTransaction.category}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, category: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Health">Health</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={editingTransaction.paymentMethod}
                  onChange={(e) =>
                    setEditingTransaction({ ...editingTransaction, paymentMethod: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Select Payment Method --</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/fill-form">
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl shadow transition">
              ➕ Add Transaction
            </button>
          </Link>
          <Link to="/auth">
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-xl shadow transition">
              🚪 Sign Out
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowForm;
