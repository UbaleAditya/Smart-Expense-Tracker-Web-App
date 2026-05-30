// ====================================================================
// server/server.js - Primary Backend Application Entry Engine
// ====================================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDatabaseCluster = require('./config/db');
const routesManifest = require('./routes/apiRoutes');

const app = express();

// 1. Initialize our persistent database cluster connection loop
connectDatabaseCluster();

// 2. Attach global cross-origin resource sharing rules
app.use(cors());

// 3. Attach incoming JSON payload body-parsing middleware
app.use(express.json());

// 4. Attach professional HTTP request dev logger streams
app.use(morgan('dev'));

// 5. Direct incoming API traffic streams straight to our route manifest layer
app.use('/api', routesManifest);

// 6. Base health monitor gate confirmation path link
app.get('/', (req, res) => {
    res.status(200).send('🚀 Smart Expense Tracker RESTful Server Core System Online.');
});

// 7. Initialize deployment listener on our designated system environment port
const TARGET_RUNNING_PORT = process.env.PORT || 5000;
app.listen(TARGET_RUNNING_PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Engine Deploy Listening Verification Port: ${TARGET_RUNNING_PORT}`);
    console.log(`==================================================`);
});