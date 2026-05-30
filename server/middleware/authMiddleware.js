// ====================================================================
// server/middleware/authMiddleware.js - Stateless Session Guard
// ====================================================================

const jwt = require('jsonwebtoken');

const verifySecureTokenGate = (req, res, next) => {
    // Extract the authorization header string from the inbound request
    const accessHeader = req.headers.authorization || '';
    
    // Cleanly extract the token by slicing away the 'Bearer ' prefix schema
    const secureToken = accessHeader.startsWith('Bearer ') ? accessHeader.slice(7) : '';

    // If no token exists, immediately halt operation and throw a 401 Unauthorized status
    if (!secureToken) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. Security clearance token missing.' 
        });
    }

    try {
        // Validate signature alignment against our application server's secret environmental key
        const decodedTokenPayload = jwt.verify(secureToken, process.env.JWT_SECRET);
        
        // Attach the verified identity parameters directly onto the request context loop
        req.user = decodedTokenPayload; 
        
        // Advance smoothly to the controller function execution
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authorization rejected. Security signature invalid.' 
        });
    }
};

module.exports = verifySecureTokenGate;