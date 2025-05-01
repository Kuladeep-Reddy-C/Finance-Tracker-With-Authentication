import express from 'express';
import { requireAuth } from '@clerk/express';
import TransactionModel from '../model/user.model.js';

const router = express.Router();

// Apply requireAuth middleware once at the router level
router.use(requireAuth());

// Add better error handling and logging
router.get('/getAll/:userId', async (req, res, next) => {
    try {
        console.log(`Getting transactions for userId: ${req.params.userId}`);
        
        // Verify the authenticated user is requesting their own data
        if (req.params.userId !== req.auth.userId) {
            return res.status(403).json({ message: 'Unauthorized: Can only access your own transactions' });
        }
        
        const transactions = await TransactionModel.find({ userId: req.params.userId })
            .limit(100) // Add a limit to avoid excessive data
            .sort({ date: -1 }); // Sort by date descending
            
        console.log(`Found ${transactions.length} transactions`);
        
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }
        
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error in getAll route:', error);
        next(error); // Pass to error handler
    }
});


router.post('/', async (req, res, next) => {
    try {
        console.log('Creating new transaction with data:', JSON.stringify(req.body));
        
        // Validate that userId in the body matches the authenticated user
        if (!req.body.userId || req.body.userId !== req.auth.userId) {
            return res.status(403).json({ 
                message: 'Unauthorized: User ID in request does not match authenticated user' 
            });
        }
        
        const newTransaction = new TransactionModel({
            userId: req.auth.userId,
            date: req.body.date,
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            paymentMethod: req.body.paymentMethod
        });
        
        const savedTransaction = await newTransaction.save();
        console.log('Transaction saved successfully with ID:', savedTransaction._id);
        
        res.status(201).json(savedTransaction);
    } catch (error) {
        console.error('Error in create transaction route:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error', 
                details: Object.values(error.errors).map(e => e.message)
            });
        }
        
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;
        
        console.log(`Deleting transaction ${id} for user ${userId}`);
        
        // Find first to check if it exists
        const transaction = await TransactionModel.findOne({ _id: id });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // Check if the transaction belongs to the authenticated user
        if (transaction.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized: Cannot delete another user\'s transaction' });
        }
        
        await TransactionModel.deleteOne({ _id: id });
        console.log('Transaction deleted successfully');
        
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error in delete route:', error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid transaction ID format' });
        }
        
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;
        
        console.log(`Updating transaction ${id} for user ${userId}`);
        
        // Find first to check if it exists and belongs to user
        const transaction = await TransactionModel.findOne({ _id: id });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // Check if the transaction belongs to the authenticated user
        if (transaction.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized: Cannot update another user\'s transaction' });
        }
        
        const updatedData = {
            date: req.body.date,
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            paymentMethod: req.body.paymentMethod
        };
        
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );
        
        console.log('Transaction updated successfully');
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error in update route:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error', 
                details: Object.values(error.errors).map(e => e.message)
            });
        }
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid transaction ID format' });
        }
        
        next(error);
    }
});

export default router;