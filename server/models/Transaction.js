// ====================================================================
// server/models/Transaction.js - Transaction Ledger Data Schema
// ====================================================================

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Establishes a relational connection link to the User collection
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Numeric transaction valuation parameter is required']
    },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE'], // Strictly flags if money is flowing in or out
        required: [true, 'Transaction cashflow tracking classification is required']
    },
    category: {
        type: String,
        required: [true, 'Data category tracking assignment tag is mandatory'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Chronological target processing date parameter is required'],
        default: Date.now
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);