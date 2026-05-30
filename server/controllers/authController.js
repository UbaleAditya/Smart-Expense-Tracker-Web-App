// ====================================================================
// server/controllers/authController.js - Authentication Pipeline Engine
// ====================================================================

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --------------------------------------------------------------------
// REGISTRATION ENDPOINT - Sign up new users securely
// --------------------------------------------------------------------
exports.registerProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // 1. Check if the user already exists in our MongoDB registry
        let targetUser = await User.findOne({ email });
        if (targetUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Identity parameters already logged in registry database.' 
            });
        }

        // 2. Cryptographically hash the plain-text password using bcrypt salts
        const saltRounds = await bcrypt.genSalt(10);
        const securedHashPassword = await bcrypt.hash(password, saltRounds);

        // 3. Create and commit the new user document to the database cluster
        targetUser = new User({
            name,
            email,
            password: securedHashPassword
        });
        await targetUser.save();

        // 4. Issue a secure, signed JWT session token valid for 7 days
        const sessionToken = jwt.sign(
            { id: targetUser._id, email: targetUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Send back the token alongside profile details (omitting the password hash!)
        res.status(201).json({
            success: true,
            token: sessionToken,
            user: { name: targetUser.name, email: targetUser.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --------------------------------------------------------------------
// LOGIN ENDPOINT - Validate existing credentials
// --------------------------------------------------------------------
exports.loginProfile = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Search for the account profile via email query string
        const targetUser = await User.findOne({ email });
        if (!targetUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Authentication profile credentials invalid.' 
            });
        }

        // 2. Cross-examine hashes to verify password match precision
        const isMatch = await bcrypt.compare(password, targetUser.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'Authentication profile credentials invalid.' 
            });
        }

        // 3. Issue a secure signed passport access token
        const sessionToken = jwt.sign(
            { id: targetUser._id, email: targetUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            token: sessionToken,
            user: { name: targetUser.name, email: targetUser.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};