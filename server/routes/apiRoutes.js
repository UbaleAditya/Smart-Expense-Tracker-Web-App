// ====================================================================
// server/routes/apiRoutes.js - Central REST API Route Manifest
// ====================================================================

const express = require('express');
const router = express.Router();

// Import our controller operational handlers
const authCtrl = require('../controllers/authController');
const txnCtrl = require('../controllers/transactionController');
const budgetCtrl = require('../controllers/budgetController');
const dashCtrl = require('../controllers/dashboardController');

// Import our secure session token gateway guard middleware
const checkSecurity = require('../middleware/authMiddleware');

// --------------------------------------------------------------------
// Public Authentication Gateways
// --------------------------------------------------------------------
router.post('/auth/register', authCtrl.registerProfile);
router.post('/auth/login', authCtrl.loginProfile);

// --------------------------------------------------------------------
// Private Core Mutation Gateways (Protected by JWT Shield Middleware)
// --------------------------------------------------------------------
router.post('/transactions', checkSecurity, txnCtrl.logTransaction);
router.get('/transactions', checkSecurity, txnCtrl.fetchLedgerItems);
router.delete('/transactions/:id', checkSecurity, txnCtrl.purgeTransaction);

router.post('/budgets', checkSecurity, budgetCtrl.defineOrModifyBudget);
router.get('/budgets', checkSecurity, budgetCtrl.fetchActiveBudgets);

router.get('/dashboard/summary', checkSecurity, dashCtrl.fetchAnalyticalDashboardSummary);

module.exports = router;