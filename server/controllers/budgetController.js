// ====================================================================
// server/controllers/budgetController.js - Budget Threshold Logic
// ====================================================================

const Budget = require('../models/Budget');

// --------------------------------------------------------------------
// CREATE / UPDATE: Define a spending cap or update an existing one
// --------------------------------------------------------------------
exports.defineOrModifyBudget = async (req, res) => {
    try {
        const { category, amount, period } = req.body;
        
        // Use findOneAndUpdate with upsert:true to intelligently save or update single-row configurations
        const updatePayload = await Budget.findOneAndUpdate(
            { userId: req.user.id, category }, // Search condition matrix
            { amount, period: period || 'monthly' }, // Modification assignment rules
            { new: true, upsert: true, runValidators: true } // Upsert fallback options
        );
        
        res.status(200).json({ 
            success: true, 
            data: updatePayload 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --------------------------------------------------------------------
// READ: Fetch all operational budget rules assigned to the active user
// --------------------------------------------------------------------
exports.fetchActiveBudgets = async (req, res) => {
    try {
        const dynamicSet = await Budget.find({ userId: req.user.id });
        
        res.status(200).json({ 
            success: true, 
            data: dynamicSet 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};