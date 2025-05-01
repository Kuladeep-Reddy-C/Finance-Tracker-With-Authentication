import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true // Add an index for better query performance
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        index: true // Add an index for sorting by date
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxLength: [200, 'Description cannot exceed 200 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        validate: {
            validator: function(value) {
                return !isNaN(value); // Ensure amount is a valid number
            },
            message: 'Amount must be a valid number'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: {
            values: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
            message: '{VALUE} is not a supported payment method'
        }
    }
}, {
    timestamps: true // Add createdAt and updatedAt timestamps
});

// Create a compound index for userId and date for common queries
transactionSchema.index({ userId: 1, date: -1 });

const TransactionModel = mongoose.model('Transaction', transactionSchema);
export default TransactionModel;