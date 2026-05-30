// ====================================================================
// server/models/Budget.js - Budget Management & Limit Constraints
// ====================================================================

const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Establishes a relational connection link to our User collection
        required: true
    },
    category: {
        type: String,
        required: [true, 'Target budget validation category context is mandatory'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Quantitative limit threshold boundary allocation is required']
    },
    period: {
        type: String,
        enum: ['monthly', 'weekly'],
        default: 'monthly'
    }
});

// Enforce a strict compound unique rule index so a user can only create one budget limit per category
BudgetSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);