// ====================================================================
// server/controllers/transactionController.js - Ledger Mutation Handlers
// ====================================================================

const Transaction = require('../models/Transaction');

// --------------------------------------------------------------------
// CREATE: Log a brand-new income or expense row
// --------------------------------------------------------------------
exports.logTransaction = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        
        // Build the document record and tie it safely to the verified user's session token ID
        const newRecord = new Transaction({
            userId: req.user.id,
            amount,
            type,
            category,
            date: date || new Date(),
            description
        });
        
        // Persist to MongoDB
        await newRecord.save();
        
        res.status(201).json({ 
            success: true, 
            data: newRecord 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --------------------------------------------------------------------
// READ: Fetch all historical transaction rows logged by this user
// --------------------------------------------------------------------
exports.fetchLedgerItems = async (req, res) => {
    try {
        // Query rows owned by this specific user and order them chronologically (newest first)
        const queryHistory = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        
        res.status(200).json({ 
            success: true, 
            count: queryHistory.length, 
            data: queryHistory 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --------------------------------------------------------------------
// DELETE: Purge a specific transaction row securely
// --------------------------------------------------------------------
exports.purgeTransaction = async (req, res) => {
    try {
        // Ensure the transaction exists AND belongs to the active requesting user
        const targetDoc = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!targetDoc) {
            return res.status(404).json({ 
                success: false, 
                message: 'Target asset row parameters not verified.' 
            });
        }

        // Atomically erase the record from the cluster database
        await targetDoc.deleteOne();
        
        res.status(200).json({ 
            success: true, 
            message: 'Ledger item row completely scrubbed from storage database.' 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};