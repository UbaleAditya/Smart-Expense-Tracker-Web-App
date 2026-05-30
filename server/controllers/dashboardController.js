// ====================================================================
// server/controllers/dashboardController.js - Aggregation Engine
// ====================================================================

const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

exports.fetchAnalyticalDashboardSummary = async (req, res) => {
    try {
        const activeUserId = req.user.id;
        
        // 1. Fetch all raw ledger rows tied to this user account
        const calculationsMatrix = await Transaction.find({ userId: activeUserId });
        
        let totalIncome = 0;
        let totalExpense = 0;
        const distributionDictionary = {};

        // 2. Run a unified compilation pass to extract operational cashflow totals
        calculationsMatrix.forEach(item => {
            if (item.type === 'INCOME') {
                totalIncome += item.amount;
            } else {
                totalExpense += item.amount;
                // Group spending sums across categories dynamically
                distributionDictionary[item.category] = (distributionDictionary[item.category] || 0) + item.amount;
            }
        });

        // 3. Fetch user budget caps and run live cross-examination validation checks
        const activeBudgets = await Budget.find({ userId: activeUserId });
        const budgetWarningTracks = [];

        activeBudgets.forEach(b => {
            const currentSpent = distributionDictionary[b.category] || 0;
            // Flag a breach if current category spending overflows past the assigned allowance limit
            if (currentSpent > b.amount) {
                budgetWarningTracks.push({
                    category: b.category,
                    allotted: b.amount,
                    burned: currentSpent,
                    breachAmount: currentSpent - b.amount
                });
            }
        });

        // 4. Return the aggregated data payload, ready for direct injection into our frontend charts
        res.status(200).json({
            totals: {
                income: totalIncome,
                expense: totalExpense,
                balance: totalIncome - totalExpense
            },
            categoryDistribution: distributionDictionary,
            breachedBudgets: budgetWarningTracks
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};