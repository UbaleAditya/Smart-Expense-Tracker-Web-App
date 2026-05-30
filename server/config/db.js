// ====================================================================
// server/config/db.js - Core Database Cluster Initializer
// ====================================================================

const mongoose = require('mongoose');

const connectDatabaseCluster = async () => {
    try {
        // Pull the connection URI securely from our environment file
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`==================================================`);
        console.log(`🍃 Database Cluster Securely Tethered Instance: ${connectionInstance.connection.host}`);
        console.log(`==================================================`);
    } catch (error) {
        console.error(`❌ Data Persist Connection Failure Triggered: ${error.message}`);
        // Terminate the Node process immediately if database mapping fails
        process.exit(1);
    }
};

module.exports = connectDatabaseCluster;